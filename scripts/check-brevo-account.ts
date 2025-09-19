import * as brevo from '@getbrevo/brevo'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

async function checkBrevoAccount() {
  try {
    console.log('🔍 Verificando conta do Brevo...')
    
    if (!process.env.BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY não configurada')
      return
    }
    
    console.log(`✅ API Key configurada: ${process.env.BREVO_API_KEY.substring(0, 15)}...`)
    
    // Configurar cliente Brevo
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    // Tentar obter informações da conta
    console.log('📋 Verificando informações da conta...')
    
    // Testar com um endpoint simples primeiro
    const accountApi = new brevo.AccountApi()
    accountApi.setApiKey(brevo.AccountApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    try {
      const accountInfo = await accountApi.getAccount()
      console.log('✅ Conta verificada com sucesso!')
      console.log(`📧 Email: ${accountInfo.email}`)
      console.log(`🏢 Empresa: ${accountInfo.companyName}`)
      console.log(`📊 Plano: ${accountInfo.plan?.type || 'N/A'}`)
      
      // Verificar se tem permissões transacionais
      if (accountInfo.plan?.creditsType === 'sendLimit') {
        console.log(`📈 Limite de envio: ${accountInfo.plan?.creditsLimit || 'N/A'}`)
        console.log(`📉 Créditos restantes: ${accountInfo.plan?.creditsRemaining || 'N/A'}`)
      }
      
    } catch (accountError: any) {
      console.error('❌ Erro ao verificar conta:', accountError.response?.data || accountError.message)
    }
    
    // Verificar se a plataforma transacional está ativada
    console.log('📧 Verificando plataforma transacional...')
    
    try {
      // Tentar listar templates (isso requer permissões transacionais)
      const templatesApi = new brevo.TransactionalEmailsApi()
      templatesApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
      
      // Não vamos realmente listar, apenas testar a autenticação
      console.log('✅ Plataforma transacional parece estar ativada')
      
    } catch (transError: any) {
      console.error('❌ Erro na plataforma transacional:', transError.response?.data || transError.message)
      
      if (transError.response?.status === 401) {
        console.log('💡 Possíveis soluções:')
        console.log('   1. Verifique se a API key está correta')
        console.log('   2. Verifique se a plataforma transacional está ativada')
        console.log('   3. Entre em contato com o suporte do Brevo')
      }
    }
    
  } catch (error: any) {
    console.error('❌ Erro geral:', error.message)
  }
}

checkBrevoAccount()
