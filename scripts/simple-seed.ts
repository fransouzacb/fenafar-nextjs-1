import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Criando dados básicos...')

  try {
    // Buscar usuários existentes
    const users = await prisma.user.findMany()
    console.log(`📊 Encontrados ${users.length} usuários no banco`)

    // Criar sindicatos se não existirem
    const existingSindicatos = await prisma.sindicato.findMany()
    if (existingSindicatos.length === 0) {
      console.log('🏢 Criando sindicatos...')
      
      // Buscar admin de sindicato
      const sindicatoAdmin = await prisma.user.findFirst({
        where: { role: 'SINDICATO_ADMIN' }
      })

      if (sindicatoAdmin) {
        await prisma.sindicato.create({
          data: {
            name: 'Sindicato dos Farmacêuticos de São Paulo',
            cnpj: '12.345.678/0001-90',
            email: 'contato@sindicatosp.com',
            city: 'São Paulo',
            state: 'SP',
            active: true,
            admin: {
              connect: { id: sindicatoAdmin.id }
            }
          }
        })
        console.log('✅ Sindicato SP criado')
      }

      // Criar segundo sindicato se houver outro admin
      const admins = await prisma.user.findMany({
        where: { role: 'SINDICATO_ADMIN' }
      })

      if (admins.length > 1) {
        await prisma.sindicato.create({
          data: {
            name: 'Sindicato dos Farmacêuticos do Rio de Janeiro',
            cnpj: '98.765.432/0001-10',
            email: 'contato@sindicatorj.com',
            city: 'Rio de Janeiro',
            state: 'RJ',
            active: true,
            admin: {
              connect: { id: admins[1].id }
            }
          }
        })
        console.log('✅ Sindicato RJ criado')
      }
    } else {
      console.log(`📊 Encontrados ${existingSindicatos.length} sindicatos no banco`)
    }

    // Criar alguns documentos de exemplo
    const existingDocs = await prisma.documento.findMany()
    if (existingDocs.length === 0) {
      console.log('📄 Criando documentos de exemplo...')
      
      const sindicatos = await prisma.sindicato.findMany()
      if (sindicatos.length > 0) {
        await prisma.documento.create({
          data: {
            titulo: 'Estatuto do Sindicato',
            tipo: 'OUTRO',
            arquivo: 'https://example.com/estatuto.pdf',
            versao: '1.0',
            ativo: true,
            sindicato: {
              connect: { id: sindicatos[0].id }
            }
          }
        })
        console.log('✅ Documento criado')
      }
    } else {
      console.log(`📊 Encontrados ${existingDocs.length} documentos no banco`)
    }

    // Criar convites de exemplo
    const existingConvites = await prisma.convite.findMany()
    if (existingConvites.length === 0) {
      console.log('📧 Criando convites de exemplo...')
      
      const admin = await prisma.user.findFirst({
        where: { role: 'FENAFAR_ADMIN' }
      })

      if (admin) {
        await prisma.convite.create({
          data: {
            email: 'convidado1@teste.com',
            role: 'MEMBER',
            token: 'token-simple-123',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            usado: false,
            criadoPorId: admin.id
          }
        })
        console.log('✅ Convite criado')
      }
    } else {
      console.log(`📊 Encontrados ${existingConvites.length} convites no banco`)
    }

    console.log('\n✅ Dados básicos criados com sucesso!')
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
