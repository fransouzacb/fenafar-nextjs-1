# 🔐 API Endpoints - Autenticação

## Visão Geral

Endpoints para autenticação, gerenciamento de usuários e controle de acesso baseado em roles.

## 🔑 Autenticação

### POST /api/auth/login
**Descrição**: Login de usuário no sistema

**Request Body**:
```typescript
{
  email: string
  password: string
}
```

**Response Success (200)**:
```typescript
{
  success: true
  user: {
    id: string
    email: string
    name: string
    role: 'FENAFAR_ADMIN' | 'SINDICATO_ADMIN' | 'MEMBER'
  }
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}
```

**Response Error (400/401)**:
```typescript
{
  success: false
  error: string
}
```

### POST /api/auth/register
**Descrição**: Registro de novo usuário

**Request Body**:
```typescript
{
  email: string
  password: string
  name: string
  role?: 'MEMBER' // Default: MEMBER
}
```

**Response Success (201)**:
```typescript
{
  success: true
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  message: "Usuário criado com sucesso"
}
```

### POST /api/auth/logout
**Descrição**: Logout do usuário

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```typescript
{
  success: true
  message: "Logout realizado com sucesso"
}
```

### POST /api/auth/refresh
**Descrição**: Renovar token de acesso

**Request Body**:
```typescript
{
  refresh_token: string
}
```

**Response Success (200)**:
```typescript
{
  success: true
  access_token: string
  expires_at: number
}
```

### POST /api/auth/forgot-password
**Descrição**: Solicitar recuperação de senha

**Request Body**:
```typescript
{
  email: string
}
```

**Response Success (200)**:
```typescript
{
  success: true
  message: "Email de recuperação enviado"
}
```

### POST /api/auth/reset-password
**Descrição**: Redefinir senha com token

**Request Body**:
```typescript
{
  token: string
  password: string
}
```

**Response Success (200)**:
```typescript
{
  success: true
  message: "Senha redefinida com sucesso"
}
```

## 👤 Usuários

### GET /api/auth/me
**Descrição**: Obter dados do usuário logado

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```typescript
{
  success: true
  user: {
    id: string
    email: string
    name: string
    role: string
    createdAt: string
    updatedAt: string
    // Dados específicos baseados na role
    sindicato?: {
      id: string
      nome: string
      cnpj: string
    }
    membro?: {
      id: string
      nome: string
      cpf: string
      cargo?: string
    }
  }
}
```

### PUT /api/auth/profile
**Descrição**: Atualizar perfil do usuário

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  name?: string
  email?: string
  // Dados específicos baseados na role
  sindicato?: {
    nome?: string
    telefone?: string
    endereco?: string
    cidade?: string
    estado?: string
    cep?: string
  }
  membro?: {
    nome?: string
    telefone?: string
    cargo?: string
  }
}
```

**Response Success (200)**:
```typescript
{
  success: true
  user: {
    // Dados atualizados
  }
  message: "Perfil atualizado com sucesso"
}
```

### GET /api/auth/role
**Descrição**: Obter role do usuário

**Query Parameters**:
- `userId`: string (ID do usuário)

**Response Success (200)**:
```typescript
{
  success: true
  role: 'FENAFAR_ADMIN' | 'SINDICATO_ADMIN' | 'MEMBER'
}
```

## 🔒 Middleware de Autenticação

### Verificação de Token
```typescript
// Headers obrigatórios
Authorization: Bearer <jwt_token>

// Resposta de erro (401)
{
  success: false
  error: "Token inválido ou expirado"
}
```

### Verificação de Role
```typescript
// Query parameter obrigatório
?role=FENAFAR_ADMIN

// Resposta de erro (403)
{
  success: false
  error: "Acesso negado. Role insuficiente"
}
```

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Usuário não encontrado |
| 409 | Email já cadastrado |
| 500 | Erro interno do servidor |

## 🧪 Exemplos de Uso

### Login
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fenafar.com",
    "password": "senha123"
  }'
```

### Obter perfil
```bash
curl -X GET https://fenafar-nextjs.vercel.app/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Atualizar perfil
```bash
curl -X PUT https://fenafar-nextjs.vercel.app/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome",
    "email": "novo@email.com"
  }'
```
