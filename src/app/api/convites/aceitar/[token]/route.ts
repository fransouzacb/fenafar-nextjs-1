import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

interface RouteParams {
  params: Promise<{ token: string }>
}

// GET /api/convites/aceitar/[token] - Verificar convite
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json(
        { error: 'ID do convite é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar convite pelo ID
    const convite = await prisma.convite.findUnique({
      where: { id: token },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        },
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
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ convite })

  } catch (error) {
    console.error('Erro ao verificar convite:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/convites/aceitar/[token] - Aceitar convite
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params
    const data = await request.json()
    const { user: userData, sindicato: sindicatoData } = data
    
    console.log('📋 Dados recebidos para aceitar convite:', { userData, sindicatoData })

    if (!token) {
      return NextResponse.json(
        { error: 'Token do convite é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar convite
    const convite = await prisma.convite.findUnique({
      where: { id: token },
      include: {
        sindicato: true
      }
    })

    if (!convite) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se convite expirou
    if (new Date(convite.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Convite expirado' },
        { status: 400 }
      )
    }

    // Verificar se convite já foi usado
    if (convite.usado) {
      return NextResponse.json(
        { error: 'Convite já foi utilizado' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Já existe um usuário com este email' },
        { status: 400 }
      )
    }

    // Hash da senha (não usado no schema atual, mas mantido para futuras implementações)
    // const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Verificar se Supabase Admin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Serviço de autenticação não configurado' },
        { status: 500 }
      )
    }

    // Criar usuário no Supabase Auth primeiro
    console.log('🔐 Criando usuário no Supabase Auth...')
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: userData.name,
        role: convite.role,
        cpf: userData.cpf,
        cargo: userData.cargo
      }
    })

    if (authError || !authUser.user) {
      console.error('❌ Erro ao criar usuário no Supabase Auth:', authError)
      return NextResponse.json(
        { error: 'Erro ao criar conta de usuário: ' + (authError?.message || 'Erro desconhecido') },
        { status: 500 }
      )
    }

    console.log('✅ Usuário criado no Supabase Auth:', authUser.user.id)

    // Iniciar transação para criar no banco local
    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário no banco local com ID do Supabase
      const newUser = await tx.user.create({
        data: {
          id: authUser.user.id, // Usar ID do Supabase Auth
          name: userData.name,
          email: userData.email,
          role: convite.role,
          cpf: userData.cpf || null,
          cargo: userData.cargo || null,
          active: true
        }
      })

      let newSindicato = null

      // Se for SINDICATO_ADMIN, criar sindicato
      if (convite.role === UserRole.SINDICATO_ADMIN && sindicatoData) {
        // Verificar se CNPJ já existe
        const existingSindicato = await tx.sindicato.findUnique({
          where: { cnpj: sindicatoData.cnpj }
        })

        if (existingSindicato) {
          throw new Error('Já existe um sindicato com este CNPJ')
        }

        newSindicato = await tx.sindicato.create({
          data: {
            name: sindicatoData.name,
            cnpj: sindicatoData.cnpj,
            email: sindicatoData.email,
            phone: sindicatoData.telefone || null,
            address: sindicatoData.endereco || null,
            city: sindicatoData.cidade || null,
            state: sindicatoData.estado || null,
            zipCode: sindicatoData.cep || null,
            maxMembers: convite.maxMembers || 100,
            active: true,
            adminId: newUser.id
          }
        })

        // Relacionamento já estabelecido via adminId no sindicato
        // Não é necessário atualizar o usuário
      }

      // Para MEMBERs, o relacionamento com sindicato será implementado futuramente
      // O schema atual não suporta associação direta entre MEMBERs e Sindicatos
      if (convite.role === UserRole.MEMBER && convite.sindicatoId) {
        console.log(`📝 MEMBER ${newUser.email} convidado para sindicato ${convite.sindicatoId}`)
        // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      }

      // Marcar convite como usado
      await tx.convite.update({
        where: { id: convite.id },
        data: { usado: true }
      })

      return { user: newUser, sindicato: newSindicato }
    })

    return NextResponse.json({
      success: true,
      message: 'Convite aceito com sucesso! Usuário criado e pode fazer login.',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      authUser: {
        id: authUser.user.id,
        email: authUser.user.email,
        emailConfirmed: authUser.user.email_confirmed_at ? true : false
      },
      sindicato: result.sindicato ? {
        id: result.sindicato.id,
        name: result.sindicato.name,
        cnpj: result.sindicato.cnpj
      } : null
    })

  } catch (error: any) {
    console.error('Erro ao aceitar convite:', error)
    
    if (error.message === 'Já existe um sindicato com este CNPJ') {
      return NextResponse.json(
        { error: 'Já existe um sindicato com este CNPJ' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
