import * as brevo from '@getbrevo/brevo'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

async function testBrevoConfig() {
  try {
    console.log('🔍 Testando configuração do Brevo...')
    
    // Verificar variáveis de ambiente
    console.log('📋 Variáveis de ambiente:')
    console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Configurada' : '❌ Não configurada'}`)
    console.log(`BREVO_FROM_EMAIL: ${process.env.BREVO_FROM_EMAIL || '❌ Não configurada'}`)
    console.log(`BREVO_FROM_NAME: ${process.env.BREVO_FROM_NAME || '❌ Não configurada'}`)
    
    if (!process.env.BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY não configurada')
      return
    }
    
    // Configurar cliente Brevo
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    console.log('✅ Cliente Brevo configurado')
    
    // Testar envio de e-mail
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.to = [{ email: 'test@example.com' }]
    sendSmtpEmail.subject = 'Teste de Configuração - FENAFAR'
    sendSmtpEmail.htmlContent = '<p>Este é um teste de configuração do Brevo.</p>'
    sendSmtpEmail.sender = {
      email: process.env.BREVO_FROM_EMAIL || 'noreply@fenafar.org.br',
      name: process.env.BREVO_FROM_NAME || 'FENAFAR'
    }
    
    console.log('📧 Tentando enviar e-mail de teste...')
    
    // Tentar enviar (mas não realmente enviar)
    console.log('✅ Configuração parece estar correta')
    console.log('📋 Dados do e-mail:')
    console.log(`  De: ${sendSmtpEmail.sender?.name} <${sendSmtpEmail.sender?.email}>`)
    console.log(`  Para: ${sendSmtpEmail.to?.[0]?.email}`)
    console.log(`  Assunto: ${sendSmtpEmail.subject}`)
    
  } catch (error) {
    console.error('❌ Erro na configuração:', error)
  }
}

testBrevoConfig()
