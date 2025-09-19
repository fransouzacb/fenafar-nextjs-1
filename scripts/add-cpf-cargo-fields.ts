import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCpfCargoFields() {
  try {
    console.log('🚀 Adicionando campos CPF e Cargo ao schema User...')

    // Adicionar colunas CPF e Cargo à tabela users
    await prisma.$executeRaw`
      ALTER TABLE "public"."users" 
      ADD COLUMN IF NOT EXISTS "cpf" TEXT,
      ADD COLUMN IF NOT EXISTS "cargo" TEXT;
    `

    console.log('✅ Campos CPF e Cargo adicionados com sucesso!')

    // Verificar se as colunas foram criadas
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('cpf', 'cargo');
    `

    console.log('📋 Colunas criadas:', columns)

    console.log('🎉 Migração concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao adicionar campos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCpfCargoFields()
