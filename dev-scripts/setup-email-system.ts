import { PrismaClient } from '@prisma/client'
import { DEFAULT_TEMPLATES } from '../src/lib/email'

const prisma = new PrismaClient()

async function setupEmailSystem() {
  try {
    console.log('🚀 Configurando sistema de e-mail...')

    // Verificar se já existem templates
    const existingTemplates = await prisma.emailTemplate.findMany()
    
    if (existingTemplates.length > 0) {
      console.log(`✅ ${existingTemplates.length} templates já existem no banco`)
      return
    }

    // Buscar um usuário FENAFAR_ADMIN para ser o criador dos templates
    const adminUser = await prisma.user.findFirst({
      where: { role: 'FENAFAR_ADMIN' }
    })

    if (!adminUser) {
      console.error('❌ Nenhum usuário FENAFAR_ADMIN encontrado. Crie um usuário admin primeiro.')
      return
    }

    console.log(`👤 Usando usuário admin: ${adminUser.name} (${adminUser.email})`)

    // Criar templates padrão
    for (const templateData of DEFAULT_TEMPLATES) {
      const template = await prisma.emailTemplate.create({
        data: {
          ...templateData,
          createdById: adminUser.id
        }
      })
      
      console.log(`✅ Template criado: ${template.name}`)
    }

    console.log('🎉 Sistema de e-mail configurado com sucesso!')
    console.log('')
    console.log('📋 Próximos passos:')
    console.log('1. Configure as variáveis de ambiente do Brevo:')
    console.log('   - BREVO_API_KEY=sua_chave_api')
    console.log('   - BREVO_FROM_EMAIL=seu_email@dominio.com')
    console.log('   - BREVO_FROM_NAME=Nome do Remetente')
    console.log('2. Execute: npx prisma generate')
    console.log('3. Teste o envio de e-mails na interface')

  } catch (error) {
    console.error('❌ Erro ao configurar sistema de e-mail:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEmailSystem()
}

export { setupEmailSystem }
