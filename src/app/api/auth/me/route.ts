import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    
    // Decodificar token
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

    // Para tokens do Supabase, usar o user_id
    const userId = payload.sub || payload.user_id
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não encontrado no token' },
        { status: 401 }
      )
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailConfirmed: true,
        active: true,
        cpf: true,
        cargo: true,
        sindicatoId: true,
        createdAt: true,
        updatedAt: true,
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        }
      }
    })

    if (!user || !user.active) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou inativo' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
