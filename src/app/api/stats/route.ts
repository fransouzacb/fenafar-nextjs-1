import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Buscar estatísticas em paralelo
    const [
      totalUsers,
      totalSindicatos,
      totalDocumentos,
      pendingInvites,
      activeSindicatos,
      activeMembers,
      recentDocumentos,
      totalMembers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.sindicato.count(),
      prisma.documento.count(),
      prisma.convite.count({
        where: {
          acceptedAt: null,
          expiresAt: {
            gte: new Date()
          }
        }
      }),
      prisma.sindicato.count({
        where: {
          active: true
        }
      }),
      prisma.user.count({
        where: {
          role: UserRole.MEMBER,
          active: true
        }
      }),
      prisma.documento.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.count({
        where: {
          role: UserRole.MEMBER
        }
      }),
    ])

    const stats = {
      totalUsers,
      totalSindicatos,
      totalDocumentos,
      pendingInvites,
      activeSindicatos,
      activeMembers,
      recentDocumentos,
      totalMembers,
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
