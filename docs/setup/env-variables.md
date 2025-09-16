# 🔧 Variáveis de Ambiente

## Configuração Local (.env.local)

Crie o arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Database
DATABASE_URL="postgres://postgres.dnjyilirfyfyqebodeue:wzuev1NydFxqfaH7@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://dnjyilirfyfyqebodeue.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuanlpbGlyZnlmeXFlYm9kZXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Njk3MjcsImV4cCI6MjA3MzU0NTcyN30.WsFJ8319v8rDC0LUjHWNYgrU5bUEqHDp_F83mU0GwcI"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuanlpbGlyZnlmeXFlYm9kZXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2OTcyNywiZXhwIjoyMDczNTQ1NzI3fQ.IZ7P7k-7pO2Ui6ZeRxmVRjh9rzkok-b9E6lFpVm6F8g"

# JWT Secret
JWT_SECRET="9nQ4ikzSQiQA3s8GIrMab8RHDDbGqmK0/q0kRV9Y8BHqUAH034+eS56uc5kwiJznpSJ4anObp5YykHOqE1iIuA=="

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="fenafar-nextauth-secret-2024"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Configuração Vercel

As seguintes variáveis já estão configuradas no Vercel:

### ✅ Já Configuradas
- `DATABASE_SUPABASE_JWT_SECRET`
- `DATABASE_POSTGRES_USER`
- `DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_POSTGRES_PASSWORD`
- `DATABASE_POSTGRES_DATABASE`
- `DATABASE_SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_POSTGRES_HOST`
- `DATABASE_SUPABASE_ANON_KEY`
- `DATABASE_SUPABASE_URL`
- `DATABASE_NEXT_PUBLIC_SUPABASE_URL`
- `DATABASE_POSTGRES_URL_NON_POOLING`

### ❌ Faltam Configurar
- `DATABASE_URL` (para Prisma)
- `JWT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Adicionar Variáveis Faltantes no Vercel

1. Acesse o painel do Vercel
2. Vá em Settings > Environment Variables
3. Adicione as seguintes variáveis:

```
DATABASE_URL = postgres://postgres.dnjyilirfyfyqebodeue:wzuev1NydFxqfaH7@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

JWT_SECRET = 9nQ4ikzSQiQA3s8GIrMab8RHDDbGqmK0/q0kRV9Y8BHqUAH034+eS56uc5kwiJznpSJ4anObp5YykHOqE1iIuA==

NEXTAUTH_URL = https://fenafar-nextjs.vercel.app

NEXTAUTH_SECRET = fenafar-nextauth-secret-2024

NEXT_PUBLIC_APP_URL = https://fenafar-nextjs.vercel.app
```

## Verificação

Para verificar se todas as variáveis estão corretas, execute:

```bash
npm run dev
```

Se houver algum erro relacionado a variáveis de ambiente, verifique se todas estão configuradas corretamente.
