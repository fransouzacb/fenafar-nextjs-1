// Email service using Brevo (formerly Sendinblue)
export interface EmailData {
  to: string
  subject: string
  htmlContent: string
  textContent?: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
      },
      body: JSON.stringify({
        sender: {
          name: 'FENAFAR',
          email: 'noreply@fenafar.com',
        },
        to: [
          {
            email: data.to,
          },
        ],
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent || data.htmlContent.replace(/<[^>]*>/g, ''),
      }),
    })

    if (!response.ok) {
      console.error('Email sending failed:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Email service error:', error)
    return false
  }
}

// Template for invitation emails
export function createInvitationEmail(
  email: string,
  sindicatoName: string,
  cnpj: string,
  cidade: string,
  estado: string,
  token: string
): EmailData {
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/convite/${token}`
  
  return {
    to: email,
    subject: `Convite para cadastro - FENAFAR`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Convite para cadastro - FENAFAR</h2>
        
        <p>Olá!</p>
        
        <p>Você foi convidado para cadastrar seu sindicato na plataforma FENAFAR.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Dados do convite:</h3>
          <ul>
            <li><strong>Sindicato:</strong> ${sindicatoName}</li>
            <li><strong>CNPJ:</strong> ${cnpj}</li>
            <li><strong>Cidade:</strong> ${cidade}, ${estado}</li>
          </ul>
        </div>
        
        <p>Para aceitar o convite, clique no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${acceptUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Aceitar Convite
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">
          Este convite expira em 7 dias.<br>
          Se você não conseguir clicar no botão, copie e cole este link no seu navegador:<br>
          <a href="${acceptUrl}">${acceptUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #64748b; font-size: 12px;">
          Atenciosamente,<br>
          Equipe FENAFAR
        </p>
      </div>
    `,
  }
}
