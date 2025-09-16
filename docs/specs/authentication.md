# 🔐 Sistema de Autenticação

## Visão Geral

Sistema de autenticação robusto baseado em Supabase Auth com controle de acesso baseado em roles, integrado ao Next.js 15 e Prisma ORM.

## 🏗️ Arquitetura

### Fluxo de Autenticação
```
1. Usuário acessa página protegida
2. Middleware verifica token JWT
3. Se inválido → redireciona para login
4. Se válido → verifica role no banco
5. Permite acesso baseado na role
```

### Componentes Principais
- **Supabase Auth**: Gerenciamento de sessão e tokens
- **Prisma**: Controle de roles e permissões
- **Next.js Middleware**: Proteção de rotas
- **JWT Tokens**: Autenticação stateless

## 👥 Sistema de Roles

### Hierarquia de Permissões
```
FENAFAR_ADMIN (Máximo)
    ↓
SINDICATO_ADMIN (Médio)
    ↓
MEMBER (Mínimo)
```

### Permissões por Role

#### 🔴 FENAFAR_ADMIN
- **Acesso**: Todas as funcionalidades
- **Páginas**: `/dashboard/*`
- **Ações**:
  - Gerenciar todos os sindicatos
  - Ver estatísticas globais
  - Acessar relatórios gerais
  - Gerenciar usuários admin

#### 🟡 SINDICATO_ADMIN
- **Acesso**: Apenas seu sindicato
- **Páginas**: `/sindicato/*`
- **Ações**:
  - Gerenciar membros do sindicato
  - Upload de documentos
  - Ver estatísticas do sindicato
  - Gerenciar documentos do sindicato

#### 🟢 MEMBER
- **Acesso**: Apenas seu perfil e sindicato
- **Páginas**: `/perfil/*`, `/sindicato/documentos`
- **Ações**:
  - Visualizar documentos do sindicato
  - Upload de documentos do sindicato
  - Atualizar perfil
  - Ver informações do sindicato

## 🔧 Implementação Técnica

### 1. Configuração Supabase Auth

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

### 2. Middleware de Proteção

```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Rotas protegidas
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/sindicato')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  
  return res
}
```

### 3. Hook de Autenticação

```typescript
// src/hooks/use-auth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Obter sessão inicial
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchUserRole(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        } else {
          setUser(null)
          setRole(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId: string) => {
    // Buscar role no banco via Prisma
    const response = await fetch(`/api/auth/role?userId=${userId}`)
    const data = await response.json()
    setRole(data.role)
  }

  return { user, role, loading }
}
```

### 4. Páginas de Autenticação

#### Login
```typescript
// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Redirecionar baseado na role
        const role = await getUserRole(data.user.id)
        redirectBasedOnRole(role)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'FENAFAR_ADMIN':
        router.push('/dashboard')
        break
      case 'SINDICATO_ADMIN':
        router.push('/sindicato')
        break
      case 'MEMBER':
        router.push('/perfil')
        break
      default:
        router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Formulário de login */}
    </form>
  )
}
```

### 5. Proteção de Rotas

#### Layout Protegido
```typescript
// src/app/(dashboard)/layout.tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/login')
    }
  }, [user, loading])

  if (loading) return <div>Carregando...</div>
  if (!user) return null

  // Verificar se tem permissão para acessar dashboard
  if (role !== 'FENAFAR_ADMIN') {
    redirect('/sindicato')
  }

  return <div>{children}</div>
}
```

## 🔒 Segurança

### Validações
- **Email**: Formato válido e único
- **Senha**: Mínimo 8 caracteres, complexidade
- **Token**: Validação JWT no servidor
- **Role**: Verificação no banco de dados

### Proteções
- **HTTPS**: Todas as comunicações criptografadas
- **CORS**: Configuração adequada
- **Rate Limiting**: Proteção contra ataques
- **Session Management**: Controle de sessão seguro

### Dados Sensíveis
- **Senhas**: Hash com bcrypt
- **Tokens**: JWT com expiração
- **Dados**: Criptografia em trânsito
- **Logs**: Sem dados sensíveis

## 🧪 Testes

### Cenários de Teste
1. **Login válido**: Usuário com credenciais corretas
2. **Login inválido**: Usuário com credenciais incorretas
3. **Sessão expirada**: Token JWT expirado
4. **Role incorreta**: Usuário sem permissão
5. **Logout**: Encerramento de sessão
6. **Recuperação**: Reset de senha

### Validações
- **Frontend**: Validação de formulários
- **Backend**: Validação de tokens
- **Banco**: Verificação de roles
- **Integração**: Fluxo completo

## 📊 Monitoramento

### Métricas
- **Logins**: Sucesso/falha por hora
- **Sessões**: Duração média
- **Erros**: Taxa de erro por endpoint
- **Performance**: Tempo de resposta

### Alertas
- **Muitas falhas**: Possível ataque
- **Sessões longas**: Possível problema
- **Erros 500**: Problema no servidor
- **Latência alta**: Problema de performance
