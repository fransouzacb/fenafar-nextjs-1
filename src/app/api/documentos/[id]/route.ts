import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { UserRole } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/documentos/[id] - Buscar documento específico
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
      const sindicato = await prisma.sindicato.findUnique({
        where: { adminId: user.id },
        select: { id: true }
      })
      hasAccess = sindicato?.id === documento.sindicatoId
    } else if (user.role === UserRole.MEMBER) {
      // Verificar se o documento foi criado pelo próprio usuário
      // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      hasAccess = documento.userId === user.id
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Acesso negado ao documento' },
        { status: 403 }
      )
    }

    return NextResponse.json(documento)

  } catch (error: any) {
    console.error('❌ Erro ao buscar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/documentos/[id] - Atualizar documento
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const data = await request.json()
    const { titulo, tipo, descricao, ativo } = data

    // Buscar documento existente
    const documentoExistente = await prisma.documento.findUnique({
      where: { id },
      include: {
        sindicato: {
          select: {
            id: true,
            adminId: true
          }
        }
      }
    })

    if (!documentoExistente) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão de edição
    let canEdit = false

    if (user.role === UserRole.SINDICATO_ADMIN) {
      // Verificar se o documento pertence ao sindicato que o usuário administra
      canEdit = documentoExistente.sindicato.adminId === user.id
    } else if (user.role === UserRole.MEMBER) {
      // Verificar se o documento foi criado pelo próprio usuário
      canEdit = documentoExistente.userId === user.id
    }

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este documento' },
        { status: 403 }
      )
    }

    // Atualizar documento
    const documentoAtualizado = await prisma.documento.update({
      where: { id },
      data: {
        ...(titulo && { titulo: titulo.trim() }),
        ...(tipo && { tipo }),
        ...(descricao !== undefined && { descricao }),
        ...(ativo !== undefined && { ativo })
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

    return NextResponse.json({
      success: true,
      message: 'Documento atualizado com sucesso!',
      documento: documentoAtualizado
    })

  } catch (error: any) {
    console.error('❌ Erro ao atualizar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/documentos/[id] - Deletar documento
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Buscar documento existente
    const documentoExistente = await prisma.documento.findUnique({
      where: { id },
      include: {
        sindicato: {
          select: {
            id: true,
            adminId: true
          }
        }
      }
    })

    if (!documentoExistente) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão de exclusão
    let canDelete = false

    if (user.role === UserRole.SINDICATO_ADMIN) {
      // Verificar se o documento pertence ao sindicato que o usuário administra
      canDelete = documentoExistente.sindicato.adminId === user.id
    } else if (user.role === UserRole.MEMBER) {
      // Verificar se o documento foi criado pelo próprio usuário
      canDelete = documentoExistente.userId === user.id
    }

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Sem permissão para excluir este documento' },
        { status: 403 }
      )
    }

    // Deletar arquivo do Supabase Storage
    if (supabaseAdmin && documentoExistente.arquivo) {
      try {
        const { error: deleteError } = await supabaseAdmin.storage
          .from('fenafar-documents')
          .remove([documentoExistente.arquivo])

        if (deleteError) {
          console.error('⚠️ Erro ao deletar arquivo do storage:', deleteError)
          // Continuar com a exclusão do banco mesmo se falhar no storage
        } else {
          console.log('✅ Arquivo deletado do storage:', documentoExistente.arquivo)
        }
      } catch (storageError) {
        console.error('⚠️ Erro no storage:', storageError)
        // Continuar com a exclusão do banco
      }
    }

    // Deletar registro do banco
    await prisma.documento.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Documento excluído com sucesso!'
    })

  } catch (error: any) {
    console.error('❌ Erro ao deletar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
