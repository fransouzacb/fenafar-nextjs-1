import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Criando dados mínimos...')

  try {
    // Criar usuários básicos diretamente
    console.log('👤 Criando usuários...')
    
    const users = [
      {
        id: 'admin-001',
        email: 'admin@fenafar.com.br',
        name: 'Admin FENAFAR',
        role: 'FENAFAR_ADMIN' as const,
        active: true,
        emailConfirmed: true
      },
      {
        id: 'sindicato-001',
        email: 'sindicato1@teste.com',
        name: 'Admin Sindicato SP',
        role: 'SINDICATO_ADMIN' as const,
        active: true,
        emailConfirmed: true
      },
      {
        id: 'membro-001',
        email: 'membro1@teste.com',
        name: 'Membro Teste',
        role: 'MEMBER' as const,
        active: true,
        emailConfirmed: true,
        cpf: '123.456.789-00',
        cargo: 'Farmacêutico'
      }
    ]

    for (const userData of users) {
      try {
        await prisma.user.upsert({
          where: { email: userData.email },
          update: userData,
          create: userData
        })
        console.log(`✅ Usuário criado: ${userData.email}`)
      } catch (error) {
        console.log(`⚠️ Usuário já existe: ${userData.email}`)
      }
    }

    // Criar sindicato básico
    console.log('🏢 Criando sindicato...')
    
    try {
      await prisma.sindicato.upsert({
        where: { cnpj: '12.345.678/0001-90' },
        update: {
          name: 'Sindicato dos Farmacêuticos de São Paulo',
          email: 'contato@sindicatosp.com',
          city: 'São Paulo',
          state: 'SP',
          active: true
        },
        create: {
          name: 'Sindicato dos Farmacêuticos de São Paulo',
          cnpj: '12.345.678/0001-90',
          email: 'contato@sindicatosp.com',
          city: 'São Paulo',
          state: 'SP',
          active: true
        }
      })
      console.log('✅ Sindicato criado')
    } catch (error) {
      console.log('⚠️ Sindicato já existe')
    }

    // Criar documento básico
    console.log('📄 Criando documento...')
    
    try {
      await prisma.documento.create({
        data: {
          titulo: 'Estatuto do Sindicato',
          tipo: 'OUTRO',
          arquivo: 'https://example.com/estatuto.pdf',
          versao: '1.0',
          ativo: true
        }
      })
      console.log('✅ Documento criado')
    } catch (error) {
      console.log('⚠️ Erro ao criar documento:', error)
    }

    // Criar convite básico
    console.log('📧 Criando convite...')
    
    try {
      await prisma.convite.create({
        data: {
          email: 'convidado1@teste.com',
          role: 'MEMBER',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          active: true
        }
      })
      console.log('✅ Convite criado')
    } catch (error) {
      console.log('⚠️ Erro ao criar convite:', error)
    }

    console.log('\n✅ Dados mínimos criados com sucesso!')
    console.log('\n🔑 CREDENCIAIS DE TESTE:')
    console.log('Admin FENAFAR: admin@fenafar.com.br / admin123')
    console.log('Admin Sindicato: sindicato1@teste.com / sindicato123')
    console.log('Membro: membro1@teste.com / membro123')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
