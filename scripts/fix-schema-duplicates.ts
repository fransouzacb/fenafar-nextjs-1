import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSchemaDuplicates() {
  console.log('🚀 Corrigindo duplicatas e schema do banco de dados...')
  
  try {
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')

    // 1. Verificar se tabela membros existe e removê-la
    console.log('📊 Verificando tabela membros...')
    const membrosExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'membros'
      );
    ` as any[]
    
    if (membrosExists[0]?.exists) {
      console.log('⚠️  Tabela membros encontrada - será removida')
      console.log('💡 A tabela membros será removida - os dados já estão em users')
      
      // Remover tabela membros
      console.log('🗑️ Removendo tabela membros...')
      await prisma.$executeRaw`DROP TABLE "membros" CASCADE;`
      console.log('✅ Tabela membros removida')
    } else {
      console.log('✅ Tabela membros já foi removida')
    }

    // 3. Adicionar coluna maxMembers na tabela sindicatos se não existir
    console.log('🔧 Adicionando coluna maxMembers em sindicatos...')
    await prisma.$executeRaw`
      ALTER TABLE "sindicatos" 
      ADD COLUMN IF NOT EXISTS "maxMembers" INTEGER;
    `
    console.log('✅ Coluna maxMembers adicionada')

    // 4. Adicionar coluna maxMembers na tabela convites se não existir
    console.log('🔧 Adicionando coluna maxMembers em convites...')
    await prisma.$executeRaw`
      ALTER TABLE "convites" 
      ADD COLUMN IF NOT EXISTS "maxMembers" INTEGER;
    `
    console.log('✅ Coluna maxMembers adicionada')

    // 5. Corrigir relacionamento documentos - remover membroId e adicionar userId
    console.log('🔧 Corrigindo relacionamentos em documentos...')
    
    // Primeiro, adicionar userId se não existir
    await prisma.$executeRaw`
      ALTER TABLE "documentos" 
      ADD COLUMN IF NOT EXISTS "userId" TEXT;
    `
    
    // Adicionar foreign key para users (sem IF NOT EXISTS)
    try {
      await prisma.$executeRaw`
        ALTER TABLE "documentos" 
        ADD CONSTRAINT "documentos_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('✅ Foreign key já existe')
      } else {
        throw error
      }
    }
    
    // Remover membroId se existir
    await prisma.$executeRaw`
      ALTER TABLE "documentos" 
      DROP COLUMN IF EXISTS "membroId";
    `
    
    console.log('✅ Relacionamentos de documentos corrigidos')

    // 6. Verificar tabelas duplicadas
    console.log('🔍 Verificando tabelas duplicadas...')
    
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    ` as any[]
    
    console.log('📋 Tabelas encontradas:')
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`)
    })

    // 7. Verificar dados nas tabelas
    console.log('📊 Verificando dados nas tabelas...')
    
    const userCount = await prisma.user.count()
    const sindicatoCount = await prisma.sindicato.count()
    const conviteCount = await prisma.convite.count()
    const documentoCount = await prisma.documento.count()
    
    console.log(`📈 Contadores:`)
    console.log(`  - Users: ${userCount}`)
    console.log(`  - Sindicatos: ${sindicatoCount}`)
    console.log(`  - Convites: ${conviteCount}`)
    console.log(`  - Documentos: ${documentoCount}`)

    console.log('✅ Schema corrigido com sucesso!')
    console.log('🎯 Próximos passos:')
    console.log('  1. Atualizar APIs para usar o novo schema')
    console.log('  2. Corrigir formulários de convites')
    console.log('  3. Implementar visualização e reenvio de convites')

  } catch (error) {
    console.error('❌ Erro ao corrigir schema:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixSchemaDuplicates()
    .catch((error) => {
      console.error('Falha na correção:', error)
      process.exit(1)
    })
}

export { fixSchemaDuplicates }
