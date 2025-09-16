# 🚀 Diretrizes de Desenvolvimento - Sistema FENAFAR

## 📋 Princípios Fundamentais

### ❌ **NÃO FAZER DOWNGRADES**
- **NUNCA** fazer downgrade de versões de dependências
- **SEMPRE** usar as versões mais recentes e estáveis
- **NUNCA** forçar versões antigas por "compatibilidade"
- **SEMPRE** resolver problemas com as versões atuais

### ✅ **MELHORES PRÁTICAS OBRIGATÓRIAS**

## 🛠️ Stack Tecnológica

### **Next.js 15.5.3**
- ✅ App Router (não Pages Router)
- ✅ Server Components por padrão
- ✅ Client Components apenas quando necessário
- ✅ TypeScript estrito (sem `any`)
- ✅ Turbopack para desenvolvimento

### **React 19**
- ✅ Hooks modernos (`use`, `useOptimistic`)
- ✅ Server Actions
- ✅ Concurrent Features
- ✅ Suspense e Error Boundaries

### **Tailwind CSS v4.1.13**
- ✅ `@import "tailwindcss"` (não v3 syntax)
- ✅ `@tailwindcss/postcss` plugin
- ✅ Variáveis CSS com `oklch()`
- ✅ Custom properties no `:root`
- ✅ Animações e keyframes personalizados

### **Prisma (Latest)**
- ✅ Schema-first approach
- ✅ Type-safe database access
- ✅ Migrations automáticas
- ✅ Raw queries quando necessário

### **Supabase (Latest)**
- ✅ Auth (Supabase Auth)
- ✅ Database (PostgreSQL)
- ✅ Storage (Supabase Storage)
- ✅ Real-time subscriptions

## 🏗️ Arquitetura do Sistema

### **Estrutura de Pastas**
```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Route groups
│   ├── dashboard/         # Admin dashboard
│   ├── sindicato/         # Sindicato area
│   └── api/               # API routes
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Chadcn/ui components
│   └── dashboards/       # Dashboard components
├── lib/                   # Utilities e configurações
├── hooks/                 # Custom hooks
├── contexts/              # React contexts
└── types/                 # TypeScript types
```

### **Padrões de Código**

#### **TypeScript**
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

#### **React Components**
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

#### **API Routes**
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

## 🎨 Design System

### **Chadcn/ui Components**
- ✅ Usar componentes do Chadcn/ui
- ✅ Customizar via CSS variables
- ✅ Manter consistência visual
- ✅ Acessibilidade nativa

### **Tailwind CSS**
```css
/* ✅ BOM - Variáveis CSS customizadas */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}

/* ✅ BOM - Classes utilitárias */
<div className="bg-background text-foreground p-4 rounded-lg">
```

## 🔐 Autenticação e Segurança

### **Supabase Auth**
- ✅ JWT tokens
- ✅ Row Level Security (RLS)
- ✅ Server-side validation
- ✅ Type-safe auth helpers

### **Prisma + Supabase**
- ✅ Connection pooling
- ✅ Prepared statements (quando necessário)
- ✅ Transaction support
- ✅ Error handling robusto

## 📁 Gerenciamento de Estado

### **Server State**
- ✅ Server Components para dados estáticos
- ✅ Server Actions para mutations
- ✅ Cache do Next.js

### **Client State**
- ✅ useState para estado local
- ✅ useReducer para estado complexo
- ✅ Context API para estado global
- ✅ Custom hooks para lógica reutilizável

## 🚀 Performance

### **Next.js 15**
- ✅ Server Components por padrão
- ✅ Streaming e Suspense
- ✅ Image optimization
- ✅ Font optimization

### **Tailwind CSS v4**
- ✅ CSS-in-JS otimizado
- ✅ Tree-shaking automático
- ✅ Variáveis CSS nativas
- ✅ Animações performáticas

## 🧪 Qualidade de Código

### **ESLint + Prettier**
- ✅ Configuração estrita
- ✅ Auto-fix no save
- ✅ Regras específicas para React/Next.js
- ✅ TypeScript strict mode

### **Git Workflow**
- ✅ Commits semânticos
- ✅ Branches feature
- ✅ Pull requests obrigatórios
- ✅ Code review

## 📚 Documentação

### **README.md**
- ✅ Setup instructions
- ✅ Environment variables
- ✅ Development workflow
- ✅ Deployment guide

### **API Documentation**
- ✅ Endpoints documentados
- ✅ Request/Response examples
- ✅ Error codes
- ✅ Authentication requirements

## 🚫 Anti-Patterns (NÃO FAZER)

### **❌ Downgrades**
```bash
# ❌ NUNCA fazer isso
npm install tailwindcss@3.4.0
npm install react@18
```

### **❌ Any Types**
```typescript
// ❌ NUNCA usar any
const data: any = await fetchData()
```

### **❌ Client Components desnecessários**
```typescript
// ❌ NUNCA marcar como client se não precisar
'use client'
export function StaticComponent() {
  return <div>Static content</div>
}
```

### **❌ CSS inline**
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
