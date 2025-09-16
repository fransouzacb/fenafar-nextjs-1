// Email service using Brevo (formerly Sendinblue)
export interface EmailData {
  to: string
  subject: string
  htmlContent: string
  textContent?: string
  templateId?: number
  params?: Record<string, any>
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const apiKey = process.env.BREVO_API_KEY
    
    if (!apiKey) {
      console.error('BREVO_API_KEY not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const payload = data.templateId ? {
      // Usando template do Brevo
      templateId: data.templateId,
      to: [{ email: data.to }],
      params: data.params || {}
    } : {
      // Enviando HTML customizado
      sender: {
        name: 'FENAFAR - Sistema de Gestão',
        email: 'noreply@fenafar.org.br',
      },
      to: [{ email: data.to }],
      subject: data.subject,
      htmlContent: data.htmlContent,
      textContent: data.textContent || data.htmlContent.replace(/<[^>]*>/g, ''),
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Email sending failed:', result)
      return { 
        success: false, 
        error: result.message || `HTTP ${response.status}` 
      }
    }

    console.log('Email sent successfully:', result)
    return { 
      success: true, 
      messageId: result.messageId 
    }

  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Template para emails de convite
export function createInvitationEmail(
  data: {
    email: string
    nomeSindicato: string
    cnpjSindicato: string
    cidadeSindicato: string
    estadoSindicato: string
    nomeResponsavel?: string
  },
  token: string
): EmailData {
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/convites/aceitar?token=${token}`
  const { nomeSindicato, cnpjSindicato, cidadeSindicato, estadoSindicato, nomeResponsavel } = data
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Convite FENAFAR</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
            .header p { color: #bfdbfe; margin: 8px 0 0 0; font-size: 16px; }
            .content { padding: 32px; }
            .greeting { font-size: 18px; color: #1f2937; margin-bottom: 24px; }
            .info-box { background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0; }
            .info-title { font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 16px; }
            .info-list { margin: 0; padding-left: 0; list-style: none; }
            .info-item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
            .info-item:last-child { border-bottom: none; }
            .info-label { font-weight: 600; color: #6b7280; }
            .info-value { color: #1f2937; text-align: right; }
            .cta-section { text-align: center; margin: 32px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
            .cta-button:hover { transform: translateY(-2px); }
            .warning { background: #fef3c7; border: 1px solid #fcd34d; color: #92400e; padding: 16px; border-radius: 6px; margin: 24px 0; }
            .footer { background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 8px 0; color: #6b7280; font-size: 14px; }
            .link { color: #3b82f6; word-break: break-all; }
            @media (max-width: 600px) {
                .container { margin: 20px; }
                .header, .content { padding: 24px; }
                .cta-button { padding: 14px 28px; font-size: 15px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Bem-vindo à FENAFAR</h1>
                <p>Federação Nacional dos Farmacêuticos</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    ${nomeResponsavel ? `Olá, ${nomeResponsavel}!` : 'Olá!'}
                </div>
                
                <p>Você foi convidado para integrar seu sindicato à plataforma digital da <strong>FENAFAR</strong>!</p>
                
                <p>Nossa plataforma oferece ferramentas modernas para gestão de sindicatos, incluindo:</p>
                <ul>
                    <li>📊 Dashboard com estatísticas em tempo real</li>
                    <li>👥 Gestão completa de membros</li>
                    <li>📄 Sistema de documentos digitais</li>
                    <li>📧 Comunicação integrada</li>
                    <li>🔐 Acesso seguro e controle de permissões</li>
                </ul>
                
                <div class="info-box">
                    <div class="info-title">📋 Dados do seu sindicato:</div>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="info-label">Nome:</span>
                            <span class="info-value">${nomeSindicato}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">CNPJ:</span>
                            <span class="info-value">${cnpjSindicato}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Localização:</span>
                            <span class="info-value">${cidadeSindicato}, ${estadoSindicato}</span>
                        </div>
                    </div>
                </div>
                
                <div class="cta-section">
                    <a href="${acceptUrl}" class="cta-button">
                        ✨ Aceitar Convite e Começar
                    </a>
                </div>
                
                <div class="warning">
                    <strong>⏰ Atenção:</strong> Este convite expira em <strong>7 dias</strong>. 
                    Não perca a oportunidade de modernizar a gestão do seu sindicato!
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Se você não conseguir clicar no botão acima, copie e cole o link abaixo no seu navegador:<br>
                    <span class="link">${acceptUrl}</span>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>FENAFAR - Federação Nacional dos Farmacêuticos</strong></p>
                <p>Este é um email automático, não responda esta mensagem.</p>
                <p>© 2024 FENAFAR. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
  `

  return {
    to: data.email,
    subject: `🎉 Bem-vindo à FENAFAR - Convite para ${nomeSindicato}`,
    htmlContent,
    textContent: `
CONVITE FENAFAR - ${nomeSindicato}

${nomeResponsavel ? `Olá, ${nomeResponsavel}!` : 'Olá!'}

Você foi convidado para integrar seu sindicato à plataforma digital da FENAFAR!

Dados do sindicato:
- Nome: ${nomeSindicato}
- CNPJ: ${cnpjSindicato}
- Localização: ${cidadeSindicato}, ${estadoSindicato}

Para aceitar o convite, acesse: ${acceptUrl}

Este convite expira em 7 dias.

Atenciosamente,
Equipe FENAFAR
    `
  }
}

// Template para email de confirmação de cadastro
export function createWelcomeEmail(
  data: {
    email: string
    nomeResponsavel: string
    nomeSindicato: string
  }
): EmailData {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`
  
  return {
    to: data.email,
    subject: `✅ Cadastro realizado com sucesso - ${data.nomeSindicato}`,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Bem-vindo à FENAFAR</title>
          <style>
              body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px; text-align: center; color: white; }
              .content { padding: 32px; }
              .success-icon { font-size: 64px; text-align: center; margin-bottom: 24px; }
              .cta-button { display: inline-block; background: #059669; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
              .footer { background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>✅ Cadastro Realizado!</h1>
                  <p>Seu sindicato foi cadastrado com sucesso</p>
              </div>
              <div class="content">
                  <div class="success-icon">🎉</div>
                  <p>Olá, ${data.nomeResponsavel}!</p>
                  <p>Parabéns! O cadastro do <strong>${data.nomeSindicato}</strong> foi realizado com sucesso na plataforma FENAFAR.</p>
                  <p>Você já pode acessar o sistema e começar a gerenciar seu sindicato:</p>
                  <div style="text-align: center; margin: 32px 0;">
                      <a href="${loginUrl}" class="cta-button">🚀 Acessar Plataforma</a>
                  </div>
              </div>
              <div class="footer">
                  <p><strong>FENAFAR - Federação Nacional dos Farmacêuticos</strong></p>
              </div>
          </div>
      </body>
      </html>
    `
  }
}
