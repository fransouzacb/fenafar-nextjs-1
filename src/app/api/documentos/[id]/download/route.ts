import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { UserRole } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/documentos/[id]/download - Gerar URL de download
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Verificar se o usuário tem permissão
    if (user.role !== UserRole.SINDICATO_ADMIN && user.role !== UserRole.MEMBER) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const documento = await prisma.documento.findUnique({
      where: { id },
      include: {
        sindicato: {
          select: {
            id: true,
            admin: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão de acesso ao documento
    let hasAccess = false

    if (user.role === UserRole.SINDICATO_ADMIN) {
      // Verificar se o documento pertence ao sindicato que o usuário administra
      hasAccess = documento.sindicato.admin?.id === user.id
    } else if (user.role === UserRole.MEMBER) {
      // Verificar se o documento foi criado pelo próprio usuário
      // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      // Campo userId não existe no schema do Vercel - comentado temporariamente
      // hasAccess = documento.userId === user.id
      hasAccess = false // Temporariamente negar acesso até schema ser atualizado
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Acesso negado ao documento' },
        { status: 403 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Serviço de armazenamento não configurado' },
        { status: 500 }
      )
    }

    // Gerar URL assinada para download (válida por 1 hora)
    // Usar type assertion para compatibilidade entre schemas local/Vercel
    const filePath = (documento as any).fileUrl || (documento as any).arquivo
    const { data: signedUrl, error: urlError } = await supabaseAdmin.storage
      .from('fenafar-documents')
      .createSignedUrl(filePath, 3600) // 1 hora

    if (urlError) {
      console.error('❌ Erro ao gerar URL assinada:', urlError)
      return NextResponse.json(
        { error: 'Erro ao gerar link de download' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      downloadUrl: signedUrl.signedUrl,
      fileName: (documento as any).name || (documento as any).titulo, // Compatibilidade entre schemas
      fileSize: (documento as any).fileSize || (documento as any).tamanho, // Compatibilidade entre schemas
      mimeType: documento.mimeType,
      expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hora a partir de agora
    })

  } catch (error: any) {
    console.error('❌ Erro ao gerar URL de download:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
