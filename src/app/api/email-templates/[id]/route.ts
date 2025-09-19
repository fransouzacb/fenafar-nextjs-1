import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/email-templates/[id] - Obter template específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode ver templates
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem ver templates.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Buscar template
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)

  } catch (error) {
    console.error('Erro ao buscar template:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/email-templates/[id] - Atualizar template
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode atualizar templates
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem atualizar templates.' },
        { status: 403 }
      )
    }

    const { id } = await params
    const data = await request.json()

    // Verificar se template existe
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { id }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar template
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.subject && { subject: data.subject }),
        ...(data.htmlContent && { htmlContent: data.htmlContent }),
        ...(data.textContent !== undefined && { textContent: data.textContent }),
        ...(data.variables && { variables: data.variables }),
        ...(data.type && { type: data.type }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(template)

  } catch (error: any) {
    console.error('Erro ao atualizar template:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json(
        { error: 'Já existe um template com este nome' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/email-templates/[id] - Excluir template
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode excluir templates
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem excluir templates.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Verificar se template existe
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { id }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    // Excluir template
    await prisma.emailTemplate.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao excluir template:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
