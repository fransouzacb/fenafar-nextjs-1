#!/usr/bin/env tsx

/**
 * Script para limpar tabelas duplicadas
 * Remove tabelas com nomes em maiúsculo que foram criadas por engano
 */

import { PrismaClient } from '@prisma/client'

async function cleanDuplicateTables() {
  const prisma = new PrismaClient()

  try {
    console.log('🧹 Limpando tabelas duplicadas...')
    
    // Usar raw SQL para verificar e remover tabelas
    const tablesResult: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    console.log('📋 Tabelas encontradas:')
    tablesResult.forEach((row: any) => {
      console.log(`- ${row.table_name}`)
    })
    
    // Tabelas para remover (com nomes em maiúsculo)
    const tablesToRemove = ['Convite', 'Documento', 'Membro', 'Sindicato', 'User']
    
    for (const tableName of tablesToRemove) {
      try {
        // Verificar se a tabela existe antes de tentar remover
        const exists = tablesResult.some((row: any) => row.table_name === tableName)
        
        if (exists) {
          await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${tableName}" CASCADE`)
          console.log(`✅ Tabela ${tableName} removida`)
        } else {
          console.log(`ℹ️ Tabela ${tableName} não encontrada`)
        }
      } catch (error: any) {
        console.error(`❌ Erro ao remover tabela ${tableName}:`, error.message)
      }
    }
    
    console.log('\n📋 Tabelas restantes:')
    const finalTablesResult: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    finalTablesResult.forEach((row: any) => {
      console.log(`- ${row.table_name}`)
    })
    
    console.log('\n✅ Limpeza concluída!')
    
  } catch (error: any) {
    console.error('❌ Erro durante limpeza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  cleanDuplicateTables()
}