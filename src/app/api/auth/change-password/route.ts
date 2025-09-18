import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    const supabase = createClient()

    // Verificar senha atual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: validatedData.currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 400 }
      )
    }

    // Atualizar senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.newPassword,
    })

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar senha' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    
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
