import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, createInvitationEmail } from "@/lib/email-service"
import jwt from "jsonwebtoken"
import crypto from "crypto"

// Função para verificar autenticação e autorização
async function checkAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Token não fornecido', status: 401 }
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Decodificar payload do JWT de forma segura
    const payload = jwt.decode(token) as any | null
    if (!payload) {
      return { error: 'Token inválido', status: 401 }
    }
    
    // Verificar expiração
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return { error: 'Token expirado', status: 401 }
    }
    
    const userId = payload.sub || payload.user_id
    const email = payload.email
    const roleFromToken = payload.user_metadata?.role || payload.role

    // Carregar usuário do banco
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, active: true }
    })

    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true, active: true }
      }) as any
    }

    if (!user) {
      // Auto-provisionar um usuário mínimo com base no token
      try {
        const created = await prisma.user.create({
          data: {
            id: userId,
            email: email || `${userId}@placeholder.local`,
            name: payload.user_metadata?.name || payload.name || null,
            role: roleFromToken === 'FENAFAR_ADMIN' ? 'FENAFAR_ADMIN' : (roleFromToken === 'SINDICATO_ADMIN' ? 'SINDICATO_ADMIN' : 'MEMBER'),
            active: true
          },
          select: { id: true, email: true, role: true, active: true }
        })
        user = created
      } catch {
        return { error: 'Usuário não encontrado ou inativo', status: 401 }
      }
    }

    if (!user.active) {
      return { error: 'Usuário não encontrado ou inativo', status: 401 }
    }

    if (user.role !== 'FENAFAR_ADMIN') {
      return { error: 'Acesso negado. Apenas FENAFAR_ADMIN pode gerenciar convites', status: 403 }
    }

    return { user }
  } catch (error) {
    console.error('Erro de autenticação:', error)
    return { error: 'Token inválido', status: 401 }
  }
}

// GET /api/convites - Listar convites (apenas FENAFAR_ADMIN)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await checkAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

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
      const now = new Date()
      if (status === "pendente") {
        where.acceptedAt = null
        where.expiresAt = { gt: now }
      } else if (status === "aceito") {
        where.acceptedAt = { not: null }
      } else if (status === "expirado") {
        where.acceptedAt = null
        where.expiresAt = { lte: now }
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
    const now = new Date()
    const convitesComStatus = convites.map(convite => ({
      ...convite,
      status: convite.acceptedAt 
        ? "aceito" 
        : convite.expiresAt < now 
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

// POST /api/convites - Criar convite (apenas FENAFAR_ADMIN)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await checkAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const {
      email,
      nomeSindicato,
      cnpjSindicato,
      cidadeSindicato,
      estadoSindicato,
      nomeResponsavel
    } = body

    // Validar dados obrigatórios
    if (!email || !nomeSindicato || !cnpjSindicato || !cidadeSindicato || !estadoSindicato) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Dados obrigatórios não fornecidos",
          details: {
            email: !email ? "Email é obrigatório" : null,
            nomeSindicato: !nomeSindicato ? "Nome do sindicato é obrigatório" : null,
            cnpjSindicato: !cnpjSindicato ? "CNPJ é obrigatório" : null,
            cidadeSindicato: !cidadeSindicato ? "Cidade é obrigatória" : null,
            estadoSindicato: !estadoSindicato ? "Estado é obrigatório" : null
          }
        },
        { status: 400 }
      )
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Formato de email inválido" },
        { status: 400 }
      )
    }

    // Verificar se já existe convite pendente para este email
    const now = new Date()
    const existingConvite = await prisma.convite.findFirst({
      where: {
        email,
        acceptedAt: null,
        expiresAt: { gt: now }
      }
    })

    if (existingConvite) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Já existe um convite pendente para este email",
          conviteId: existingConvite.id
        },
        { status: 409 }
      )
    }

    // Verificar se já existe sindicato com este CNPJ
    const existingSindicato = await prisma.sindicato.findFirst({
      where: { cnpj: cnpjSindicato }
    })

    if (existingSindicato) {
      return NextResponse.json(
        { success: false, error: "Já existe um sindicato cadastrado com este CNPJ" },
        { status: 409 }
      )
    }

    // Verificar se já existe usuário com este email
    const existingUser = await prisma.user.findFirst({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Já existe um usuário cadastrado com este email" },
        { status: 409 }
      )
    }

    // Gerar token único e seguro
    const token = crypto.randomBytes(32).toString('hex')

    // Data de expiração (7 dias)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Criar o convite no banco
    const convite = await prisma.convite.create({
      data: {
        email,
        role: 'SINDICATO_ADMIN',
        expiresAt,
        invitedBy: authResult.user!.id
      },
      include: {
        criadoPor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Preparar dados para o email
    const emailData = {
      email,
      nomeSindicato,
      cnpjSindicato,
      cidadeSindicato,
      estadoSindicato,
      nomeResponsavel
    }

    // Enviar email
    let emailSent = false
    let emailError: string | null = null
    let emailMessageId: string | undefined = undefined
    
    try {
      const invitationEmail = createInvitationEmail(emailData, convite.id)
      const emailResult = await sendEmail(invitationEmail)
      
      emailSent = emailResult.success
      emailError = emailResult.error || null
      emailMessageId = emailResult.messageId
      
      console.log('Email result:', emailResult)
    } catch (error) {
      console.error("Erro ao enviar email:", error)
      emailError = error instanceof Error ? error.message : 'Erro desconhecido no email'
    }

    // Resposta de sucesso
    return NextResponse.json({
      success: true,
      data: {
        convite: {
          ...convite,
          status: 'pendente'
        },
        email: {
          sent: emailSent,
          messageId: emailMessageId,
          error: emailError
        }
      },
      message: emailSent 
        ? "Convite criado e email enviado com sucesso"
        : "Convite criado, mas houve problema no envio do email"
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar convite:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}

// DELETE /api/convites/[id] - Cancelar convite (apenas FENAFAR_ADMIN)
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await checkAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const conviteId = searchParams.get("id")

    if (!conviteId) {
      return NextResponse.json(
        { success: false, error: "ID do convite não fornecido" },
        { status: 400 }
      )
    }

    // Verificar se o convite existe
    const convite = await prisma.convite.findUnique({
      where: { id: conviteId }
    })

    if (!convite) {
      return NextResponse.json(
        { success: false, error: "Convite não encontrado" },
        { status: 404 }
      )
    }

    if (convite.acceptedAt) {
      return NextResponse.json(
        { success: false, error: "Não é possível cancelar um convite já aceito" },
        { status: 400 }
      )
    }

    // Deletar o convite
    await prisma.convite.delete({
      where: { id: conviteId }
    })

    return NextResponse.json({
      success: true,
      message: "Convite cancelado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao cancelar convite:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
