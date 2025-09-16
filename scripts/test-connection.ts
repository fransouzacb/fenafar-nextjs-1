#!/usr/bin/env tsx

/**
 * Script de Teste de Conexão
 * 
 * Este script testa a conexão com o Supabase e cria as tabelas
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Testando conexão com o banco...')
  
  try {
    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Testar uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query de teste executada:', result)
    
    // Verificar se as tabelas existem
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `
    
    console.log('📋 Tabelas existentes no banco:')
    console.log(tables)
    
    return true
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

async function createTables() {
  console.log('🏗️ Criando tabelas...')
  
  try {
    // Criar enum UserRole
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('FENAFAR_ADMIN', 'SINDICATO_ADMIN', 'MEMBER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
    console.log('✅ Enum UserRole criado')
    
    // Criar enum DocumentoTipo
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "DocumentoTipo" AS ENUM ('ESTATUTO', 'ATA', 'RELATORIO', 'OUTRO');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
    console.log('✅ Enum DocumentoTipo criado')
    
    // Criar tabela User
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
        "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log('✅ Tabela User criada')
    
    // Criar tabela Sindicato
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Sindicato" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "cnpj" TEXT NOT NULL UNIQUE,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "zipCode" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "website" TEXT,
        "description" TEXT,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "adminId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Sindicato_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela Sindicato criada')
    
    // Criar tabela Membro
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Membro" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL,
        "sindicatoId" TEXT NOT NULL,
        "registrationNumber" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Membro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Membro_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "Sindicato"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Membro_userId_sindicatoId_key" UNIQUE ("userId", "sindicatoId")
      );
    `
    console.log('✅ Tabela Membro criada')
    
    // Criar tabela Documento
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Documento" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "tipo" "DocumentoTipo" NOT NULL,
        "description" TEXT,
        "fileUrl" TEXT NOT NULL,
        "fileSize" INTEGER NOT NULL,
        "mimeType" TEXT NOT NULL,
        "sindicatoId" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Documento_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "Sindicato"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela Documento criada')
    
    // Criar tabela Convite
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Convite" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "email" TEXT NOT NULL,
        "role" "UserRole" NOT NULL,
        "sindicatoId" TEXT NOT NULL,
        "invitedBy" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "acceptedAt" TIMESTAMP(3),
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Convite_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "Sindicato"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Convite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela Convite criada')
    
    console.log('🎉 Todas as tabelas foram criadas com sucesso!')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando teste de conexão e criação de tabelas...\n')
  
  try {
    // Testar conexão
    const connected = await testConnection()
    if (!connected) {
      console.log('❌ Não foi possível conectar com o banco')
      process.exit(1)
    }
    
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Criar tabelas
    const created = await createTables()
    if (!created) {
      console.log('❌ Erro ao criar tabelas')
      process.exit(1)
    }
    
    console.log('\n✅ Setup concluído com sucesso!')
    console.log('💡 Agora você pode executar: npm run db:seed')
    
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

export { main as testAndSetup }
