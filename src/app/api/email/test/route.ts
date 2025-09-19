import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { sendEmail, validateBrevoConfig, EmailData } from '@/lib/email'

// POST /api/email/test - Testar envio de e-mail
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Apenas FENAFAR_ADMIN pode testar e-mails
    if (!hasRole(user, [UserRole.FENAFAR_ADMIN])) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores FENAFAR podem testar e-mails.' },
        { status: 403 }
      )
    }

    // Validar configuração do Brevo
    const configValidation = validateBrevoConfig()
    if (!configValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Configuração do Brevo inválida',
          details: configValidation.errors
        },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { email, templateType } = data

    // Validar dados
    if (!email || !templateType) {
      return NextResponse.json(
        { error: 'Email e tipo de template são obrigatórios' },
        { status: 400 }
      )
    }

    // Dados de teste
    const testEmailData: EmailData = {
      to: email,
      templateId: templateType,
      variables: {
        nomeSindicato: 'Sindicato de Teste',
        cnpjSindicato: '12.345.678/0001-90',
        linkConvite: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/convites/aceitar/token-teste`,
        expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        criadoPor: user.name || 'Administrador',
        maxMembers: 100
      }
    }

    // Enviar e-mail de teste
    const result = await sendEmail(testEmailData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'E-mail de teste enviado com sucesso!',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Erro ao enviar e-mail de teste',
          details: result.error
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro ao testar e-mail:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
