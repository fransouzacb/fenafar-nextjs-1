import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createEmailTemplatesTable() {
  try {
    console.log('🚀 Criando enum EmailTemplateType...')

    // Criar enum EmailTemplateType
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."EmailTemplateType" AS ENUM ('convite_sindicato', 'convite_membro', 'notificacao', 'custom');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    console.log('✅ Enum EmailTemplateType criado')

    console.log('🚀 Criando tabela email_templates...')

    // Criar tabela email_templates
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."email_templates" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "htmlContent" TEXT NOT NULL,
        "textContent" TEXT,
        "variables" TEXT[],
        "type" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdById" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
      )
    `

    // Criar índice único para name
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "email_templates_name_key" ON "public"."email_templates"("name")
    `

    // Criar índice para createdById
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "email_templates_createdById_idx" ON "public"."email_templates"("createdById")
    `

    // Adicionar foreign key constraint
    await prisma.$executeRaw`
      DO $$ BEGIN
        ALTER TABLE "public"."email_templates" 
        ADD CONSTRAINT "email_templates_createdById_fkey" 
        FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    console.log('✅ Tabela email_templates criada com sucesso!')

    // Agora criar os templates padrão
    console.log('📧 Criando templates padrão...')

    const adminUser = await prisma.user.findFirst({
      where: { role: 'FENAFAR_ADMIN' }
    })

    if (!adminUser) {
      console.error('❌ Nenhum usuário FENAFAR_ADMIN encontrado')
      return
    }

    console.log(`👤 Usando usuário admin: ${adminUser.name} (${adminUser.email})`)

    // Template para convite de sindicato
    try {
      await prisma.emailTemplate.create({
      data: {
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
                  <p><strong>Limite de Membros:</strong> {{maxMembers}}</p>
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
          - Limite de Membros: {{maxMembers}}
          
          Para aceitar este convite: {{linkConvite}}
          
          IMPORTANTE: Este convite expira em {{expiraEm}}. Após esta data, será necessário solicitar um novo convite.
          
          Se você não esperava este convite, pode ignorar este e-mail.
          
          Atenciosamente,
          Equipe FENAFAR
        `,
        variables: ['nomeSindicato', 'cnpjSindicato', 'linkConvite', 'expiraEm', 'criadoPor', 'maxMembers'],
        type: 'convite_sindicato',
        isActive: true,
        createdById: adminUser.id
      }
      })

      console.log('✅ Template "Convite para Admin de Sindicato" criado')
    } catch (error) {
      console.log('⚠️  Template "Convite para Admin de Sindicato" não pôde ser criado (modelo pode não existir):', error)
    }

    // Template para convite de membro
    try {
      await prisma.emailTemplate.create({
      data: {
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
        isActive: true,
        createdById: adminUser.id
      }
      })

      console.log('✅ Template "Convite para Membro" criado')
    } catch (error) {
      console.log('⚠️  Template "Convite para Membro" não pôde ser criado (modelo pode não existir):', error)
    }

    console.log('🎉 Sistema de e-mail configurado com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao configurar sistema de e-mail:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createEmailTemplatesTable()
