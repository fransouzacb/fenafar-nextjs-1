import { prisma } from '@/lib/prisma'

async function updateEmailTemplate() {
  try {
    console.log('🔄 Atualizando template de convite para sindicato...')

    // Buscar template de convite para sindicato
    const template = await prisma.emailTemplate.findFirst({
      where: { name: 'Convite para Admin de Sindicato' }
    })

    if (!template) {
      console.error('❌ Template não encontrado')
      return
    }

    // Atualizar template
    await prisma.emailTemplate.update({
      where: { id: template.id },
      data: {
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
                  <h3>Configuração do Sindicato:</h3>
                  <p><strong>Limite de Membros:</strong> {{maxMembers}}</p>
                  <p>Você poderá configurar o nome, CNPJ e outras informações do sindicato após aceitar o convite.</p>
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
          
          Configuração do Sindicato:
          - Limite de Membros: {{maxMembers}}
          
          Você poderá configurar o nome, CNPJ e outras informações do sindicato após aceitar o convite.
          
          Para aceitar este convite: {{linkConvite}}
          
          IMPORTANTE: Este convite expira em {{expiraEm}}. Após esta data, será necessário solicitar um novo convite.
          
          Se você não esperava este convite, pode ignorar este e-mail.
          
          Atenciosamente,
          Equipe FENAFAR
        `
      }
    })

    console.log('✅ Template atualizado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao atualizar template:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateEmailTemplate()
