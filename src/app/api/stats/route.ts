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
      totalMembros,
      pendingInvites,
      activeSindicatos,
      activeMembers,
      recentDocumentos,
      totalAdmins,
      totalSindicatoAdmins,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.sindicato.count(),
      prisma.documento.count(),
      prisma.membro.count(),
      prisma.convite.count({
        where: {
          usado: false,
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
      prisma.membro.count({
        where: {
          ativo: true
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
          role: UserRole.FENAFAR_ADMIN
        }
      }),
      prisma.user.count({
        where: {
          role: UserRole.SINDICATO_ADMIN
        }
      }),
    ])

    const stats = {
      totalUsers,
      totalSindicatos,
      totalDocumentos,
      totalMembros,
      pendingInvites,
      activeSindicatos,
      activeMembers,
      recentDocumentos,
      totalAdmins,
      totalSindicatoAdmins,
      // Estatísticas calculadas
      totalActiveUsers: activeMembers + totalSindicatoAdmins + totalAdmins,
      documentosPorSindicato: totalSindicatos > 0 ? Math.round(totalDocumentos / totalSindicatos * 100) / 100 : 0,
      membrosPorSindicato: totalSindicatos > 0 ? Math.round(totalMembros / totalSindicatos * 100) / 100 : 0,
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
