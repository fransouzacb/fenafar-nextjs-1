import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET /api/sindicato/stats - Estatísticas do sindicato
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Verificar se o usuário tem permissão
    if (![UserRole.SINDICATO_ADMIN, UserRole.MEMBER].includes(user.role)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    let sindicatoId: string | null = null

    // Buscar sindicato do usuário
    if (user.role === UserRole.SINDICATO_ADMIN) {
      const sindicato = await prisma.sindicato.findUnique({
        where: { adminId: user.id },
        select: { id: true }
      })
      sindicatoId = sindicato?.id || null
    } else if (user.role === UserRole.MEMBER) {
      // Para MEMBER, por enquanto não há associação direta
      // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      console.log(`📝 MEMBER ${user.email} acessando estatísticas (sem associação ao sindicato)`)
    }

    if (!sindicatoId) {
      return NextResponse.json({
        totalMembros: 0,
        totalDocumentos: 0,
        convitesPendentes: 0,
        ultimaAtividade: 'Nenhuma atividade recente',
        status: 'PENDING'
      })
    }

    // Buscar estatísticas
    const [
      totalMembros,
      totalDocumentos,
      convitesPendentes,
      ultimoDocumento,
      sindicato
    ] = await Promise.all([
      // Total de membros (apenas para SINDICATO_ADMIN)
      // Como o schema atual não tem relação direta MEMBER-Sindicato,
      // vamos contar os convites MEMBER pendentes para este sindicato
      user.role === UserRole.SINDICATO_ADMIN 
        ? prisma.convite.count({
            where: { 
              role: UserRole.MEMBER,
              sindicatoId: sindicatoId,
              usado: true // Membros que aceitaram o convite
            }
          })
        : Promise.resolve(0),
      
      // Total de documentos
      prisma.documento.count({
        where: { sindicatoId }
      }),
      
      // Convites pendentes (apenas para SINDICATO_ADMIN)
      user.role === UserRole.SINDICATO_ADMIN
        ? prisma.convite.count({
            where: {
              sindicatoId,
              usado: false,
              expiresAt: { gte: new Date() }
            }
          })
        : Promise.resolve(0),
      
      // Último documento enviado
      prisma.documento.findFirst({
        where: { sindicatoId },
        orderBy: { createdAt: 'desc' },
        select: {
          titulo: true,
          createdAt: true,
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      
      // Informações do sindicato
      prisma.sindicato.findUnique({
        where: { id: sindicatoId },
        select: {
          status: true,
          name: true
        }
      })
    ])

    // Formatar última atividade
    let ultimaAtividade = 'Nenhuma atividade recente'
    if (ultimoDocumento) {
      const dataFormatada = new Date(ultimoDocumento.createdAt).toLocaleDateString('pt-BR')
      ultimaAtividade = `Último documento: ${ultimoDocumento.titulo} (${dataFormatada})`
    }

    return NextResponse.json({
      totalMembros,
      totalDocumentos,
      convitesPendentes,
      ultimaAtividade,
      status: sindicato?.status || 'PENDING',
      sindicatoName: sindicato?.name,
      sindicatoId: sindicatoId
    })

  } catch (error: any) {
    console.error('❌ Erro ao buscar estatísticas do sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
