import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { LoginRequest } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validar dados
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Erro na autenticação' },
        { status: 401 }
      )
    }

    // Buscar usuário no banco Prisma
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailConfirmed: true,
        active: true,
        cpf: true,
        cargo: true,
        sindicatoId: true,
        createdAt: true,
        updatedAt: true,
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        }
      }
    })

    // Se usuário não existe no Prisma, criar
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || email.split('@')[0],
          role: data.user.user_metadata?.role || 'MEMBER',
          active: true,
          emailConfirmed: !!data.user.email_confirmed_at,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          emailConfirmed: true,
          active: true,
          cpf: true,
          cargo: true,
          sindicatoId: true,
          createdAt: true,
          updatedAt: true,
          sindicato: {
            select: {
              id: true,
              name: true,
              cnpj: true
            }
          }
        }
      })
    }

    return NextResponse.json({
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
