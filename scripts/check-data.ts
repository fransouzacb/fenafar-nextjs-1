#!/usr/bin/env tsx

/**
 * Script para Verificar Dados
 * 
 * Este script verifica se os dados foram criados corretamente
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  console.log('🔍 Verificando dados no banco...\n')
  
  try {
    // Verificar usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true
      }
    })
    
    console.log('👤 USUÁRIOS:')
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.name}`)
    })
    console.log(`  Total: ${users.length}\n`)
    
    // Verificar sindicatos
    const sindicatos = await prisma.sindicato.findMany({
      select: {
        id: true,
        name: true,
        cnpj: true,
        state: true,
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    console.log('🏢 SINDICATOS:')
    sindicatos.forEach(sindicato => {
      console.log(`  - ${sindicato.name} (${sindicato.state}) - Admin: ${sindicato.admin?.name}`)
    })
    console.log(`  Total: ${sindicatos.length}\n`)
    
    // Verificar usuários (membros são usuários com role MEMBER)
    const usuarios = await prisma.user.findMany({
      where: {
        role: 'MEMBER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        cargo: true
      }
    })
    
    console.log('👥 USUÁRIOS MEMBER:')
    usuarios.forEach(usuario => {
      console.log(`  - ${usuario.name} (${usuario.email}) - ${usuario.cargo || 'Sem cargo'}`)
    })
    console.log(`  Total: ${usuarios.length}\n`)
    
    // Verificar documentos
    const documentos = await prisma.documento.findMany({
      include: {
        sindicato: {
          select: {
            name: true
          }
        }
      }
    })
    
    console.log('📄 DOCUMENTOS:')
    documentos.forEach((doc: any) => {
      console.log(`  - ${doc.titulo || doc.name || 'Sem título'} (${doc.tipo}) - ${doc.sindicato.name}`)
    })
    console.log(`  Total: ${documentos.length}\n`)
    
    // Verificar convites
    const convites = await prisma.convite.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        usado: true,
        expiresAt: true
      }
    })
    
    console.log('📧 CONVITES:')
    convites.forEach(convite => {
      const status = convite.usado ? 'USADO' : 'PENDENTE'
      console.log(`  - ${convite.email} (${convite.role}) - ${status}`)
    })
    console.log(`  Total: ${convites.length}\n`)
    
    console.log('✅ Verificação concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  checkData()
}

export { checkData }