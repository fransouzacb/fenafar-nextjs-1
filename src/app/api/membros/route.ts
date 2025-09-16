import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

// GET /api/membros - Listar membros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const ativo = searchParams.get("ativo")
    const cargo = searchParams.get("cargo")
    const sindicatoId = searchParams.get("sindicatoId")
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { cpf: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (ativo !== null) {
      where.active = ativo === "true"
    }
    
    if (cargo) {
      where.cargo = { contains: cargo, mode: "insensitive" }
    }
    
    if (sindicatoId) {
      where.sindicatoId = sindicatoId
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Buscar membros
    const [membros, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...where,
          role: "MEMBER"
        },
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          emailConfirmed: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          cpf: true,
          cargo: true,
          sindicato: {
            select: {
              id: true,
              name: true,
              cnpj: true
            }
          }
        }
      }),
      prisma.user.count({ 
        where: {
          ...where,
          role: "MEMBER"
        }
      })
    ])

    return NextResponse.json({
      success: true,
      membros,
      data: {
        membros,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error("Erro ao listar membros:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/membros - Criar membro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome,
      cpf,
      email,
      telefone,
      cargo,
      sindicatoId,
      password
    } = body

    // Validar dados obrigatórios
    if (!nome || !cpf || !email || !sindicatoId || !password) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      )
    }

    // Verificar se CPF já existe
    const existingMembro = await prisma.user.findFirst({
      where: { 
        cpf: cpf,
        role: "MEMBER"
      }
    })

    if (existingMembro) {
      return NextResponse.json(
        { success: false, error: "CPF já cadastrado" },
        { status: 409 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email já cadastrado" },
        { status: 409 }
      )
    }

    // Verificar se sindicato existe
    const sindicato = await prisma.sindicato.findUnique({
      where: { id: sindicatoId }
    })

    if (!sindicato) {
      return NextResponse.json(
        { success: false, error: "Sindicato não encontrado" },
        { status: 404 }
      )
    }

    // Criar usuário no Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: nome,
          role: "MEMBER"
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar usuário: " + authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar usuário" },
        { status: 400 }
      )
    }

    // Criar usuário no banco local
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        name: nome,
        role: "MEMBER",
        cpf,
        phone: telefone,
        cargo,
        sindicatoId
      },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      membro: user,
      message: "Membro criado com sucesso"
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar membro:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
