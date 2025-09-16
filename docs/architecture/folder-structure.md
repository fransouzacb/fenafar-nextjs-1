# 📁 Estrutura de Pastas

## Visão Geral

Estrutura organizada seguindo as melhores práticas do Next.js 15 com App Router, separação clara de responsabilidades e facilidade de manutenção.

## 🗂️ Estrutura Completa

```
fenafar-nextjs/
├── 📁 docs/                          # Documentação do projeto
│   ├── README.md                     # Documentação principal
│   ├── specs/                        # Especificações técnicas
│   ├── roadmap/                      # Roadmap e cronograma
│   ├── architecture/                 # Arquitetura e padrões
│   └── api/                          # Documentação da API
│
├── 📁 prisma/                        # Configuração do banco
│   ├── schema.prisma                 # Schema do banco de dados
│   ├── migrations/                   # Migrações do banco
│   └── seed.ts                       # Dados iniciais
│
├── 📁 public/                        # Arquivos estáticos
│   ├── favicon.ico                   # Favicon
│   ├── logo.svg                      # Logo da FENAFAR
│   └── images/                       # Imagens estáticas
│
├── 📁 src/                           # Código fonte
│   ├── 📁 app/                       # App Router (Next.js 15)
│   │   ├── globals.css               # Estilos globais
│   │   ├── layout.tsx                # Layout raiz
│   │   ├── page.tsx                  # Página inicial
│   │   ├── loading.tsx               # Loading global
│   │   ├── error.tsx                 # Error boundary
│   │   ├── not-found.tsx             # 404 page
│   │   │
│   │   ├── 📁 (auth)/                # Grupo de rotas de autenticação
│   │   │   ├── layout.tsx            # Layout de auth
│   │   │   ├── login/                # Página de login
│   │   │   ├── register/             # Página de registro
│   │   │   ├── recuperar-senha/      # Recuperação de senha
│   │   │   └── redefinir-senha/      # Redefinição de senha
│   │   │
│   │   ├── 📁 (dashboard)/           # Grupo de rotas do dashboard
│   │   │   ├── layout.tsx            # Layout do dashboard
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   ├── sindicatos/           # Gestão de sindicatos
│   │   │   ├── membros/              # Gestão de membros
│   │   │   ├── documentos/           # Gestão de documentos
│   │   │   ├── convites/             # Gestão de convites
│   │   │   └── configuracoes/        # Configurações
│   │   │
│   │   ├── 📁 (sindicato)/           # Grupo de rotas do sindicato
│   │   │   ├── layout.tsx            # Layout do sindicato
│   │   │   ├── page.tsx              # Dashboard do sindicato
│   │   │   ├── membros/              # Membros do sindicato
│   │   │   ├── documentos/           # Documentos do sindicato
│   │   │   ├── convites/             # Convites do sindicato
│   │   │   └── configuracoes/        # Configurações do sindicato
│   │   │
│   │   └── 📁 api/                   # API Routes
│   │       ├── auth/                 # Endpoints de autenticação
│   │       ├── sindicatos/           # Endpoints de sindicatos
│   │       ├── membros/              # Endpoints de membros
│   │       ├── documentos/           # Endpoints de documentos
│   │       ├── convites/             # Endpoints de convites
│   │       └── upload/               # Endpoints de upload
│   │
│   ├── 📁 components/                # Componentes reutilizáveis
│   │   ├── 📁 ui/                    # Componentes base (Chadcn/ui)
│   │   │   ├── button.tsx            # Botão
│   │   │   ├── input.tsx             # Input
│   │   │   ├── card.tsx              # Card
│   │   │   ├── table.tsx             # Tabela
│   │   │   ├── modal.tsx             # Modal
│   │   │   ├── form.tsx              # Formulário
│   │   │   ├── upload.tsx            # Upload
│   │   │   └── ...                   # Outros componentes
│   │   │
│   │   ├── 📁 forms/                 # Formulários específicos
│   │   │   ├── login-form.tsx        # Formulário de login
│   │   │   ├── sindicato-form.tsx    # Formulário de sindicato
│   │   │   ├── membro-form.tsx       # Formulário de membro
│   │   │   └── convite-form.tsx      # Formulário de convite
│   │   │
│   │   ├── 📁 layouts/               # Layouts específicos
│   │   │   ├── admin-layout.tsx      # Layout do admin
│   │   │   ├── sindicato-layout.tsx  # Layout do sindicato
│   │   │   └── auth-layout.tsx       # Layout de auth
│   │   │
│   │   ├── 📁 dashboards/            # Dashboards específicos
│   │   │   ├── admin-dashboard.tsx   # Dashboard do admin
│   │   │   └── sindicato-dashboard.tsx # Dashboard do sindicato
│   │   │
│   │   └── 📁 providers/             # Context providers
│   │       ├── auth-provider.tsx     # Provider de autenticação
│   │       ├── theme-provider.tsx    # Provider de tema
│   │       └── notification-provider.tsx # Provider de notificações
│   │
│   ├── 📁 lib/                       # Utilitários e configurações
│   │   ├── supabase.ts               # Cliente Supabase
│   │   ├── prisma.ts                 # Cliente Prisma
│   │   ├── auth.ts                   # Utilitários de auth
│   │   ├── upload.ts                 # Utilitários de upload
│   │   ├── utils.ts                  # Utilitários gerais
│   │   ├── validations.ts            # Validações
│   │   └── constants.ts              # Constantes
│   │
│   ├── 📁 hooks/                     # Custom hooks
│   │   ├── use-auth.ts               # Hook de autenticação
│   │   ├── use-upload.ts             # Hook de upload
│   │   ├── use-notifications.ts      # Hook de notificações
│   │   └── use-local-storage.ts      # Hook de localStorage
│   │
│   ├── 📁 types/                     # Definições de tipos
│   │   ├── auth.ts                   # Tipos de autenticação
│   │   ├── database.ts               # Tipos do banco
│   │   ├── api.ts                    # Tipos da API
│   │   └── common.ts                 # Tipos comuns
│   │
│   └── 📁 middleware.ts              # Middleware do Next.js
│
├── 📁 scripts/                       # Scripts de desenvolvimento
│   ├── setup-db.ts                   # Setup do banco
│   ├── seed-data.ts                  # Seed de dados
│   └── deploy.ts                     # Script de deploy
│
├── 📁 .env.local                     # Variáveis de ambiente (local)
├── 📁 .env.example                   # Exemplo de variáveis
├── 📁 .gitignore                     # Arquivos ignorados pelo Git
├── 📁 .eslintrc.json                 # Configuração do ESLint
├── 📁 .prettierrc                    # Configuração do Prettier
├── 📁 next.config.ts                 # Configuração do Next.js
├── 📁 tailwind.config.ts             # Configuração do Tailwind
├── 📁 tsconfig.json                  # Configuração do TypeScript
├── 📁 package.json                   # Dependências e scripts
└── 📁 README.md                      # Documentação do projeto
```

## 📋 Convenções de Nomenclatura

### 🗂️ Pastas
- **kebab-case**: `user-profile`, `api-routes`
- **Singular**: `component`, `hook`, `type`
- **Plural**: `components`, `hooks`, `types`

### 📄 Arquivos
- **kebab-case**: `user-profile.tsx`, `api-client.ts`
- **PascalCase**: `UserProfile.tsx`, `ApiClient.ts`
- **camelCase**: `userProfile.ts`, `apiClient.ts`

### 🏷️ Componentes
- **PascalCase**: `UserProfile`, `ApiClient`
- **Sufixos**: `.tsx` (React), `.ts` (TypeScript)

### 🔧 Utilitários
- **camelCase**: `formatDate`, `validateEmail`
- **Prefixo**: `use` para hooks (`useAuth`)

## 🎯 Organização por Responsabilidade

### 📱 Frontend (src/app/)
- **Páginas**: Componentes de página
- **Layouts**: Estrutura visual
- **API Routes**: Endpoints da API

### 🧩 Componentes (src/components/)
- **UI**: Componentes base reutilizáveis
- **Forms**: Formulários específicos
- **Layouts**: Layouts específicos
- **Dashboards**: Dashboards específicos

### 🔧 Utilitários (src/lib/)
- **Configurações**: Clientes externos
- **Helpers**: Funções auxiliares
- **Validações**: Regras de validação

### 🎣 Hooks (src/hooks/)
- **Custom hooks**: Lógica reutilizável
- **Estado**: Gerenciamento de estado
- **Efeitos**: Side effects

### 📝 Tipos (src/types/)
- **Interfaces**: Definições de tipos
- **Enums**: Enumerações
- **Unions**: Tipos união

## 🚀 Benefícios da Estrutura

### ✅ Manutenibilidade
- **Separação clara** de responsabilidades
- **Fácil localização** de arquivos
- **Estrutura previsível**

### ✅ Escalabilidade
- **Adição fácil** de novas funcionalidades
- **Reutilização** de componentes
- **Organização** por domínio

### ✅ Colaboração
- **Padrões claros** para toda equipe
- **Estrutura familiar** para desenvolvedores
- **Documentação** integrada

### ✅ Performance
- **Lazy loading** automático
- **Code splitting** por rota
- **Otimizações** do Next.js
