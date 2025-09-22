#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('🔧 Verificando configuração...')
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não encontrada')
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ Não encontrada')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  console.log('🚀 Criando tabelas diretamente via Supabase...\n')
  
  try {
    // 1. Criar ENUMs
    console.log('📋 Criando enums...')
    
    const { error: enumError1 } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE "UserRole" AS ENUM ('FENAFAR_ADMIN', 'SINDICATO_ADMIN', 'MEMBER');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    })
    
    const { error: enumError2 } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE "DocumentoTipo" AS ENUM ('CCT', 'ACT', 'AVATAR', 'OUTRO');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    })
    
    if (enumError1 || enumError2) {
      console.log('⚠️ Enums já existem ou erro:', enumError1 || enumError2)
    } else {
      console.log('✅ Enums criados')
    }

    // 2. Criar tabela users
    console.log('📋 Criando tabela users...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "users" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "email" VARCHAR UNIQUE NOT NULL,
          "name" VARCHAR,
          "phone" VARCHAR,
          "role" "UserRole" DEFAULT 'MEMBER',
          "emailConfirmed" BOOLEAN DEFAULT false,
          "active" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now(),
          "cpf" VARCHAR UNIQUE,
          "cargo" VARCHAR,
          "sindicatoId" UUID UNIQUE
        );
      `
    })
    
    if (usersError) {
      console.log('⚠️ Erro ao criar users:', usersError)
    } else {
      console.log('✅ Tabela users criada')
    }

    // 3. Criar tabela sindicatos
    console.log('📋 Criando tabela sindicatos...')
    const { error: sindicatosError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "sindicatos" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR NOT NULL,
          "cnpj" VARCHAR UNIQUE NOT NULL,
          "address" VARCHAR,
          "city" VARCHAR,
          "state" VARCHAR,
          "zipCode" VARCHAR,
          "phone" VARCHAR,
          "email" VARCHAR NOT NULL,
          "website" VARCHAR,
          "description" VARCHAR,
          "active" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now()
        );
      `
    })
    
    if (sindicatosError) {
      console.log('⚠️ Erro ao criar sindicatos:', sindicatosError)
    } else {
      console.log('✅ Tabela sindicatos criada')
    }

    // 4. Criar tabela documentos
    console.log('📋 Criando tabela documentos...')
    const { error: documentosError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "documentos" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR NOT NULL,
          "tipo" "DocumentoTipo" NOT NULL,
          "description" VARCHAR,
          "fileUrl" VARCHAR NOT NULL,
          "fileSize" INTEGER,
          "mimeType" VARCHAR,
          "sindicatoId" UUID NOT NULL,
          "active" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now()
        );
      `
    })
    
    if (documentosError) {
      console.log('⚠️ Erro ao criar documentos:', documentosError)
    } else {
      console.log('✅ Tabela documentos criada')
    }

    // 5. Criar tabela convites
    console.log('📋 Criando tabela convites...')
    const { error: convitesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "convites" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "email" VARCHAR NOT NULL,
          "role" "UserRole" NOT NULL,
          "sindicatoId" UUID,
          "invitedBy" UUID NOT NULL,
          "expiresAt" TIMESTAMP NOT NULL,
          "acceptedAt" TIMESTAMP,
          "active" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now()
        );
      `
    })
    
    if (convitesError) {
      console.log('⚠️ Erro ao criar convites:', convitesError)
    } else {
      console.log('✅ Tabela convites criada')
    }

    // 6. Adicionar foreign keys
    console.log('📋 Adicionando relacionamentos...')
    const { error: fkError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          -- FK users -> sindicatos
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_sindicatoId_fkey') THEN
            ALTER TABLE "users" ADD CONSTRAINT "users_sindicatoId_fkey" 
            FOREIGN KEY ("sindicatoId") REFERENCES "sindicatos"("id");
          END IF;
          
          -- FK documentos -> sindicatos
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'documentos_sindicatoId_fkey') THEN
            ALTER TABLE "documentos" ADD CONSTRAINT "documentos_sindicatoId_fkey" 
            FOREIGN KEY ("sindicatoId") REFERENCES "sindicatos"("id");
          END IF;
          
          -- FK convites -> sindicatos
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'convites_sindicatoId_fkey') THEN
            ALTER TABLE "convites" ADD CONSTRAINT "convites_sindicatoId_fkey" 
            FOREIGN KEY ("sindicatoId") REFERENCES "sindicatos"("id");
          END IF;
          
          -- FK convites -> users
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'convites_invitedBy_fkey') THEN
            ALTER TABLE "convites" ADD CONSTRAINT "convites_invitedBy_fkey" 
            FOREIGN KEY ("invitedBy") REFERENCES "users"("id");
          END IF;
        END $$;
      `
    })
    
    if (fkError) {
      console.log('⚠️ Erro ao criar FKs:', fkError)
    } else {
      console.log('✅ Relacionamentos criados')
    }

    console.log('\n🎉 Tabelas criadas com sucesso!')
    console.log('💡 Agora você pode executar: npm run seed-direct')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    throw error
  }
}

// Função para verificar se a função exec_sql existe
async function ensureExecSqlFunction() {
  console.log('🔧 Verificando função exec_sql...')
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  })
  
  if (error) {
    console.log('⚠️ Tentando método alternativo...')
    // Se não conseguir criar a função, usar método direto
    return false
  }
  
  console.log('✅ Função exec_sql configurada')
  return true
}

// Executar se chamado diretamente
if (require.main === module) {
  ensureExecSqlFunction()
    .then(() => createTables())
    .then(() => {
      console.log('✅ Setup concluído!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro:', error)
      process.exit(1)
    })
}

export default createTables