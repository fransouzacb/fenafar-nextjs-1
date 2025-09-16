import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

// GET /api/documentos - Listar documentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const tipo = searchParams.get("tipo")
    const sindicatoId = searchParams.get("sindicatoId")
    const membroId = searchParams.get("membroId")
    const ativo = searchParams.get("ativo")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.titulo = { contains: search, mode: "insensitive" }
    }
    
    if (tipo) {
      where.tipo = tipo
    }
    
    if (sindicatoId) {
      where.sindicatoId = sindicatoId
    }
    
    if (membroId) {
      where.membroId = membroId
    }
    
    if (ativo !== null) {
      where.ativo = ativo === "true"
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Buscar documentos
    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          sindicato: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.documento.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        documentos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error("Erro ao listar documentos:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/documentos - Upload de documento
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const titulo = formData.get("titulo") as string
    const tipo = formData.get("tipo") as string
    const sindicatoId = formData.get("sindicatoId") as string
    const membroId = formData.get("membroId") as string

    // Validar dados obrigatórios
    if (!file || !titulo || !tipo || !sindicatoId) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipo de arquivo não permitido" },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Arquivo muito grande. Máximo 10MB" },
        { status: 400 }
      )
    }

    // Verificar se sindicato existe
    const sindicato = await prisma.sindicato.findUnique({
      where: { id: sindicatoId }
    })

    if (!sindicato) {
      return NextResponse.json(
        { success: false, error: "Sindicato não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se membro existe (se fornecido)
    if (membroId) {
      const membro = await prisma.user.findUnique({
        where: { 
          id: membroId,
          role: "MEMBER"
        }
      })

      if (!membro) {
        return NextResponse.json(
          { success: false, error: "Membro não encontrado" },
          { status: 404 }
        )
      }
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `${sindicatoId}_${timestamp}.${extension}`
    
    // Determinar bucket baseado no tipo
    const bucket = tipo === "AVATAR" ? "avatars" : "documentos"
    const path = `${tipo.toLowerCase()}/${fileName}`

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: "Erro no upload: " + uploadError.message },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    // Salvar no banco de dados
    const documento = await prisma.documento.create({
      data: {
        name: titulo,
        tipo: tipo as any,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: file.type,
        description: "Versão 1.0",
        active: true,
        sindicatoId
      },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      documento,
      message: "Documento enviado com sucesso"
    }, { status: 201 })

  } catch (error) {
    console.error("Erro no upload de documento:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
