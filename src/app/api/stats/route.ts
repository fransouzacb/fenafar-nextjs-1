import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Verificar se há header de autorização
    const authorization = request.headers.get('Authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Token de autorização necessário" }, { status: 401 })
    }

    // Por simplicidade, vamos permitir qualquer token por enquanto
    // TODO: Implementar verificação adequada de token

    // Buscar estatísticas
    const [
      users,
      sindicatos,
      documentos,
      convites,
      sindicatosAtivos,
      usersAtivos,
      documentosRecentes,
    ] = await Promise.all([
      // Total de usuários
      prisma.user.count(),
      
      // Total de sindicatos
      prisma.sindicato.count(),
      
      // Total de documentos
      prisma.documento.count(),
      
      // Total de convites ativos
      prisma.convite.count({
        where: {
          acceptedAt: null,
          expiresAt: {
            gte: new Date()
          }
        }
      }),
      
      // Sindicatos ativos 
      prisma.sindicato.count({
        where: {
          active: true
        }
      }),
      
      // Usuários ativos
      prisma.user.count({
        where: {
          active: true
        }
      }),
      
      // Documentos recentes (últimos 7 dias)
      prisma.documento.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dias atrás
          }
        }
      }),
    ])

    const stats = {
      users,
      sindicatos,
      membros: users, // Por agora, usar usuários como membros
      documentos,
      convites,
      sindicatosAtivos,
      membrosAtivos: usersAtivos, // Usar usuários ativos
      documentosPendentes: documentosRecentes, // Usar documentos recentes como "pendentes"
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
