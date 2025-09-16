import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabaseAdmin } from "@/lib/supabase"
import { sendEmail, createWelcomeEmail } from "@/lib/email-service"
import bcrypt from "bcryptjs"

// GET /api/convites/accept/[token] - Validar token e obter dados do convite
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Buscar convite no banco pelo ID (usando ID como token por simplicidade)
    const convite = await prisma.convite.findUnique({
      where: { id: token },
      include: {
        criadoPor: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!convite) {
      return NextResponse.json(
        { success: false, error: "Convite não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o convite já foi aceito
    if (convite.acceptedAt) {
      return NextResponse.json(
        { success: false, error: "Convite já foi aceito" },
        { status: 400 }
      )
    }

    // Verificar se o convite expirou
    const now = new Date()
    if (convite.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: "Convite expirado" },
        { status: 400 }
      )
    }

    // Verificar se já existe usuário com este email
    const existingUser = await prisma.user.findFirst({
      where: { email: convite.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Já existe um usuário cadastrado com este email" },
        { status: 409 }
      )
    }

    return NextResponse.json({
      success: true,
      convite: {
        id: convite.id,
        email: convite.email,
        role: convite.role,
        criadoEm: convite.createdAt,
        expiraEm: convite.expiresAt,
        criadoPor: convite.criadoPor
      }
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
    
    const {
      nomeResponsavel,
      password,
      nomeSindicato,
      cnpjSindicato,
      cidadeSindicato,
      estadoSindicato,
      telefone,
      endereco,
      cep,
      website,
      descricao
    } = body

    // Validar dados obrigatórios
    if (!nomeResponsavel || !password || !nomeSindicato || !cnpjSindicato || !cidadeSindicato || !estadoSindicato) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Dados obrigatórios não fornecidos",
          details: {
            nomeResponsavel: !nomeResponsavel ? "Nome é obrigatório" : null,
            password: !password ? "Senha é obrigatória" : null,
            nomeSindicato: !nomeSindicato ? "Nome do sindicato é obrigatório" : null,
            cnpjSindicato: !cnpjSindicato ? "CNPJ é obrigatório" : null,
            cidadeSindicato: !cidadeSindicato ? "Cidade é obrigatória" : null,
            estadoSindicato: !estadoSindicato ? "Estado é obrigatório" : null
          }
        },
        { status: 400 }
      )
    }

    // Buscar convite no banco
    const convite = await prisma.convite.findUnique({
      where: { id: token },
      include: {
        criadoPor: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!convite) {
      return NextResponse.json(
        { success: false, error: "Convite não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o convite já foi aceito
    if (convite.acceptedAt) {
      return NextResponse.json(
        { success: false, error: "Convite já foi aceito" },
        { status: 400 }
      )
    }

    // Verificar se o convite expirou
    const now = new Date()
    if (convite.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: "Convite expirado" },
        { status: 400 }
      )
    }

    // Verificar se já existe usuário com este email
    const existingUser = await prisma.user.findFirst({
      where: { email: convite.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Já existe um usuário cadastrado com este email" },
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

    // Iniciar transação no banco
    const result = await prisma.$transaction(async (tx) => {
      try {
        // 1. Criar sindicato
        const sindicato = await tx.sindicato.create({
          data: {
            name: nomeSindicato,
            cnpj: cnpjSindicato,
            city: cidadeSindicato,
            state: estadoSindicato,
            email: convite.email,
            phone: telefone,
            address: endereco,
            zipCode: cep,
            website: website,
            description: descricao,
            active: true
          }
        })

        // 2. Criar usuário admin do sindicato no Prisma
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await tx.user.create({
          data: {
            email: convite.email,
            name: nomeResponsavel,
            role: 'SINDICATO_ADMIN',
            emailConfirmed: true,
            active: true,
            sindicatoId: sindicato.id,
            phone: telefone
          }
        })

        // 3. Criar usuário no Supabase Auth
        try {
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: convite.email,
            password: password,
            email_confirm: true,
            user_metadata: {
              name: nomeResponsavel,
              role: 'SINDICATO_ADMIN',
              sindicatoId: sindicato.id
            }
          })

          if (authError) {
            console.error('Erro ao criar usuário no Supabase:', authError)
            // Continuar mesmo se der erro no Supabase, pois o usuário já foi criado no Prisma
          }
        } catch (supabaseError) {
          console.error('Erro na integração Supabase:', supabaseError)
        }

        // 4. Marcar convite como aceito
        await tx.convite.update({
          where: { id: token },
          data: {
            acceptedAt: new Date(),
            sindicatoId: sindicato.id
          }
        })

        return { user, sindicato }
      } catch (transactionError) {
        console.error('Erro na transação:', transactionError)
        throw transactionError
      }
    })

    // Enviar email de boas-vindas
    try {
      const welcomeEmail = createWelcomeEmail({
        email: convite.email,
        nomeResponsavel,
        nomeSindicato
      })
      await sendEmail(welcomeEmail)
      console.log('Email de boas-vindas enviado para:', convite.email)
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError)
      // Não falhar a operação por causa do email
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        },
        sindicato: {
          id: result.sindicato.id,
          name: result.sindicato.name,
          cnpj: result.sindicato.cnpj
        }
      },
      message: "Convite aceito e cadastro realizado com sucesso!",
      redirectTo: "/auth/login"
    })

  } catch (error) {
    console.error("Erro ao aceitar convite:", error)
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
