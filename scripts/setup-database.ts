#!/usr/bin/env tsx

/**
 * Script de Setup do Banco de Dados
 * 
 * Este script:
 * 1. Executa as migrations do Prisma
 * 2. Verifica a conexão com o banco
 * 3. Executa os seeds de teste
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseConnection() {
  console.log('🔍 Verificando conexão com o banco de dados...')
  
  try {
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error)
    return false
  }
}

async function runMigrations() {
  console.log('📦 Executando migrations do Prisma...')
  
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Migrations executadas com sucesso')
    return true
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error)
    return false
  }
}

async function generatePrismaClient() {
  console.log('🔧 Gerando cliente Prisma...')
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Cliente Prisma gerado')
    return true
  } catch (error) {
    console.error('❌ Erro ao gerar cliente Prisma:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando setup do banco de dados...\n')
  
  try {
    // 1. Verificar conexão
    const connected = await checkDatabaseConnection()
    if (!connected) {
      console.log('❌ Não foi possível conectar com o banco. Verifique as variáveis de ambiente.')
      process.exit(1)
    }
    
    // 2. Gerar cliente Prisma
    const generated = await generatePrismaClient()
    if (!generated) {
      console.log('❌ Erro ao gerar cliente Prisma')
      process.exit(1)
    }
    
    // 3. Executar migrations
    const migrated = await runMigrations()
    if (!migrated) {
      console.log('❌ Erro ao executar migrations')
      process.exit(1)
    }
    
    // 4. Verificar conexão final
    const finalCheck = await checkDatabaseConnection()
    if (!finalCheck) {
      console.log('❌ Erro na verificação final')
      process.exit(1)
    }
    
    console.log('\n✅ Setup do banco concluído com sucesso!')
    console.log('💡 Agora você pode executar: npm run seed')
    
  } catch (error) {
    console.error('❌ Erro durante setup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main()
}

export { main as setupDatabase }
