import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { EmailTemplate } from '@/lib/email'

// GET /api/email-templates - Listar templates
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode gerenciar templates
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem gerenciar templates.' },
        { status: 403 }
      )
    }

    // Buscar templates do banco de dados
    const templates = await prisma.emailTemplate.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ templates })

  } catch (error) {
    console.error('Erro ao buscar templates:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/email-templates - Criar template
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode criar templates
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem criar templates.' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Validar dados obrigatórios
    if (!data.name || !data.subject || !data.htmlContent || !data.type) {
      return NextResponse.json(
        { error: 'Nome, assunto, conteúdo HTML e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar template
    const template = await prisma.emailTemplate.create({
      data: {
        name: data.name,
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent,
        variables: data.variables || [],
        type: data.type,
        isActive: data.isActive !== false,
        createdById: user.id
      }
    })

    return NextResponse.json(template, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar template:', error)
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
