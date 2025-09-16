# 🔧 Configuração de Variáveis de Ambiente

## Arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# Database
DATABASE_URL="postgres://postgres.dnjyilirfyfyqebodeue:wzuev1NydFxqfaH7@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://dnjyilirfyfyqebodeue.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuanlpbGlyZnlmeXFlYm9kZXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Njk3MjcsImV4cCI6MjA3MzU0NTcyN30.WsFJ8319v8rDC0LUjHWNYgrU5bUEqHDp_F83mU0GwcI"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuanlpbGlyZnlmeXFlYm9kZXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2OTcyNywiZXhwIjoyMDczNTQ1NzI3fQ.IZ7P7k-7pO2Ui6ZeRxmVRjh9rzkok-b9E6lFpVm6F8g"

# JWT Secret
JWT_SECRET="sXlNGLbhI6imO/Uxqw1pulZaEgL7GIUx9n/exW+bnOzCQW1ww4x8Tg2Zi7k="

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sXlNGLbhI6imO/Uxqw1pulZaEgL7GIUx9n/exW+bnOzCQW1ww4x8Tg2Zi7k="

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Service (Brevo)
BREVO_EMAIL_API="your-brevo-api-key-here"
```

## Verificação

Após criar o arquivo, execute:

```bash
npm run dev
```

Se tudo estiver correto, a aplicação deve iniciar sem erros.
