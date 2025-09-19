import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getAuthUser, hasRole } from '@/lib/auth'
import { sendConviteEmail } from '@/lib/email'

// GET /api/convites/[id] - Buscar convite específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const convite = await prisma.convite.findUnique({
      where: { id: params.id },
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
            id: true,
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

    return NextResponse.json(convite)
  } catch (error) {
    console.error('Erro ao buscar convite:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/convites/[id] - Atualizar convite
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const updatedConvite = await prisma.convite.update({
      where: { id: params.id },
      data,
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
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedConvite)
  } catch (error: any) {
    console.error('Erro ao atualizar convite:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/convites/[id] - Excluir convite
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    await prisma.convite.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Convite excluído com sucesso' })
  } catch (error: any) {
    console.error('Erro ao excluir convite:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/convites/[id]/resend - Reenviar convite
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar o convite existente
    const convite = await prisma.convite.findUnique({
      where: { id: params.id },
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
            id: true,
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

    if (convite.usado) {
      return NextResponse.json(
        { error: 'Convite já foi utilizado' },
        { status: 400 }
      )
    }

    if (new Date() > convite.expiresAt) {
      return NextResponse.json(
        { error: 'Convite expirado' },
        { status: 400 }
      )
    }

    // Reenviar e-mail do convite
    try {
      const linkConvite = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/convites/aceitar/${convite.token}`
      const expiraEm = new Date(convite.expiresAt).toLocaleDateString('pt-BR')
      
      console.log('📧 Reenviando e-mail do convite:', {
        to: convite.email,
        tipo: convite.role,
        link: linkConvite,
        sindicato: convite.sindicato?.name
      })
      
      const emailResult = await sendConviteEmail({
        to: convite.email,
        nomeSindicato: convite.sindicato?.name,
        cnpjSindicato: convite.sindicato?.cnpj,
        linkConvite,
        expiraEm,
        criadoPor: convite.criadoPor?.name || convite.criadoPor?.email || 'Administrador',
        maxMembers: convite.maxMembers,
        tipoConvite: convite.role
      })

      console.log('📧 Resultado do reenvio:', emailResult)

      if (!emailResult.success) {
        console.error('❌ Erro ao reenviar e-mail do convite:', emailResult.error)
        return NextResponse.json(
          { error: 'Erro ao enviar e-mail: ' + emailResult.error },
          { status: 500 }
        )
      }

      console.log('✅ E-mail reenviado com sucesso!')
      
      return NextResponse.json({ 
        message: 'Convite reenviado com sucesso!',
        messageId: emailResult.messageId
      })

    } catch (emailError) {
      console.error('❌ Erro ao reenviar e-mail do convite:', emailError)
      return NextResponse.json(
        { error: 'Erro interno ao reenviar e-mail' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Erro ao reenviar convite:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
