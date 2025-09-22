#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  console.log('🔄 Resetando banco de dados...\n')
  
  try {
    // Primeiro, vamos dropar todas as tabelas existentes para começar do zero
    console.log('🗑️ Removendo tabelas existentes...')
    
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Convite" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Documento" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Membro" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Sindicato" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "User" CASCADE;`
    
    // Dropar enums se existirem
    await prisma.$executeRaw`DROP TYPE IF EXISTS "UserRole" CASCADE;`
    await prisma.$executeRaw`DROP TYPE IF EXISTS "DocumentoTipo" CASCADE;`
    
    console.log('✅ Tabelas antigas removidas')
    
    // Agora vamos usar o Prisma para recriar tudo
    console.log('🏗️ Recriando estrutura do banco...')
    
    // Usar o db push para criar as tabelas baseadas no schema atual
    console.log('📋 Execute manualmente: npx prisma db push --force-reset')
    console.log('📋 Depois execute: npm run db:seed')
    
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('✅ Reset concluído!')
      console.log('💡 Agora execute: npx prisma db push --force-reset')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro:', error)
      process.exit(1)
    })
}

export default resetDatabase