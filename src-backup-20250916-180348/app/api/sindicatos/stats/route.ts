import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Por simplicidade, retornar dados mock por enquanto
    // TODO: Implementar autenticação adequada e buscar dados reais do sindicato

    const stats = {
      sindicatoName: 'Sindicato dos Farmacêuticos SP',
      totalDocumentos: 12,
      documentosRecentes: 3,
      totalMembros: 45,
      membrosAtivos: 42,
      convitesPendentes: 2,
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error("Erro ao buscar estatísticas do sindicato:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}