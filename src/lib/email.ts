import * as brevo from '@getbrevo/brevo'

// Configurar cliente Brevo
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '')

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
  type: 'convite_sindicato' | 'convite_membro' | 'notificacao' | 'custom'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailData {
  to: string
  templateId: string
  variables: Record<string, any>
  fromName?: string
  fromEmail?: string
}

export interface ConviteEmailData {
  to: string
  nomeSindicato?: string
  cnpjSindicato?: string
  linkConvite: string
  expiraEm: string
  criadoPor: string
  maxMembers?: number
  tipoConvite: 'SINDICATO_ADMIN' | 'MEMBER'
}

// Templates padrão
export const DEFAULT_TEMPLATES: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Convite para Admin de Sindicato',
    subject: 'Convite para Administrar Sindicato - FENAFAR',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite FENAFAR</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .highlight { background: #e0f2fe; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FENAFAR</h1>
            <p>Federação Nacional dos Farmacêuticos</p>
          </div>
          <div class="content">
            <h2>Convite para Administração de Sindicato</h2>
            <p>Olá!</p>
            <p>Você foi convidado por <strong>{{criadoPor}}</strong> para administrar um sindicato na plataforma FENAFAR.</p>
            
            <div class="highlight">
              <h3>Detalhes do Sindicato:</h3>
              <p><strong>Nome:</strong> {{nomeSindicato}}</p>
              <p><strong>CNPJ:</strong> {{cnpjSindicato}}</p>
              {{#if maxMembers}}
              <p><strong>Limite de Membros:</strong> {{maxMembers}}</p>
              {{/if}}
            </div>
            
            <p>Para aceitar este convite e começar a administrar o sindicato, clique no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="{{linkConvite}}" class="button">Aceitar Convite</a>
            </div>
            
            <p><strong>Importante:</strong> Este convite expira em <strong>{{expiraEm}}</strong>. Após esta data, será necessário solicitar um novo convite.</p>
            
            <p>Se você não esperava este convite, pode ignorar este e-mail.</p>
            
            <p>Atenciosamente,<br>Equipe FENAFAR</p>
          </div>
          <div class="footer">
            <p>Este é um e-mail automático, não responda a esta mensagem.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      FENAFAR - Federação Nacional dos Farmacêuticos
      
      Convite para Administração de Sindicato
      
      Olá!
      
      Você foi convidado por {{criadoPor}} para administrar um sindicato na plataforma FENAFAR.
      
      Detalhes do Sindicato:
      - Nome: {{nomeSindicato}}
      - CNPJ: {{cnpjSindicato}}
      {{#if maxMembers}}
      - Limite de Membros: {{maxMembers}}
      {{/if}}
      
      Para aceitar este convite: {{linkConvite}}
      
      IMPORTANTE: Este convite expira em {{expiraEm}}. Após esta data, será necessário solicitar um novo convite.
      
      Se você não esperava este convite, pode ignorar este e-mail.
      
      Atenciosamente,
      Equipe FENAFAR
    `,
    variables: ['nomeSindicato', 'cnpjSindicato', 'linkConvite', 'expiraEm', 'criadoPor', 'maxMembers'],
    type: 'convite_sindicato',
    isActive: true
  },
  {
    name: 'Convite para Membro',
    subject: 'Convite para Participar do Sindicato - FENAFAR',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite FENAFAR</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .highlight { background: #dcfce7; padding: 15px; border-left: 4px solid #059669; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FENAFAR</h1>
            <p>Federação Nacional dos Farmacêuticos</p>
          </div>
          <div class="content">
            <h2>Convite para Participar do Sindicato</h2>
            <p>Olá!</p>
            <p>Você foi convidado por <strong>{{criadoPor}}</strong> para participar como membro do sindicato na plataforma FENAFAR.</p>
            
            <div class="highlight">
              <h3>Detalhes do Sindicato:</h3>
              <p><strong>Nome:</strong> {{nomeSindicato}}</p>
              <p><strong>CNPJ:</strong> {{cnpjSindicato}}</p>
            </div>
            
            <p>Para aceitar este convite e se tornar um membro do sindicato, clique no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="{{linkConvite}}" class="button">Aceitar Convite</a>
            </div>
            
            <p><strong>Importante:</strong> Este convite expira em <strong>{{expiraEm}}</strong>. Após esta data, será necessário solicitar um novo convite.</p>
            
            <p>Se você não esperava este convite, pode ignorar este e-mail.</p>
            
            <p>Atenciosamente,<br>Equipe FENAFAR</p>
          </div>
          <div class="footer">
            <p>Este é um e-mail automático, não responda a esta mensagem.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      FENAFAR - Federação Nacional dos Farmacêuticos
      
      Convite para Participar do Sindicato
      
      Olá!
      
      Você foi convidado por {{criadoPor}} para participar como membro do sindicato na plataforma FENAFAR.
      
      Detalhes do Sindicato:
      - Nome: {{nomeSindicato}}
      - CNPJ: {{cnpjSindicato}}
      
      Para aceitar este convite: {{linkConvite}}
      
      IMPORTANTE: Este convite expira em {{expiraEm}}. Após esta data, será necessário solicitar um novo convite.
      
      Se você não esperava este convite, pode ignorar este e-mail.
      
      Atenciosamente,
      Equipe FENAFAR
    `,
    variables: ['nomeSindicato', 'cnpjSindicato', 'linkConvite', 'expiraEm', 'criadoPor'],
    type: 'convite_membro',
    isActive: true
  }
]

// Função para substituir variáveis no template
function replaceVariables(content: string, variables: Record<string, any>): string {
  let result = content
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value || '')
  })
  
  // Remover blocos condicionais não utilizados
  result = result.replace(/{{#if\s+\w+}}[\s\S]*?{{\/if}}/g, '')
  
  return result
}

// Enviar e-mail usando Brevo
export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY não configurada')
    }

    // Buscar template (por enquanto usar templates padrão)
    const template = DEFAULT_TEMPLATES.find(t => t.type === emailData.templateId)
    if (!template) {
      throw new Error(`Template ${emailData.templateId} não encontrado`)
    }

    // Substituir variáveis
    const subject = replaceVariables(template.subject, emailData.variables)
    const htmlContent = replaceVariables(template.htmlContent, emailData.variables)
    const textContent = template.textContent ? replaceVariables(template.textContent, emailData.variables) : undefined

    // Configurar e-mail
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.to = [{ email: emailData.to }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent
    if (textContent) {
      sendSmtpEmail.textContent = textContent
    }
    
    // Configurar remetente
    sendSmtpEmail.sender = {
      email: emailData.fromEmail || process.env.BREVO_FROM_EMAIL || 'noreply@fenafar.org.br',
      name: emailData.fromName || process.env.BREVO_FROM_NAME || 'FENAFAR'
    }

    // Enviar e-mail
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    return {
      success: true,
      messageId: result.messageId
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Enviar convite específico
export async function sendConviteEmail(conviteData: ConviteEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const templateType = conviteData.tipoConvite === 'SINDICATO_ADMIN' ? 'convite_sindicato' : 'convite_membro'
  
  return sendEmail({
    to: conviteData.to,
    templateId: templateType,
    variables: {
      nomeSindicato: conviteData.nomeSindicato || 'Sindicato',
      cnpjSindicato: conviteData.cnpjSindicato || '',
      linkConvite: conviteData.linkConvite,
      expiraEm: conviteData.expiraEm,
      criadoPor: conviteData.criadoPor,
      maxMembers: conviteData.maxMembers
    }
  })
}

// Validar configuração do Brevo
export function validateBrevoConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!process.env.BREVO_API_KEY) {
    errors.push('BREVO_API_KEY não configurada')
  }
  
  if (!process.env.BREVO_FROM_EMAIL) {
    errors.push('BREVO_FROM_EMAIL não configurada')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
