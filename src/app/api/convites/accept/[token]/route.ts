import { NextRequest, NextResponse } from "next/server"

// GET /api/convites/accept/[token] - Validar token e obter dados do convite
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Simulação para desenvolvimento
    const mockConvite = {
      id: token,
      email: 'convite@exemplo.com',
      role: 'SINDICATO_ADMIN',
      expirado: false,
      usado: false,
      nomeSindicato: 'Sindicato Exemplo',
      cnpjSindicato: '12.345.678/0001-00',
      cidadeSindicato: 'São Paulo',
      estadoSindicato: 'SP',
      criadoPor: {
        nome: 'Admin FENAFAR',
        email: 'admin@fenafar.com.br'
      }
    }

    return NextResponse.json({
      success: true,
      convite: mockConvite
    })

  } catch (error) {
    console.error("Erro ao validar convite:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/convites/accept/[token] - Aceitar convite
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    
    console.log('Aceitando convite:', token, body)

    // Simulação de sucesso
    return NextResponse.json({
      success: true,
      message: "Convite aceito com sucesso!",
      redirectTo: "/login"
    })

  } catch (error) {
    console.error("Erro ao aceitar convite:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
