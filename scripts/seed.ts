#!/usr/bin/env tsx

/**
 * Script de Seeds para Sistema FENAFAR
 * 
 * Este script cria dados de teste para validação do sistema:
 * - Usuários com diferentes roles
 * - Sindicatos de exemplo
 * - Membros associados aos sindicatos
 * - Documentos de exemplo
 * - Convites de teste
 */

import { PrismaClient, UserRole, DocumentoTipo } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Configuração do Supabase para criar usuários
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Dados de teste
const testUsers = [
  {
    email: 'admin@fenafar.com.br',
    password: 'admin123',
    role: 'FENAFAR_ADMIN' as UserRole,
    name: 'Administrador FENAFAR',
    phone: '(11) 99999-0001'
  },
  {
    email: 'sindicato1@teste.com',
    password: 'sindicato123',
    role: 'SINDICATO_ADMIN' as UserRole,
    name: 'João Silva - Admin Sindicato',
    phone: '(11) 99999-0002'
  },
  {
    email: 'sindicato2@teste.com',
    password: 'sindicato123',
    role: 'SINDICATO_ADMIN' as UserRole,
    name: 'Maria Santos - Admin Sindicato',
    phone: '(11) 99999-0003'
  },
  {
    email: 'membro1@teste.com',
    password: 'membro123',
    role: 'MEMBER' as UserRole,
    name: 'Carlos Oliveira - Membro',
    phone: '(11) 99999-0004'
  },
  {
    email: 'membro2@teste.com',
    password: 'membro123',
    role: 'MEMBER' as UserRole,
    name: 'Ana Costa - Membro',
    phone: '(11) 99999-0005'
  }
]

const testSindicatos = [
  {
    name: 'Sindicato dos Farmacêuticos de São Paulo',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    phone: '(11) 3333-4444',
    email: 'contato@sindicatosp.com.br',
    website: 'https://sindicatosp.com.br',
    description: 'Sindicato representativo dos farmacêuticos da capital paulista'
  },
  {
    name: 'Sindicato dos Farmacêuticos do Rio de Janeiro',
    cnpj: '98.765.432/0001-10',
    address: 'Av. Copacabana, 456 - Copacabana',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22000-000',
    phone: '(21) 2222-3333',
    email: 'contato@sindicatorj.com.br',
    website: 'https://sindicatorj.com.br',
    description: 'Sindicato representativo dos farmacêuticos do estado do Rio de Janeiro'
  }
]

const testDocumentos = [
  {
    name: 'Estatuto do Sindicato',
    tipo: 'ESTATUTO' as DocumentoTipo,
    description: 'Estatuto social do sindicato',
    fileUrl: 'https://example.com/estatuto.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf'
  },
  {
    name: 'Ata de Assembleia Geral',
    tipo: 'ATA' as DocumentoTipo,
    description: 'Ata da última assembleia geral ordinária',
    fileUrl: 'https://example.com/ata.pdf',
    fileSize: 512000,
    mimeType: 'application/pdf'
  },
  {
    name: 'Relatório Financeiro 2024',
    tipo: 'RELATORIO' as DocumentoTipo,
    description: 'Relatório financeiro do exercício 2024',
    fileUrl: 'https://example.com/relatorio.pdf',
    fileSize: 2048000,
    mimeType: 'application/pdf'
  }
]

async function createUsers() {
  console.log('🔐 Criando usuários de teste...')
  
  const createdUsers = []
  
  for (const userData of testUsers) {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Confirmar email automaticamente
        user_metadata: {
          name: userData.name,
          phone: userData.phone
        }
      })

      if (authError) {
        console.error(`❌ Erro ao criar usuário ${userData.email}:`, authError.message)
        continue
      }

      // Criar usuário no Prisma
      const user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          emailConfirmed: true,
          active: true
        }
      })

      createdUsers.push(user)
      console.log(`✅ Usuário criado: ${userData.email} (${userData.role})`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar usuário ${userData.email}:`, error)
    }
  }
  
  return createdUsers
}

async function createSindicatos(users: any[]) {
  console.log('🏢 Criando sindicatos de teste...')
  
  const createdSindicatos = []
  const sindicatoAdmins = users.filter(u => u.role === 'SINDICATO_ADMIN')
  
  for (let i = 0; i < testSindicatos.length; i++) {
    const sindicatoData = testSindicatos[i]
    const admin = sindicatoAdmins[i] || sindicatoAdmins[0] // Usar primeiro admin se não houver suficiente
    
    try {
      const sindicato = await prisma.sindicato.create({
        data: {
          name: sindicatoData.name,
          cnpj: sindicatoData.cnpj,
          address: sindicatoData.address,
          city: sindicatoData.city,
          state: sindicatoData.state,
          zipCode: sindicatoData.zipCode,
          phone: sindicatoData.phone,
          email: sindicatoData.email,
          website: sindicatoData.website,
          description: sindicatoData.description,
          active: true,
          admin: {
            connect: { id: admin.id }
          }
        }
      })

      createdSindicatos.push(sindicato)
      console.log(`✅ Sindicato criado: ${sindicatoData.name}`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar sindicato ${sindicatoData.name}:`, error)
    }
  }
  
  return createdSindicatos
}

async function createMembros(users: any[], sindicatos: any[]) {
  console.log('👥 Criando membros de teste...')
  
  const members = users.filter(u => u.role === 'MEMBER')
  const createdMembros = []
  
  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    const sindicato = sindicatos[i % sindicatos.length] // Distribuir entre sindicatos
    
    try {
      // Atualizar o usuário com o sindicatoId
      const updatedMember = await prisma.user.update({
        where: { id: member.id },
        data: {
          sindicatoId: sindicato.id
        }
      })

      createdMembros.push(updatedMember)
      console.log(`✅ Membro criado: ${member.name} em ${sindicato.name}`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar membro ${member.name}:`, error)
    }
  }
  
  return createdMembros
}

async function createDocumentos(sindicatos: any[]) {
  console.log('📄 Criando documentos de teste...')
  
  const createdDocumentos = []
  
  for (const sindicato of sindicatos) {
    for (const docData of testDocumentos) {
      try {
        const documento = await prisma.documento.create({
          data: {
            name: docData.name,
            tipo: docData.tipo,
            description: docData.description,
            fileUrl: docData.fileUrl,
            fileSize: docData.fileSize,
            mimeType: docData.mimeType,
            sindicatoId: sindicato.id,
            active: true
          }
        })

        createdDocumentos.push(documento)
        console.log(`✅ Documento criado: ${docData.name} para ${sindicato.name}`)
        
      } catch (error) {
        console.error(`❌ Erro ao criar documento ${docData.name}:`, error)
      }
    }
  }
  
  return createdDocumentos
}

async function createConvites(users: any[], sindicatos: any[]) {
  console.log('📧 Criando convites de teste...')
  
  const admin = users.find(u => u.role === 'FENAFAR_ADMIN')
  const createdConvites = []
  
  const testEmails = [
    'convidado1@teste.com',
    'convidado2@teste.com',
    'convidado3@teste.com'
  ]
  
  for (const email of testEmails) {
    try {
      const convite = await prisma.convite.create({
        data: {
          email,
          role: 'MEMBER',
          sindicatoId: sindicatos[0].id, // Associar ao primeiro sindicato
          invitedBy: admin!.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
          active: true
        }
      })

      createdConvites.push(convite)
      console.log(`✅ Convite criado: ${email}`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar convite ${email}:`, error)
    }
  }
  
  return createdConvites
}

async function main() {
  console.log('🚀 Iniciando seeds do Sistema FENAFAR...\n')
  
  try {
    // Limpar dados existentes (cuidado em produção!)
    console.log('🧹 Limpando dados existentes...')
    await prisma.convite.deleteMany()
    await prisma.documento.deleteMany()
    // Limpar relacionamentos de sindicato dos usuários
    await prisma.user.updateMany({
      data: { sindicatoId: null }
    })
    await prisma.sindicato.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Dados limpos\n')
    
    // Criar dados de teste
    const users = await createUsers()
    console.log('')
    
    const sindicatos = await createSindicatos(users)
    console.log('')
    
    const membros = await createMembros(users, sindicatos)
    console.log('')
    
    const documentos = await createDocumentos(sindicatos)
    console.log('')
    
    const convites = await createConvites(users, sindicatos)
    console.log('')
    
    // Resumo final
    console.log('📊 RESUMO DOS DADOS CRIADOS:')
    console.log(`👤 Usuários: ${users.length}`)
    console.log(`🏢 Sindicatos: ${sindicatos.length}`)
    console.log(`👥 Membros: ${membros.length}`)
    console.log(`📄 Documentos: ${documentos.length}`)
    console.log(`📧 Convites: ${convites.length}`)
    console.log('\n✅ Seeds executados com sucesso!')
    
    // Credenciais de teste
    console.log('\n🔑 CREDENCIAIS DE TESTE:')
    console.log('Admin FENAFAR: admin@fenafar.com.br / admin123')
    console.log('Admin Sindicato 1: sindicato1@teste.com / sindicato123')
    console.log('Admin Sindicato 2: sindicato2@teste.com / sindicato123')
    console.log('Membro 1: membro1@teste.com / membro123')
    console.log('Membro 2: membro2@teste.com / membro123')
    
  } catch (error) {
    console.error('❌ Erro durante execução dos seeds:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main()
}

export { main as seedDatabase }
