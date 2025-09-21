import * as brevo from '@getbrevo/brevo'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

async function testEmailSend() {
  try {
    console.log('🔍 Testando envio de e-mail com Brevo...')
    
    // Verificar variáveis de ambiente
    if (!process.env.BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY não configurada')
      return
    }
    
    console.log(`✅ API Key configurada: ${process.env.BREVO_API_KEY.substring(0, 10)}...`)
    
    // Configurar cliente Brevo
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    // Configurar e-mail de teste
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.to = [{ email: 'test@example.com' }]
    sendSmtpEmail.subject = 'Teste de Configuração - FENAFAR'
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Teste FENAFAR</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Teste de Configuração</h2>
          <p>Este é um teste de configuração do sistema de e-mail da FENAFAR.</p>
          <p>Se você recebeu este e-mail, a configuração está funcionando corretamente!</p>
          <p>Atenciosamente,<br>Equipe FENAFAR</p>
        </div>
      </body>
      </html>
    `
    sendSmtpEmail.textContent = `
      Teste de Configuração
      
      Este é um teste de configuração do sistema de e-mail da FENAFAR.
      
      Se você recebeu este e-mail, a configuração está funcionando corretamente!
      
      Atenciosamente,
      Equipe FENAFAR
    `
    sendSmtpEmail.sender = {
      email: process.env.BREVO_FROM_EMAIL || 'noreply@fenafar.org.br',
      name: process.env.BREVO_FROM_NAME || 'FENAFAR'
    }
    
    console.log('📧 Configuração do e-mail:')
    console.log(`  De: ${sendSmtpEmail.sender?.name} <${sendSmtpEmail.sender?.email}>`)
    console.log(`  Para: ${sendSmtpEmail.to?.[0]?.email}`)
    console.log(`  Assunto: ${sendSmtpEmail.subject}`)
    
    console.log('📤 Enviando e-mail...')
    
    // Enviar e-mail
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    console.log('✅ E-mail enviado com sucesso!')
    console.log(`📧 Message ID: ${result.messageId}`)
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar e-mail:', error)
    
    if (error.response) {
      console.error('📋 Detalhes do erro:')
      console.error(`  Status: ${error.response.status}`)
      console.error(`  Status Text: ${error.response.statusText}`)
      console.error(`  Data:`, error.response.data)
    } else if (error.request) {
      console.error('📋 Erro de requisição:', error.request)
    } else {
      console.error('📋 Erro:', error.message)
    }
  }
}

testEmailSend()
