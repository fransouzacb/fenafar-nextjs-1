#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

// Usar URL direta sem pooling para migrações
const DATABASE_URL = process.env.DATABASE_URL?.replace('6543', '5432').replace('&pgbouncer=true', '')

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada!')
  process.exit(1)
}

console.log('🔧 Usando URL direta:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'))

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
})

async function createSampleData() {
  console.log('🚀 Criando dados de exemplo...\n')
  
  try {
    // Limpar dados existentes (se existirem)
    console.log('🧹 Limpando dados existentes...')
    try {
      await prisma.convite.deleteMany()
      await prisma.documento.deleteMany()
      await prisma.user.updateMany({
        data: { sindicatoId: null }
      })
      await prisma.sindicato.deleteMany()
      await prisma.user.deleteMany()
      console.log('✅ Dados limpos')
    } catch (error) {
      console.log('⚠️ Tabelas podem não existir ainda, continuando...')
    }
    
    // 1. Criar usuário admin FENAFAR
    console.log('👤 Criando usuário admin FENAFAR...')
    const adminUser = await prisma.user.create({
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000', // ID fixo para testes
        email: 'admin@fenafar.com.br',
        name: 'Administrador FENAFAR',
        role: 'FENAFAR_ADMIN',
        emailConfirmed: true,
        active: true
      }
    })
    console.log('✅ Admin FENAFAR criado:', adminUser.email)
    
    // 2. Criar sindicato de exemplo
    console.log('🏢 Criando sindicato de exemplo...')
    const sindicato = await prisma.sindicato.create({
      data: {
        name: 'Sindicato dos Farmacêuticos de São Paulo',
        cnpj: '12.345.678/0001-90',
        email: 'contato@sindfarmsp.com.br',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        phone: '(11) 1234-5678',
        website: 'https://sindfarmsp.com.br',
        description: 'Sindicato representativo dos farmacêuticos da região metropolitana de São Paulo',
        active: true
      }
    })
    console.log('✅ Sindicato criado:', sindicato.name)
    
    // 3. Criar usuário admin do sindicato
    console.log('👤 Criando admin do sindicato...')
    const sindicatoAdmin = await prisma.user.create({
      data: {
        id: '123e4567-e89b-12d3-a456-426614174001', // ID fixo para testes
        email: 'admin@sindfarmsp.com.br',
        name: 'João Silva',
        role: 'SINDICATO_ADMIN',
        emailConfirmed: true,
        active: true,
        sindicatoId: sindicato.id,
        cpf: '123.456.789-01',
        cargo: 'Presidente'
      }
    })
    console.log('✅ Admin sindicato criado:', sindicatoAdmin.email)
    
    // 4. Criar membro do sindicato
    console.log('👤 Criando membro do sindicato...')
    const membro = await prisma.user.create({
      data: {
        id: '123e4567-e89b-12d3-a456-426614174002', // ID fixo para testes
        email: 'membro@sindfarmsp.com.br',
        name: 'Maria Santos',
        role: 'MEMBER',
        emailConfirmed: true,
        active: true,
        cpf: '987.654.321-01',
        cargo: 'Farmacêutica'
      }
    })
    console.log('✅ Membro criado:', membro.email)
    
    // 5. Criar documento de exemplo
    console.log('📄 Criando documento de exemplo...')
    const documento = await prisma.documento.create({
      data: {
        name: 'Convenção Coletiva de Trabalho 2024',
        tipo: 'CCT',
        description: 'Convenção Coletiva de Trabalho dos Farmacêuticos para o ano de 2024',
        fileUrl: 'https://exemplo.com/cct-2024.pdf',
        fileSize: 2048000,
        mimeType: 'application/pdf',
        sindicatoId: sindicato.id,
        active: true
      }
    })
    console.log('✅ Documento criado:', documento.name)
    
    // 6. Criar convite de exemplo
    console.log('✉️ Criando convite de exemplo...')
    const convite = await prisma.convite.create({
      data: {
        email: 'novo-sindicato@exemplo.com.br',
        role: 'SINDICATO_ADMIN',
        sindicatoId: null, // Convite para criar novo sindicato
        invitedBy: adminUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        active: true
      }
    })
    console.log('✅ Convite criado para:', convite.email)
    
    console.log('\n🎉 Dados de exemplo criados com sucesso!')
    console.log('\n📊 Resumo:')
    console.log(`✅ 1 Admin FENAFAR: ${adminUser.email}`)
    console.log(`✅ 1 Sindicato: ${sindicato.name}`)
    console.log(`✅ 1 Admin Sindicato: ${sindicatoAdmin.email}`)
    console.log(`✅ 1 Membro: ${membro.email}`)
    console.log(`✅ 1 Documento: ${documento.name}`)
    console.log(`✅ 1 Convite: ${convite.email}`)
    
    console.log('\n🔑 Credenciais para teste:')
    console.log('Admin FENAFAR: admin@fenafar.com.br / admin123')
    console.log('Admin Sindicato: admin@sindfarmsp.com.br / admin123')
    console.log('Membro: membro@sindfarmsp.com.br / membro123')
    
  } catch (error) {
    console.error('❌ Erro ao criar dados:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createSampleData()
    .then(() => {
      console.log('\n✅ Processo concluído!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro:', error)
      process.exit(1)
    })
}

export default createSampleData