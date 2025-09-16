import { prisma } from '../src/lib/prisma'

async function checkData() {
  try {
    console.log('🔍 Verificando dados no banco...\n')

    const users = await prisma.user.count()
    console.log(`👤 Users: ${users}`)

    const sindicatos = await prisma.sindicato.count()
    console.log(`🏢 Sindicatos: ${sindicatos}`)

    const documentos = await prisma.documento.count()
    console.log(`📄 Documentos: ${documentos}`)

    const convites = await prisma.convite.count()
    console.log(`📧 Convites: ${convites}`)

    // Verificar se temos usuários com dados específicos
    const usersWithDetails = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        role: true,
      }
    })

    console.log('\n👥 Usuários cadastrados:')
    usersWithDetails.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.active ? 'Ativo' : 'Inativo'}`)
    })

    // Verificar sindicatos
    const sindicatosWithDetails = await prisma.sindicato.findMany({
      select: {
        id: true,
        name: true,
        active: true,
      }
    })

    console.log('\n🏢 Sindicatos cadastrados:')
    sindicatosWithDetails.forEach(sindicato => {
      console.log(`  - ${sindicato.name} - ${sindicato.active ? 'Ativo' : 'Inativo'}`)
    })

    console.log('\n✅ Verificação concluída!')
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()