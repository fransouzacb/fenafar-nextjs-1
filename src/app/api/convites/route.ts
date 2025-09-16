import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"

// GET /api/convites - Listar convites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const estado = searchParams.get("estado")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { nomeSindicato: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (status) {
      if (status === "pendente") {
        where.usado = false
        where.expiresAt = { gt: new Date() }
      } else if (status === "aceito") {
        where.usado = true
      } else if (status === "expirado") {
        where.usado = false
        where.expiresAt = { lte: new Date() }
      }
    }
    
    if (estado) {
      where.estadoSindicato = estado
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Buscar convites
    const [convites, total] = await Promise.all([
      prisma.convite.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          criadoPor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.convite.count({ where })
    ])

    // Adicionar status calculado
    const convitesComStatus = convites.map(convite => ({
      ...convite,
      status: convite.acceptedAt 
        ? "aceito" 
        : convite.expiresAt < new Date() 
          ? "expirado" 
          : "pendente"
    }))

    return NextResponse.json({
      success: true,
      data: {
        convites: convitesComStatus,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error("Erro ao listar convites:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/convites - Criar convite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      nomeSindicato,
      cnpjSindicato,
      cidadeSindicato,
      estadoSindicato
    } = body

    // Validar dados obrigatórios
    if (!email || !nomeSindicato || !cnpjSindicato || !cidadeSindicato || !estadoSindicato) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      )
    }

    // Verificar se já existe convite pendente para este email
    const existingConvite = await prisma.convite.findFirst({
      where: {
        email,
        acceptedAt: null,
        expiresAt: { gt: new Date() }
      }
    })

    if (existingConvite) {
      return NextResponse.json(
        { success: false, error: "Já existe um convite pendente para este email" },
        { status: 409 }
      )
    }

    // Gerar token único
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)

    // Data de expiração (7 dias)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Criar o convite (simulação)
    const convite = {
      id: 'mock-convite-id',
      email,
      role: 'SINDICATO_ADMIN' as const,
      invitedBy: 'mock-admin-id',
      expiresAt
    }    // Enviar email
    let emailSent = false
    try {
      // Simulação de envio de email
      console.log('Enviaria email para:', email)
      console.log('Dados do convite:', { email, role: 'SINDICATO_ADMIN' })
      emailSent = true
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError)
    }

    return NextResponse.json({
      success: true,
      convite,
      emailSent,
      message: "Convite criado com sucesso"
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar convite:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
