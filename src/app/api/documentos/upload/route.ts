import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { UserRole } from '@prisma/client'

// Configurações de upload
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain'
]

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt']

// POST /api/documentos/upload - Upload de documento
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Verificar se o usuário tem permissão para upload
    if (user.role !== UserRole.SINDICATO_ADMIN && user.role !== UserRole.MEMBER) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Verificar se Supabase está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Serviço de armazenamento não configurado' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const titulo = formData.get('titulo') as string
    const tipo = formData.get('tipo') as string
    const descricao = formData.get('descricao') as string

    // Validações
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' },
        { status: 400 }
      )
    }

    if (!titulo || titulo.trim().length === 0) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    if (!tipo) {
      return NextResponse.json(
        { error: 'Tipo do documento é obrigatório' },
        { status: 400 }
      )
    }

    // Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Validar tipo do arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Tipos aceitos: PDF, DOC, DOCX, JPG, PNG, GIF, TXT' },
        { status: 400 }
      )
    }

    // Validar extensão do arquivo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Extensão de arquivo não permitida' },
        { status: 400 }
      )
    }

    // Buscar sindicato do usuário
    let sindicatoId: string | null = null
    
    if (user.role === UserRole.SINDICATO_ADMIN) {
      // Para SINDICATO_ADMIN, buscar o sindicato que ele administra
      const sindicato = await prisma.sindicato.findUnique({
        where: { adminId: user.id },
        select: { id: true }
      })
      sindicatoId = sindicato?.id || null
    } else if (user.role === UserRole.MEMBER) {
      // Para MEMBER, por enquanto não há associação direta
      // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      console.log(`📝 MEMBER ${user.email} tentando fazer upload (sem associação ao sindicato)`)
    }

    if (!sindicatoId) {
      return NextResponse.json(
        { error: 'Usuário não está associado a nenhum sindicato' },
        { status: 400 }
      )
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileName = `${timestamp}-${randomId}${fileExtension}`
    
    // Caminho no Supabase Storage
    const filePath = `documentos/${sindicatoId}/${fileName}`

    console.log('📁 Fazendo upload do arquivo:', {
      originalName: file.name,
      fileName,
      filePath,
      size: file.size,
      type: file.type,
      sindicatoId
    })

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('fenafar-documents')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Erro no upload para Supabase:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo: ' + uploadError.message },
        { status: 500 }
      )
    }

    console.log('✅ Upload realizado com sucesso:', uploadData)

    // Salvar informações no banco de dados
    const documento = await prisma.documento.create({
      data: {
        titulo: titulo.trim(),
        tipo: tipo as any,
        arquivo: uploadData.path,
        tamanho: file.size,
        mimeType: file.type,
        versao: '1.0',
        ativo: true,
        sindicatoId,
        userId: user.id
      },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    console.log('✅ Documento salvo no banco:', documento.id)

    return NextResponse.json({
      success: true,
      message: 'Documento enviado com sucesso!',
      documento: {
        id: documento.id,
        titulo: documento.titulo,
        tipo: documento.tipo,
        arquivo: documento.arquivo,
        tamanho: documento.tamanho,
        mimeType: documento.mimeType,
        versao: documento.versao,
        ativo: documento.ativo,
        createdAt: documento.createdAt,
        sindicato: documento.sindicato,
        user: documento.user
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Erro no upload de documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
