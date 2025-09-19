#!/usr/bin/env tsx

import { PrismaClient, UserRole, DocumentoTipo } from '@prisma/client'

const prisma = new PrismaClient()

// Dados de teste simples para forçar a criação
async function createSimpleData() {
  try {
    console.log('🚀 Criando dados de teste simples...\n')

    // 1. Criar usuários diretamente na tabela PostgreSQL
    console.log('👤 Criando usuários...')
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'admin@fenafar.com.br' },
        update: {},
        create: {
          id: 'admin-uuid-1',
          email: 'admin@fenafar.com.br',
          name: 'Admin FENAFAR',
          role: 'FENAFAR_ADMIN',
          emailConfirmed: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'sindicato1@teste.com' },
        update: {},
        create: {
          id: 'sindicato-uuid-1',
          email: 'sindicato1@teste.com',
          name: 'João Silva',
          role: 'SINDICATO_ADMIN',
          emailConfirmed: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'sindicato2@teste.com' },
        update: {},
        create: {
          id: 'sindicato-uuid-2',
          email: 'sindicato2@teste.com',
          name: 'Maria Santos',
          role: 'SINDICATO_ADMIN',
          emailConfirmed: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'membro1@teste.com' },
        update: {},
        create: {
          id: 'membro-uuid-1',
          email: 'membro1@teste.com',
          name: 'Carlos Oliveira',
          role: 'MEMBER',
          emailConfirmed: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'membro2@teste.com' },
        update: {},
        create: {
          id: 'membro-uuid-2',
          email: 'membro2@teste.com',
          name: 'Ana Costa',
          role: 'MEMBER',
          emailConfirmed: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'membro3@teste.com' },
        update: {},
        create: {
          id: 'membro-uuid-3',
          email: 'membro3@teste.com',
          name: 'Pedro Silva',
          role: 'MEMBER',
          emailConfirmed: true
        }
      })
    ])
    console.log(`✅ ${users.length} usuários criados`)

    // 2. Criar sindicatos
    console.log('\n🏢 Criando sindicatos...')
    const sindicatos = await Promise.all([
      prisma.sindicato.upsert({
        where: { cnpj: '12.345.678/0001-90' },
        update: {},
        create: {
          name: 'Sindicato dos Farmacêuticos de São Paulo',
          cnpj: '12.345.678/0001-90',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          phone: '(11) 3333-4444',
          email: 'contato@sindicatosp.com.br',
          admin: {
            connect: { id: users[1].id } // João Silva
          }
        }
      }),
      prisma.sindicato.upsert({
        where: { cnpj: '98.765.432/0001-10' },
        update: {},
        create: {
          name: 'Sindicato dos Farmacêuticos do Rio de Janeiro',
          cnpj: '98.765.432/0001-10',
          address: 'Av. Copacabana, 456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '22000-000',
          phone: '(21) 2222-3333',
          email: 'contato@sindicatorj.com.br',
          admin: {
            connect: { id: users[2].id } // Maria Santos
          }
        }
      })
    ])
    console.log(`✅ ${sindicatos.length} sindicatos criados`)

    // 3. Associar membros aos sindicatos
    console.log('\n👥 Associando membros aos sindicatos...')
    await Promise.all([
      // TODO: Implementar relação MEMBER-Sindicato quando schema for atualizado
      // prisma.user.update({
      //   where: { id: users[3].id }, // Carlos
      //   data: { sindicatoId: sindicatos[0].id }
      // }),
      // prisma.user.update({
      //   where: { id: users[4].id }, // Ana
      //   data: { sindicatoId: sindicatos[0].id }
      // }),
      // prisma.user.update({
      //   where: { id: users[5].id }, // Pedro
      //   data: { sindicatoId: sindicatos[1].id }
      // })
    ])
    console.log('✅ Membros associados aos sindicatos')

    // 4. Criar documentos
    console.log('\n📄 Criando documentos...')
    const documentos = []
    for (const sindicato of sindicatos) {
      const docs = await Promise.all([
        prisma.documento.create({
          data: {
            titulo: 'Estatuto Social',
            tipo: 'OUTRO',
            arquivo: 'https://example.com/estatuto.pdf',
            tamanho: 1024000,
            mimeType: 'application/pdf',
            sindicatoId: sindicato.id,
            ativo: true
          }
        }),
        prisma.documento.create({
          data: {
            titulo: 'CCT 2024',
            tipo: 'CCT',
            arquivo: 'https://example.com/cct2024.pdf',
            tamanho: 2048000,
            mimeType: 'application/pdf',
            sindicatoId: sindicato.id,
            ativo: true
          }
        })
      ])
      documentos.push(...docs)
    }
    console.log(`✅ ${documentos.length} documentos criados`)

    // 5. Criar convites pendentes
    console.log('\n📧 Criando convites...')
    const convites = await Promise.all([
      prisma.convite.create({
        data: {
          email: 'novo1@exemplo.com',
          token: 'token-exemplo-1',
          role: 'MEMBER',
          sindicatoId: sindicatos[0].id,
          criadoPorId: users[0].id, // Admin FENAFAR
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.convite.create({
        data: {
          email: 'novo2@exemplo.com',
          token: 'token-exemplo-2',
          role: 'MEMBER',
          sindicatoId: sindicatos[1].id,
           criadoPorId: users[0].id, // Admin FENAFAR
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      })
    ])
    console.log(`✅ ${convites.length} convites criados`)

    // 6. Resumo final
    console.log('\n📊 RESUMO DOS DADOS CRIADOS:')
    console.log(`👤 Usuários: ${users.length}`)
    console.log(`🏢 Sindicatos: ${sindicatos.length}`)
    console.log(`📄 Documentos: ${documentos.length}`)
    console.log(`📧 Convites: ${convites.length}`)

    console.log('\n✅ Dados de teste criados com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao criar dados:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createSimpleData()