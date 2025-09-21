import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET /api/documentos - Listar documentos
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Verificar se o usuário tem permissão para listar documentos
    if (user.role !== UserRole.SINDICATO_ADMIN && user.role !== UserRole.MEMBER) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tipo = searchParams.get('tipo')
    const ativo = searchParams.get('ativo')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}

    // Filtrar por sindicato do usuário
    if (user.role === UserRole.SINDICATO_ADMIN) {
      // Para SINDICATO_ADMIN, buscar documentos do sindicato que ele administra
      const sindicato = await prisma.sindicato.findUnique({
        where: { adminId: user.id },
        select: { id: true }
      })
      
      if (sindicato) {
        where.sindicatoId = sindicato.id
      } else {
        return NextResponse.json({ documentos: [], total: 0, pages: 0 }, { status: 200 })
      }
    } else if (user.role === UserRole.MEMBER) {
      // Para MEMBER, buscar apenas seus próprios documentos
      // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      where.userId = user.id
    }

    // Filtros adicionais
    if (tipo) {
      where.tipo = tipo
    }

    if (ativo !== null && ativo !== undefined) {
      where.ativo = ativo === 'true'
    }

    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar documentos
    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        include: {
          sindicato: {
            select: {
              id: true,
              name: true,
              cnpj: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.documento.count({ where })
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      documentos,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao listar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
