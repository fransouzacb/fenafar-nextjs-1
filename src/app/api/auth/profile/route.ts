import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  phone: z.string().optional(),
  cargo: z.string().optional(),
  cpf: z.string().optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Atualizar usuário no banco
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        emailConfirmed: updatedUser.emailConfirmed,
        active: updatedUser.active,
        cpf: updatedUser.cpf,
        cargo: updatedUser.cargo,
        sindicatoId: updatedUser.sindicatoId,
        sindicato: updatedUser.sindicato,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
