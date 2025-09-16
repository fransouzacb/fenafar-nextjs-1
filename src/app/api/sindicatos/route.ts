import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET /api/sindicatos - Listar sindicatos
export async function GET(request: NextRequest) {
  try {
    // O middleware já verificou a autenticação e role
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Dados de usuário não encontrados' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode listar todos os sindicatos
    if (userRole !== UserRole.FENAFAR_ADMIN) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem listar sindicatos.' },
        { status: 403 }
      )
    }

    // Buscar sindicatos com contagem de membros
    console.log('Buscando sindicatos para usuário:', userId)
    const sindicatos = await prisma.sindicato.findMany({
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Sindicatos encontrados:', sindicatos.length)
    return NextResponse.json(sindicatos)

  } catch (error) {
    console.error('Erro ao buscar sindicatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/sindicatos - Criar sindicato
export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    
    // Decodificar token para verificar role
    const jwt = require('jsonwebtoken')
    const payload = jwt.decode(token) as any
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar se o token expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 401 }
      )
    }

    // Buscar usuário no banco para verificar role
    const userId = payload.sub || payload.user_id
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não encontrado no token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Apenas FENAFAR_ADMIN pode criar sindicatos
    if (user.role !== UserRole.FENAFAR_ADMIN) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem criar sindicatos.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, cnpj, address, city, state, zipCode, phone, email, website, description, active } = body

    // Validações básicas
    if (!name || !cnpj || !email) {
      return NextResponse.json(
        { error: 'Nome, CNPJ e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se CNPJ já existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { cnpj }
    })

    if (existingSindicato) {
      return NextResponse.json(
        { error: 'Já existe um sindicato com este CNPJ' },
        { status: 400 }
      )
    }

    // Criar sindicato
    const sindicato = await prisma.sindicato.create({
      data: {
        name,
        cnpj,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        website,
        description,
        active: active !== false // Default true
      },
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      }
    })

    return NextResponse.json(sindicato, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
