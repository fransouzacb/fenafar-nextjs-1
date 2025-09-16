# 🛠️ Stack Tecnológica

## Frontend

### Next.js 15.5.3
- **App Router**: Roteamento moderno baseado em arquivos
- **Server Components**: Renderização no servidor para performance
- **Client Components**: Interatividade no cliente quando necessário
- **Middleware**: Proteção de rotas e autenticação

### TypeScript 5.x
- **Tipagem forte**: Zero uso de `any` types
- **Interfaces bem definidas**: Para todos os modelos de dados
- **Type safety**: Validação em tempo de compilação

### Tailwind CSS v4.1.13
- **Utility-first**: Estilização rápida e consistente
- **Responsive design**: Mobile-first approach
- **Dark mode**: Suporte nativo
- **Custom properties**: Variáveis CSS personalizadas

### Chadcn/ui
- **Componentes acessíveis**: Baseados em Radix UI
- **Customizáveis**: Fácil personalização com Tailwind
- **TypeScript**: Totalmente tipado
- **Consistentes**: Design system unificado

## Backend

### Next.js API Routes
- **RESTful APIs**: Endpoints organizados por recurso
- **Middleware**: Validação e autenticação
- **Type safety**: Tipagem completa das requisições/respostas

### Prisma ORM
- **Type-safe queries**: Queries tipadas automaticamente
- **Migrations**: Controle de versão do banco
- **Relations**: Relacionamentos bem definidos
- **Query optimization**: Queries otimizadas

## Database & Storage

### Supabase PostgreSQL
- **PostgreSQL 15**: Banco relacional robusto
- **Real-time**: Atualizações em tempo real
- **Row Level Security**: Segurança a nível de linha
- **Backups automáticos**: Backup e restore automático

### Supabase Auth
- **JWT tokens**: Autenticação baseada em tokens
- **Email/password**: Login tradicional
- **Magic links**: Login sem senha
- **Social auth**: Google, GitHub (futuro)

### Supabase Storage
- **File storage**: Armazenamento de arquivos
- **CDN**: Distribuição global de conteúdo
- **Security**: Controle de acesso por bucket
- **Image optimization**: Otimização automática de imagens

## Development Tools

### ESLint + TypeScript
- **Code quality**: Padrões de código consistentes
- **Type checking**: Verificação de tipos
- **Auto-fix**: Correção automática de problemas

### Prettier (implícito)
- **Code formatting**: Formatação consistente
- **Editor integration**: Integração com editores

## Deployment

### Vercel
- **Edge functions**: Funções serverless globais
- **Automatic deployments**: Deploy automático do Git
- **Environment variables**: Gerenciamento de variáveis
- **Analytics**: Métricas de performance

## Dependências Principais

```json
{
  "dependencies": {
    "next": "15.5.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "typescript": "^5",
    "tailwindcss": "^4.1.13",
    "@supabase/supabase-js": "^2.57.4",
    "@prisma/client": "^6.16.1",
    "prisma": "^6.16.1",
    "lucide-react": "^0.544.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  }
}
```

## Versionamento

- **Semantic Versioning**: Controle de versões semântico
- **Git Flow**: Branching strategy
- **Conventional Commits**: Padrão de commits
- **Changelog**: Log de mudanças automático
