import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Obter usuário autenticado via cookies
    const authUser = getAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Buscar usuário completo no banco
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
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

    console.log('🔍 DEBUG /api/auth/me - Usuário encontrado:', user)

    if (!user || !user.active) {
      console.log('❌ DEBUG /api/auth/me - Usuário não encontrado ou inativo')
      return NextResponse.json(
        { error: 'Usuário não encontrado ou inativo' },
        { status: 404 }
      )
    }

    console.log('✅ DEBUG /api/auth/me - Retornando usuário com sucesso')
    return NextResponse.json(user)

  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
