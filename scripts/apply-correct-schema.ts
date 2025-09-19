#!/usr/bin/env tsx

/**
 * Script para Aplicar Schema Correto
 * 
 * Este script aplica o schema correto usando SQL direto,
 * evitando os problemas com comandos npx prisma
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function dropAllTables() {
  console.log('🗑️ Removendo todas as tabelas existentes...')
  
  try {
    // Remover tabelas na ordem correta (respeitando foreign keys)
    await prisma.$executeRaw`DROP TABLE IF EXISTS "convites" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "documentos" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "membros" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "sindicatos" CASCADE;`
    await prisma.$executeRaw`DROP TABLE IF EXISTS "users" CASCADE;`
    
    // Remover enums
    await prisma.$executeRaw`DROP TYPE IF EXISTS "UserRole" CASCADE;`
    await prisma.$executeRaw`DROP TYPE IF EXISTS "SindicatoStatus" CASCADE;`
    await prisma.$executeRaw`DROP TYPE IF EXISTS "DocumentoTipo" CASCADE;`
    
    console.log('✅ Tabelas e enums removidos')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao remover tabelas:', error)
    return false
  }
}

async function createEnums() {
  console.log('📋 Criando enums...')
  
  try {
    // UserRole
    await prisma.$executeRaw`
      CREATE TYPE "UserRole" AS ENUM ('FENAFAR_ADMIN', 'SINDICATO_ADMIN', 'MEMBER');
    `
    console.log('✅ Enum UserRole criado')
    
    // SindicatoStatus
    await prisma.$executeRaw`
      CREATE TYPE "SindicatoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    `
    console.log('✅ Enum SindicatoStatus criado')
    
    // DocumentoTipo
    await prisma.$executeRaw`
      CREATE TYPE "DocumentoTipo" AS ENUM ('CCT', 'ACT', 'AVATAR', 'OUTRO');
    `
    console.log('✅ Enum DocumentoTipo criado')
    
    return true
    
  } catch (error) {
    console.error('❌ Erro ao criar enums:', error)
    return false
  }
}

async function createTables() {
  console.log('🏗️ Criando tabelas...')
  
  try {
    // Tabela User
    await prisma.$executeRaw`
      CREATE TABLE "users" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "phone" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
        "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log('✅ Tabela users criada')
    
    // Tabela Sindicato
    await prisma.$executeRaw`
      CREATE TABLE "sindicatos" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "cnpj" TEXT NOT NULL UNIQUE,
        "address" TEXT,
        "city" TEXT,
        "state" TEXT,
        "zipCode" TEXT,
        "phone" TEXT,
        "email" TEXT NOT NULL,
        "website" TEXT,
        "description" TEXT,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "status" "SindicatoStatus" NOT NULL DEFAULT 'PENDING',
        "approvedAt" TIMESTAMP(3),
        "approvedBy" TEXT,
        "adminId" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "sindicatos_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela sindicatos criada')
    
    // Tabela Membro
    await prisma.$executeRaw`
      CREATE TABLE "membros" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "nome" TEXT NOT NULL,
        "cpf" TEXT NOT NULL UNIQUE,
        "email" TEXT NOT NULL,
        "telefone" TEXT,
        "cargo" TEXT,
        "ativo" BOOLEAN NOT NULL DEFAULT true,
        "userId" TEXT NOT NULL UNIQUE,
        "sindicatoId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "membros_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "membros_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "sindicatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela membros criada')
    
    // Tabela Documento
    await prisma.$executeRaw`
      CREATE TABLE "documentos" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "titulo" TEXT NOT NULL,
        "tipo" "DocumentoTipo" NOT NULL,
        "arquivo" TEXT NOT NULL,
        "tamanho" INTEGER,
        "mimeType" TEXT,
        "versao" TEXT NOT NULL DEFAULT '1.0',
        "ativo" BOOLEAN NOT NULL DEFAULT true,
        "sindicatoId" TEXT NOT NULL,
        "membroId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "documentos_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "sindicatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "documentos_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "membros"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela documentos criada')
    
    // Tabela Convite
    await prisma.$executeRaw`
      CREATE TABLE "convites" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "email" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "role" "UserRole" NOT NULL DEFAULT 'SINDICATO_ADMIN',
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "usado" BOOLEAN NOT NULL DEFAULT false,
        "sindicatoId" TEXT,
        "criadoPorId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "convites_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "sindicatos"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "convites_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `
    console.log('✅ Tabela convites criada')
    
    console.log('🎉 Todas as tabelas foram criadas com sucesso!')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error)
    return false
  }
}

async function main() {
  try {
    console.log('🚀 Aplicando schema correto no banco de dados...\n')
    
    // Conectar
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')
    
    // Remover tudo
    const dropped = await dropAllTables()
    if (!dropped) {
      console.log('❌ Erro ao remover tabelas existentes')
      return
    }
    
    // Criar enums
    const enumsCreated = await createEnums()
    if (!enumsCreated) {
      console.log('❌ Erro ao criar enums')
      return
    }
    
    // Criar tabelas
    const tablesCreated = await createTables()
    if (!tablesCreated) {
      console.log('❌ Erro ao criar tabelas')
      return
    }
    
    console.log('\n✅ Schema aplicado com sucesso!')
    console.log('💡 Agora você pode executar: npm run db:seed')
    
  } catch (error) {
    console.error('❌ Erro durante execução:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main()
}

export { main as applyCorrectSchema }
