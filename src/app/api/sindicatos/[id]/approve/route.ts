import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// POST /api/sindicatos/[id]/approve - Aprovar sindicato
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    
    // Decodificar token para verificar role
    const jwt = require('jsonwebtoken')
    const payload = jwt.decode(token) as any
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar se o token expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 401 }
      )
    }

    // Buscar usuário no banco para verificar role
    const userId = payload.sub || payload.user_id
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não encontrado no token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Apenas FENAFAR_ADMIN pode aprovar sindicatos
    if (user.role !== UserRole.FENAFAR_ADMIN) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem aprovar sindicatos.' },
        { status: 403 }
      )
    }

    // Verificar se sindicato existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { id: params.id }
    })

    if (!existingSindicato) {
      return NextResponse.json(
        { error: 'Sindicato não encontrado' },
        { status: 404 }
      )
    }

    // Aprovar sindicato
    const sindicato = await prisma.sindicato.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: userId
      },
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      }
    })

    return NextResponse.json(sindicato)

  } catch (error) {
    console.error('Erro ao aprovar sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
