import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getAuthUser, hasRole } from '@/lib/auth'

// POST /api/sindicatos/[id]/approve - Aprovar sindicato
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode aprovar sindicatos
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem aprovar sindicatos.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Verificar se o sindicato existe
    const sindicato = await prisma.sindicato.findUnique({
      where: { id }
    })

    if (!sindicato) {
      return NextResponse.json(
        { error: 'Sindicato não encontrado' },
        { status: 404 }
      )
    }

    // Aprovar sindicato
    const updatedSindicato = await prisma.sindicato.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: user.id
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedSindicato)

  } catch (error) {
    console.error('Erro ao aprovar sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}