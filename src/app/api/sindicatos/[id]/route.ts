import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET /api/sindicatos/[id] - Buscar sindicato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      select: { role: true, sindicato: {
          select: { id: true }
        } }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar sindicato
    const sindicato = await prisma.sindicato.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      }
    })

    if (!sindicato) {
      return NextResponse.json(
        { error: 'Sindicato não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissões
    if (user.role === UserRole.FENAFAR_ADMIN) {
      // FENAFAR_ADMIN pode ver qualquer sindicato
      return NextResponse.json(sindicato)
    } else if (user.role === UserRole.SINDICATO_ADMIN && user.sindicato?.id === params.id) {
      // SINDICATO_ADMIN pode ver apenas seu próprio sindicato
      return NextResponse.json(sindicato)
    } else {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

  } catch (error) {
    console.error('Erro ao buscar sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/sindicatos/[id] - Atualizar sindicato
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      select: { role: true, sindicato: {
          select: { id: true }
        } }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se sindicato existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { id: params.id }
    })

    if (!existingSindicato) {
      return NextResponse.json(
        { error: 'Sindicato não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissões
    if (user.role !== UserRole.FENAFAR_ADMIN && 
        (user.role !== UserRole.SINDICATO_ADMIN || user.sindicato?.id !== params.id)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
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

    // Verificar se CNPJ já existe em outro sindicato
    if (cnpj !== existingSindicato.cnpj) {
      const cnpjExists = await prisma.sindicato.findUnique({
        where: { cnpj }
      })

      if (cnpjExists) {
        return NextResponse.json(
          { error: 'Já existe um sindicato com este CNPJ' },
          { status: 400 }
        )
      }
    }

    // Atualizar sindicato
    const sindicato = await prisma.sindicato.update({
      where: { id: params.id },
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
        active: active !== false
      },
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      }
    })

    return NextResponse.json(sindicato)

  } catch (error) {
    console.error('Erro ao atualizar sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/sindicatos/[id] - Excluir sindicato
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Apenas FENAFAR_ADMIN pode excluir sindicatos
    if (user.role !== UserRole.FENAFAR_ADMIN) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem excluir sindicatos.' },
        { status: 403 }
      )
    }

    // Verificar se sindicato existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            membros: true
          }
        }
      }
    })

    if (!existingSindicato) {
      return NextResponse.json(
        { error: 'Sindicato não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há membros associados
    if (existingSindicato._count.membros > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir sindicato com membros associados' },
        { status: 400 }
      )
    }

    // Excluir sindicato
    await prisma.sindicato.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Sindicato excluído com sucesso' })

  } catch (error) {
    console.error('Erro ao excluir sindicato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
