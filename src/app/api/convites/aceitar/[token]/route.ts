import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

// GET /api/convites/aceitar/[token] - Verificar convite
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json(
        { error: 'Token do convite é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar convite pelo token
    const convite = await prisma.convite.findUnique({
      where: { token },
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

    if (!token) {
      return NextResponse.json(
        { error: 'Token do convite é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar convite
    const convite = await prisma.convite.findUnique({
      where: { token },
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

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Iniciar transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário (sem campo password que não existe no schema)
      const newUser = await tx.user.create({
        data: {
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
            telefone: sindicatoData.telefone || null,
            endereco: sindicatoData.endereco || null,
            cidade: sindicatoData.cidade || null,
            estado: sindicatoData.estado || null,
            cep: sindicatoData.cep || null,
            maxMembers: convite.maxMembers || 100,
            active: true,
            adminId: newUser.id
          }
        })

        // Atualizar usuário com sindicatoId
        await tx.user.update({
          where: { id: newUser.id },
          data: { sindicatoId: newSindicato.id }
        })
      }

      // Se for MEMBER, associar ao sindicato existente
      if (convite.role === UserRole.MEMBER && convite.sindicatoId) {
        await tx.user.update({
          where: { id: newUser.id },
          data: { sindicatoId: convite.sindicatoId }
        })
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
      message: 'Convite aceito com sucesso!',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
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
