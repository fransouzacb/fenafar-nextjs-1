#!/usr/bin/env tsx

/**
 * Script de Seed para Schema Correto
 * 
 * Este script popula o banco com dados de teste usando o schema correto
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
    name: 'João Silva - Admin SP',
    phone: '(11) 99999-0002'
  },
  {
    email: 'sindicato2@teste.com',
    password: 'sindicato123',
    role: 'SINDICATO_ADMIN' as UserRole,
    name: 'Maria Santos - Admin RJ',
    phone: '(21) 99999-0003'
  },
  {
    email: 'membro1@teste.com',
    password: 'membro123',
    role: 'MEMBER' as UserRole,
    name: 'Pedro Oliveira',
    phone: '(11) 98888-0001'
  },
  {
    email: 'membro2@teste.com',
    password: 'membro123',
    role: 'MEMBER' as UserRole,
    name: 'Ana Costa',
    phone: '(21) 98888-0002'
  },
  {
    email: 'membro3@teste.com',
    password: 'membro123',
    role: 'MEMBER' as UserRole,
    name: 'Carlos Ferreira',
    phone: '(11) 98888-0003'
  }
]

const testSindicatos = [
  {
    name: 'Sindicato dos Farmacêuticos de São Paulo',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    phone: '(11) 3333-4444',
    email: 'contato@sindfarmsp.com.br',
    website: 'https://sindfarmsp.com.br',
    description: 'Sindicato representativo dos farmacêuticos do estado de São Paulo'
  },
  {
    name: 'Sindicato dos Farmacêuticos do Rio de Janeiro',
    cnpj: '98.765.432/0001-10',
    address: 'Av. Copacabana, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22070-900',
    phone: '(21) 3333-5555',
    email: 'contato@sindfarmrj.com.br',
    website: 'https://sindfarmrj.com.br',
    description: 'Sindicato representativo dos farmacêuticos do estado do Rio de Janeiro'
  }
]

async function cleanAll() {
  console.log('🧹 Limpando todos os dados...')
  
  // Limpar banco de dados
  await prisma.convite.deleteMany()
  await prisma.documento.deleteMany()
  await prisma.sindicato.deleteMany()
  await prisma.user.deleteMany()
  
  // Tentar limpar usuários do Supabase Auth
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (!error && users?.users) {
      for (const user of users.users) {
        await supabase.auth.admin.deleteUser(user.id)
      }
      console.log(`✅ ${users.users.length} usuários removidos do Supabase Auth`)
    }
  } catch (error) {
    console.log('⚠️ Erro ao limpar usuários do Supabase (pode ser normal):', error)
  }
  
  console.log('✅ Dados limpos')
}

async function createUsers() {
  console.log('🔐 Criando usuários de teste...')
  
  const createdUsers = []
  
  for (const userData of testUsers) {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          phone: userData.phone,
          role: userData.role
        }
      })

      if (authError) {
        console.error(`❌ Erro no Supabase Auth para ${userData.email}:`, authError.message)
        continue
      }

      if (!authData.user) {
        console.error(`❌ Dados de usuário inválidos para ${userData.email}`)
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
      console.error(`❌ Erro geral ao criar usuário ${userData.email}:`, error)
    }
  }
  
  console.log(`📊 Total de usuários criados: ${createdUsers.length}`)
  return createdUsers
}

async function createSindicatos(users: any[]) {
  console.log('🏢 Criando sindicatos de teste...')
  
  const createdSindicatos: any[] = []
  const sindicatoAdmins = users.filter(u => u.role === 'SINDICATO_ADMIN')
  
  console.log(`📋 Admins encontrados: ${sindicatoAdmins.length}`)
  
  if (sindicatoAdmins.length === 0) {
    console.error('❌ Nenhum admin de sindicato encontrado!')
    return createdSindicatos
  }
  
  for (let i = 0; i < testSindicatos.length && i < sindicatoAdmins.length; i++) {
    const sindicatoData = testSindicatos[i]
    const admin = sindicatoAdmins[i]
    
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
          status: 'APPROVED',
          approvedAt: new Date(),
          adminId: admin.id
        }
      })

      createdSindicatos.push(sindicato)
      console.log(`✅ Sindicato criado: ${sindicatoData.name} (Admin: ${admin.name})`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar sindicato ${sindicatoData.name}:`, error)
    }
  }
  
  console.log(`📊 Total de sindicatos criados: ${createdSindicatos.length}`)
  return createdSindicatos
}

// Função removida - modelo membro não existe mais
// async function createMembros(users: any[], sindicatos: any[]) {
//   console.log('👥 Criando membros de teste...')
//   
//   if (sindicatos.length === 0) {
//     console.error('❌ Nenhum sindicato encontrado para associar membros!')
//     return []
//   }
//   
//   const members = users.filter(u => u.role === 'MEMBER')
//   const createdMembros = []
//   
//   console.log(`📋 Membros para criar: ${members.length}`)
//   
//   for (let i = 0; i < members.length; i++) {
//     const memberData = members[i]
//     const sindicato = sindicatos[i % sindicatos.length] // Distribuir entre sindicatos
//     
//     try {
//       const membro = await prisma.membro.create({
//         data: {
//           nome: memberData.name,
//           cpf: `${String(111 + i).padStart(3, '0')}.${String(222 + i).padStart(3, '0')}.${String(333 + i).padStart(3, '0')}-${String(10 + i).padStart(2, '0')}`,
//           email: memberData.email,
//           telefone: memberData.phone,
//           cargo: i === 0 ? 'Farmacêutico Responsável' : i === 1 ? 'Técnico em Farmácia' : 'Auxiliar de Farmácia',
//           ativo: true,
//           userId: memberData.id,
//           sindicatoId: sindicato.id
//         }
//       })
//
//       createdMembros.push(membro)
//       console.log(`✅ Membro criado: ${memberData.name}`)
//       
//     } catch (error) {
//       console.error(`❌ Erro ao criar membro ${memberData.name}:`, error)
//     }
//   }
//   
//   console.log(`📊 Total de membros criados: ${createdMembros.length}`)
//   return createdMembros
// }

async function createDocumentos(sindicatos: any[], membros: any[]) {
  console.log('📄 Criando documentos de teste...')
  
  if (sindicatos.length === 0) {
    console.error('❌ Nenhum sindicato encontrado para criar documentos!')
    return []
  }
  
  const createdDocumentos = []
  
  // Criar documentos para sindicatos
  for (let i = 0; i < sindicatos.length; i++) {
    const sindicato = sindicatos[i]
    
    const documentos = [
      {
        titulo: `CCT ${sindicato.state} 2024`,
        tipo: 'CCT' as DocumentoTipo,
        arquivo: `/documentos/cct_${sindicato.state.toLowerCase()}_2024.pdf`,
        tamanho: 2048576,
        mimeType: 'application/pdf',
        versao: '1.0',
        ativo: true,
        sindicatoId: sindicato.id
      },
      {
        titulo: `ACT ${sindicato.state} 2024`,
        tipo: 'ACT' as DocumentoTipo,
        arquivo: `/documentos/act_${sindicato.state.toLowerCase()}_2024.pdf`,
        tamanho: 1536000,
        mimeType: 'application/pdf',
        versao: '1.0',
        ativo: true,
        sindicatoId: sindicato.id
      }
    ]
    
    for (const docData of documentos) {
      try {
        const documento = await prisma.documento.create({
          data: docData
        })

        createdDocumentos.push(documento)
        console.log(`✅ Documento criado: ${docData.titulo}`)
        
      } catch (error) {
        console.error(`❌ Erro ao criar documento ${docData.titulo}:`, error)
      }
    }
  }
  
  console.log(`📊 Total de documentos criados: ${createdDocumentos.length}`)
  return createdDocumentos
}

async function createConvites() {
  console.log('📧 Criando convites de teste...')
  
  // Buscar o admin FENAFAR
  const fenafarAdmin = await prisma.user.findFirst({
    where: { role: 'FENAFAR_ADMIN' }
  })
  
  if (!fenafarAdmin) {
    console.error('❌ Admin FENAFAR não encontrado para criar convites!')
    return []
  }
  
  const createdConvites = []
  
  const testConvites = [
    {
      email: 'convidado1@teste.com',
      role: 'SINDICATO_ADMIN' as UserRole
    },
    {
      email: 'convidado2@teste.com',
      role: 'SINDICATO_ADMIN' as UserRole
    }
  ]
  
  for (const conviteData of testConvites) {
    try {
      const convite = await prisma.convite.create({
        data: {
          email: conviteData.email,
          token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: conviteData.role,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
          usado: false,
          criadoPorId: fenafarAdmin.id
        }
      })

      createdConvites.push(convite)
      console.log(`✅ Convite criado: ${conviteData.email}`)
      
    } catch (error) {
      console.error(`❌ Erro ao criar convite ${conviteData.email}:`, error)
    }
  }
  
  console.log(`📊 Total de convites criados: ${createdConvites.length}`)
  return createdConvites
}

async function main() {
  try {
    console.log('🚀 Iniciando seed do Sistema FENAFAR com schema correto...\n')

    await cleanAll()
    
    const users = await createUsers()
    if (users.length === 0) {
      console.error('❌ Nenhum usuário foi criado. Abortando.')
      return
    }
    
    const sindicatos = await createSindicatos(users)
    // const membros = await createMembros(users, sindicatos) // Função removida
    const documentos = await createDocumentos(sindicatos, []) // Array vazio pois membros não existem mais
    const convites = await createConvites()

    console.log('\n📊 RESUMO DOS DADOS CRIADOS:')
    console.log(`👤 Usuários: ${users.length}`)
    console.log(`🏢 Sindicatos: ${sindicatos.length}`)
    console.log(`👥 Membros: 0`) // Modelo membro foi removido
    console.log(`📄 Documentos: ${documentos.length}`)
    console.log(`📧 Convites: ${convites.length}`)

    console.log('\n✅ Seed executado com sucesso!')

    console.log('\n🔑 CREDENCIAIS DE TESTE:')
    console.log('Admin FENAFAR: admin@fenafar.com.br / admin123')
    console.log('Admin Sindicato SP: sindicato1@teste.com / sindicato123')
    console.log('Admin Sindicato RJ: sindicato2@teste.com / sindicato123')
    console.log('Membro 1: membro1@teste.com / membro123')
    console.log('Membro 2: membro2@teste.com / membro123')
    console.log('Membro 3: membro3@teste.com / membro123')

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

export { main as seedCorrectSchema }
