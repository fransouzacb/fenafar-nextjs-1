import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      resumo: {
        totalUsuarios: 25,
        totalSindicatos: 8,
        totalMembros: 150
      }
    }
  })
}
