import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getAuthUser, hasRole } from '@/lib/auth'

// GET /api/convites/[id] - Buscar convite específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const convite = await prisma.convite.findUnique({
      where: { id: params.id },
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

    if (!convite) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(convite)
  } catch (error) {
    console.error('Erro ao buscar convite:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/convites/[id] - Atualizar convite
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const updatedConvite = await prisma.convite.update({
      where: { id: params.id },
      data,
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

    return NextResponse.json(updatedConvite)
  } catch (error: any) {
    console.error('Erro ao atualizar convite:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/convites/[id] - Excluir convite
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    await prisma.convite.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Convite excluído com sucesso' })
  } catch (error: any) {
    console.error('Erro ao excluir convite:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
