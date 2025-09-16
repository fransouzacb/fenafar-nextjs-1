npm run dev# 🤖 Copilot Instructions - Sistema FENAFAR

## 📋 Visão Geral do Projeto

Sistema de gestão para sindicatos e membros da FENAFAR (Federação Nacional dos Farmacêuticos), desenvolvido com tecnologias modernas e arquitetura escalável.

**Stack Principal**: Next.js 15.5.3 + React 19 + Tailwind CSS v4.1.13 + Prisma + Supabase

## 🚨 REGRAS OBRIGATÓRIAS

### ❌ **NUNCA FAZER DOWNGRADES**
- **NUNCA** fazer downgrade de versões de dependências
- **SEMPRE** usar as versões mais recentes e estáveis
- **NUNCA** forçar versões antigas por "compatibilidade"
- **SEMPRE** resolver problemas com as versões atuais

### ✅ **MELHORES PRÁTICAS OBRIGATÓRIAS**
- **TypeScript estrito**: Zero uso de `any` types
- **Server Components por padrão**: Client Components apenas quando necessário
- **Tailwind CSS v4**: Usar `@import "tailwindcss"` (não v3 syntax)
- **Responsividade**: Mobile-first approach
- **Acessibilidade**: Seguir padrões WCAG
- **Performance**: Otimizar desde o início

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas
```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Route groups
│   ├── (dashboard)/       # Admin dashboard
│   ├── (sindicato)/       # Sindicato area
│   └── api/               # API routes
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Chadcn/ui components
│   └── dashboards/       # Dashboard components
├── lib/                   # Utilities e configurações
├── hooks/                 # Custom hooks
├── contexts/              # React contexts
└── types/                 # TypeScript types
```

### Sistema de Roles
```
FENAFAR_ADMIN (Máximo)
    ↓
SINDICATO_ADMIN (Médio)
    ↓
MEMBER (Mínimo)
```

## 🔐 Autenticação e Segurança

### Fluxo de Autenticação
1. Usuário acessa página protegida
2. Middleware verifica token JWT
3. Se inválido → redireciona para login
4. Se válido → verifica role no banco
5. Permite acesso baseado na role

### Permissões por Role

#### 🔴 FENAFAR_ADMIN
- **Acesso**: Todas as funcionalidades
- **Páginas**: `/dashboard/*`
- **Ações**: Gerenciar todos os sindicatos, ver estatísticas globais

#### 🟡 SINDICATO_ADMIN
- **Acesso**: Apenas seu sindicato
- **Páginas**: `/sindicato/*`
- **Ações**: Gerenciar membros, upload de documentos

#### 🟢 MEMBER
- **Acesso**: Apenas seu perfil e sindicato
- **Páginas**: `/perfil/*`, `/sindicato/documentos`
- **Ações**: Visualizar documentos, upload de documentos no sindicato, upload pessoal

## 🗄️ Schema do Banco de Dados

### Entidades Principais
- **User**: Usuários do sistema (integração Supabase Auth)
- **Sindicato**: Sindicatos filiados à FENAFAR
- **Membro**: Membros dos sindicatos
- **Documento**: Documentos (CCT, ACT, avatares)
- **Convite**: Sistema de convites para novos sindicatos

### Relacionamentos
- User ↔ Membro: 1:1
- User ↔ Sindicato: 1:1 (admin)
- Sindicato ↔ Membro: 1:N
- Sindicato ↔ Documento: 1:N
- Membro ↔ Documento: 1:N

## 📧 Sistema de Convites

### Fluxo
1. **FENAFAR_ADMIN** cria convite com dados do sindicato
2. **Email** é enviado com token único
3. **Sindicato** acessa link e se cadastra
4. **SINDICATO_ADMIN** é criado e redirecionado

### Validações
- Token único e expiração (7 dias)
- CNPJ válido
- Email único
- Uso único do token

## 📤 Sistema de Uploads

### Tipos de Arquivo
- **Avatar**: JPG, PNG, WEBP (máx 5MB)
- **Documentos**: PDF, DOC, DOCX (máx 10MB)
- **CCT/ACT**: PDF, DOC, DOCX

### Estrutura Storage
```
supabase-storage/
├── avatars/
│   ├── sindicatos/
│   └── membros/
├── documentos/
│   ├── cct/
│   ├── act/
│   └── outros/
└── temporarios/
```

## 🎨 Design System

### Tailwind CSS v4
```css
/* Variáveis CSS customizadas */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}
```

### Chadcn/ui Components
- Usar componentes do Chadcn/ui
- Customizar via CSS variables
- Manter consistência visual
- Acessibilidade nativa

## 🔧 Padrões de Código

### TypeScript
```typescript
// ✅ BOM - Tipos específicos
interface User {
  id: string
  email: string
  role: 'FENAFAR_ADMIN' | 'SINDICATO_ADMIN' | 'MEMBER'
}

// ❌ RUIM - Usar any
const user: any = getUser()
```

### React Components
```typescript
// ✅ BOM - Server Component por padrão
export default async function Dashboard() {
  const data = await getData()
  return <div>{data}</div>
}

// ✅ BOM - Client Component quando necessário
'use client'
export function InteractiveButton() {
  const [state, setState] = useState()
  return <button onClick={() => setState()}>Click</button>
}
```

### API Routes
```typescript
// ✅ BOM - App Router API
export async function GET(request: Request) {
  const data = await getData()
  return Response.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const result = await createData(body)
  return Response.json(result)
}
```

## 📊 API Endpoints

### Autenticação (`/api/auth/`)
- `POST /login` - Login de usuário
- `POST /register` - Registro de usuário
- `POST /logout` - Logout
- `GET /me` - Dados do usuário logado
- `PUT /profile` - Atualizar perfil

### Sindicatos (`/api/sindicatos/`)
- `GET /` - Listar sindicatos (FENAFAR_ADMIN)
- `GET /[id]` - Obter sindicato específico
- `POST /` - Criar sindicato (FENAFAR_ADMIN)
- `PUT /[id]` - Atualizar sindicato
- `DELETE /[id]` - Excluir sindicato

### Membros (`/api/membros/`)
- `GET /` - Listar membros
- `GET /[id]` - Obter membro específico
- `POST /` - Criar membro
- `PUT /[id]` - Atualizar membro
- `DELETE /[id]` - Excluir membro

### Documentos (`/api/documentos/`)
- `GET /` - Listar documentos
- `GET /[id]` - Obter documento específico
- `POST /` - Upload de documento
- `PUT /[id]` - Atualizar documento
- `DELETE /[id]` - Excluir documento

### Convites (`/api/convites/`)
- `GET /` - Listar convites (FENAFAR_ADMIN)
- `POST /` - Criar convite (FENAFAR_ADMIN)
- `GET /accept/[token]` - Validar token (público)
- `POST /accept/[token]` - Aceitar convite (público)

## 🧪 Dados de Teste

### Credenciais de Teste
- **Admin FENAFAR**: `admin@fenafar.com.br` / `admin123`
- **Admin Sindicato**: `sindicato1@teste.com` / `sindicato123`
- **Membro**: `membro1@teste.com` / `membro123`

### Scripts Disponíveis
```bash
# Teste de conexão
npm run db:test

# Execução dos seeds
npm run db:seed

# Setup completo
npm run db:reset

# Interface visual do Prisma
npm run db:studio
```

## 🚀 Performance e Otimização

### Next.js 15
- Server Components por padrão
- Streaming e Suspense
- Image optimization
- Font optimization

### Tailwind CSS v4
- CSS-in-JS otimizado
- Tree-shaking automático
- Variáveis CSS nativas
- Animações performáticas

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

## 📝 Convenções de Nomenclatura

### Pastas
- **kebab-case**: `user-profile`, `api-routes`
- **Singular**: `component`, `hook`, `type`
- **Plural**: `components`, `hooks`, `types`

### Arquivos
- **kebab-case**: `user-profile.tsx`, `api-client.ts`
- **PascalCase**: `UserProfile.tsx`, `ApiClient.ts`
- **camelCase**: `userProfile.ts`, `apiClient.ts`

### Componentes
- **PascalCase**: `UserProfile`, `ApiClient`
- **Sufixos**: `.tsx` (React), `.ts` (TypeScript)

## 🚫 Anti-Patterns (NÃO FAZER)

### ❌ Downgrades
```bash
# ❌ NUNCA fazer isso
npm install tailwindcss@3.4.0
npm install react@18
```

### ❌ Any Types
```typescript
// ❌ NUNCA usar any
const data: any = await fetchData()
```

### ❌ Client Components desnecessários
```typescript
// ❌ NUNCA marcar como client se não precisar
'use client'
export function StaticComponent() {
  return <div>Static content</div>
}
```

### ❌ CSS inline
```typescript
// ❌ NUNCA usar style inline
<div style={{ color: 'red' }}>Text</div>

// ✅ BOM - Usar Tailwind
<div className="text-red-500">Text</div>
```

## 🎯 Objetivos do Sistema

1. **Performance**: Aplicação rápida e responsiva
2. **Manutenibilidade**: Código limpo e bem estruturado
3. **Escalabilidade**: Arquitetura que cresce com o projeto
4. **Developer Experience**: Ferramentas modernas e produtivas
5. **User Experience**: Interface intuitiva e acessível

## 📞 Suporte

- **Documentação**: `/docs/` folder
- **Issues**: GitHub Issues
- **Code Review**: Pull Request obrigatório
- **Standards**: Seguir este documento

---

**Lembre-se**: Qualidade > Velocidade. É melhor fazer certo da primeira vez do que corrigir depois.

**Stack atual**: Next.js 15.5.3 + React 19 + Tailwind CSS v4.1.13 + Prisma + Supabase
