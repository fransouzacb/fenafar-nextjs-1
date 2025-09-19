import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getAuthUser, hasRole } from '@/lib/auth'

// GET /api/convites - Listar convites
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

    // Apenas FENAFAR_ADMIN pode listar todos os convites
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem listar convites.' },
        { status: 403 }
      )
    }

    // Buscar convites com informações relacionadas
    const convites = await prisma.convite.findMany({
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        },
        criadoPor: {
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

    return NextResponse.json({ convites })

  } catch (error) {
    console.error('Erro ao buscar convites:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/convites - Criar convite
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

    // Apenas FENAFAR_ADMIN pode criar convites
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem criar convites.' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Gerar token único
    const token = crypto.randomUUID()

    // Definir data de expiração (7 dias)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const newConvite = await prisma.convite.create({
      data: {
        ...data,
        token,
        expiresAt,
        criadoPorId: user.id,
        usado: false
      },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        },
        criadoPor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newConvite, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar convite:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { error: 'Email já possui convite pendente' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
