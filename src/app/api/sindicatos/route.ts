import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getAuthUser, hasRole } from '@/lib/auth'

// GET /api/sindicatos - Listar sindicatos
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

    // Apenas FENAFAR_ADMIN pode listar todos os sindicatos
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem listar sindicatos.' },
        { status: 403 }
      )
    }

    // Buscar sindicatos com contagem de membros
    const sindicatos = await prisma.sindicato.findMany({
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(sindicatos)

  } catch (error) {
    console.error('Erro ao buscar sindicatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/sindicatos - Criar sindicato
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

    // Apenas FENAFAR_ADMIN pode criar sindicatos
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem criar sindicatos.' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const newSindicato = await prisma.sindicato.create({
      data: {
        ...data,
        status: 'PENDING', // Novo sindicato sempre começa como PENDING
      },
    })

    return NextResponse.json(newSindicato, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar sindicato:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('cnpj')) {
      return NextResponse.json(
        { error: 'CNPJ já cadastrado' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
