import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

// GET /api/sindicatos - Listar sindicatos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const ativo = searchParams.get("ativo")
    const estado = searchParams.get("estado")
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { cnpj: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (ativo !== null) {
      where.ativo = ativo === "true"
    }
    
    if (estado) {
      where.state = estado
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Buscar sindicatos
    const [sindicatos, total] = await Promise.all([
      prisma.sindicato.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              
              documentos: true
            }
          }
        }
      }),
      prisma.sindicato.count({ where })
    ])

    return NextResponse.json({
      success: true,
      sindicatos,
      data: {
        sindicatos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error("Erro ao listar sindicatos:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/sindicatos - Criar sindicato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome,
      cnpj,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
      adminEmail,
      adminName,
      adminPassword
    } = body

    // Validar dados obrigatórios
    if (!nome || !cnpj || !email || !cidade || !estado || !adminEmail || !adminName || !adminPassword) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      )
    }

    // Verificar se CNPJ já existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { cnpj }
    })

    if (existingSindicato) {
      return NextResponse.json(
        { success: false, error: "CNPJ já cadastrado" },
        { status: 409 }
      )
    }

    // Verificar se email do admin já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email do administrador já cadastrado" },
        { status: 409 }
      )
    }

    // Criar usuário admin no Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: adminName,
          role: "SINDICATO_ADMIN"
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar usuário: " + authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar usuário" },
        { status: 400 }
      )
    }

    // Criar usuário no banco local
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: adminEmail,
        name: adminName,
        role: "SINDICATO_ADMIN"
      }
    })

    // Criar sindicato
    const sindicato = await prisma.sindicato.create({
      data: {
        name: nome,
        cnpj,
        email,
        phone: telefone,
        address: endereco,
        city: cidade,
        state: estado,
        zipCode: cep,
      }
    })

    return NextResponse.json({
      success: true,
      sindicato,
      admin: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      message: "Sindicato criado com sucesso"
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar sindicato:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
