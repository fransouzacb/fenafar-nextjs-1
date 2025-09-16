# 📧 Sistema de Convites

## Visão Geral

Sistema de convites exclusivo para administradores FENAFAR cadastrarem novos sindicatos e seus respectivos administradores.

## 🎯 Objetivo

- **FENAFAR_ADMIN**: Envia convites para novos sindicatos
- **Sindicatos**: Recebem convite e se cadastram
- **SINDICATO_ADMIN**: Administra o sindicato após cadastro
- **Membros**: São adicionados diretamente pelo SINDICATO_ADMIN

## 🔄 Fluxo de Convites

### 1. Criação do Convite (FENAFAR_ADMIN)
```
FENAFAR_ADMIN → Dashboard → Convites → Novo Convite
├── Preenche dados do sindicato
├── Define email do administrador
├── Gera token único
└── Envia email com link
```

### 2. Aceitação do Convite (Sindicato)
```
Email recebido → Link do convite → Página de cadastro
├── Valida token
├── Preenche dados do sindicato
├── Cria conta do administrador
├── Ativa sindicato
└── Redireciona para dashboard
```

### 3. Gestão de Membros (SINDICATO_ADMIN)
```
SINDICATO_ADMIN → Membros → Adicionar Membro
├── Preenche dados do membro
├── Cria conta de usuário
├── Vincula ao sindicato
└── Envia credenciais por email
```

## 🏗️ Implementação Técnica

### Modelo de Dados
```prisma
model Convite {
  id          String   @id @default(cuid())
  email       String   // Email do futuro admin do sindicato
  token       String   @unique
  role        UserRole @default(SINDICATO_ADMIN)
  expiresAt   DateTime
  usado       Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Dados do sindicato (preenchidos no convite)
  nomeSindicato String
  cnpjSindicato String
  cidadeSindicato String
  estadoSindicato String
  
  // Relacionamentos
  criadoPorId String
  criadoPor   User     @relation(fields: [criadoPorId], references: [id])
  
  @@map("convites")
}
```

### API Endpoints

#### POST /api/convites
```typescript
// Criar novo convite (apenas FENAFAR_ADMIN)
interface CreateInviteRequest {
  email: string
  nomeSindicato: string
  cnpjSindicato: string
  cidadeSindicato: string
  estadoSindicato: string
}

interface CreateInviteResponse {
  success: boolean
  convite: Convite
  emailSent: boolean
}
```

#### GET /api/convites/accept/[token]
```typescript
// Validar token e mostrar dados do convite
interface ValidateTokenResponse {
  valid: boolean
  convite?: Convite
  error?: string
}
```

#### POST /api/convites/accept/[token]
```typescript
// Aceitar convite e criar sindicato
interface AcceptInviteRequest {
  nome: string
  telefone?: string
  endereco?: string
  cep?: string
  password: string
}

interface AcceptInviteResponse {
  success: boolean
  sindicato: Sindicato
  user: User
  session: Session
}
```

### Páginas do Sistema

#### 1. Listagem de Convites (FENAFAR_ADMIN)
```typescript
// src/app/(dashboard)/convites/page.tsx
- Lista todos os convites
- Status: Pendente, Aceito, Expirado
- Ações: Reenviar, Cancelar, Ver detalhes
```

#### 2. Criação de Convite (FENAFAR_ADMIN)
```typescript
// src/app/(dashboard)/convites/novo/page.tsx
- Formulário com dados do sindicato
- Email do administrador
- Validação de CNPJ
- Envio de email automático
```

#### 3. Aceitação de Convite (Público)
```typescript
// src/app/convite/[token]/page.tsx
- Validação do token
- Formulário de cadastro
- Criação do sindicato e usuário
- Redirecionamento para dashboard
```

## 🔒 Segurança

### Validações
- **Token único**: Geração criptográfica segura
- **Expiração**: 7 dias para aceitar convite
- **Uso único**: Token inválido após uso
- **Email válido**: Validação de formato
- **CNPJ válido**: Validação de CNPJ

### Controle de Acesso
- **Criação**: Apenas FENAFAR_ADMIN
- **Aceitação**: Público (com token válido)
- **Visualização**: Apenas FENAFAR_ADMIN
- **Cancelamento**: Apenas FENAFAR_ADMIN

## 📧 Sistema de Email

### Templates de Email

#### Convite para Sindicato
```html
Assunto: Convite para cadastro - FENAFAR

Olá!

Você foi convidado para cadastrar seu sindicato na plataforma FENAFAR.

Dados do convite:
- Sindicato: {nomeSindicato}
- CNPJ: {cnpjSindicato}
- Cidade: {cidadeSindicato}, {estadoSindicato}

Para aceitar o convite, clique no link abaixo:
{linkAceitar}

Este convite expira em 7 dias.

Atenciosamente,
Equipe FENAFAR
```

### Configuração SMTP
```typescript
// src/lib/email.ts
export const emailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}
```

## 📊 Monitoramento

### Métricas
- **Convites enviados**: Por dia/semana
- **Taxa de aceitação**: % de convites aceitos
- **Tempo médio**: Para aceitar convite
- **Convites expirados**: Não aceitos

### Alertas
- **Muitos expirados**: Possível problema
- **Falha no email**: Problema de envio
- **Tentativas inválidas**: Possível ataque

## 🧪 Testes

### Cenários de Teste
1. **Criação válida**: Convite com dados corretos
2. **Email inválido**: Formato incorreto
3. **CNPJ inválido**: Formato incorreto
4. **Token expirado**: Tentativa após expiração
5. **Token usado**: Tentativa de reuso
6. **Aceitação válida**: Cadastro completo
7. **Aceitação inválida**: Dados incorretos

### Validações
- **Frontend**: Validação de formulário
- **Backend**: Validação de dados
- **Email**: Envio e recebimento
- **Token**: Geração e validação
