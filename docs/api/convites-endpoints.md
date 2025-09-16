# 📧 API Endpoints - Convites

## Visão Geral

Endpoints para gerenciamento de convites de sindicatos, exclusivo para administradores FENAFAR.

## 📨 Convites

### GET /api/convites
**Descrição**: Listar convites (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page?`: number (página, default: 1)
- `limit?`: number (itens por página, default: 10)
- `status?`: 'pendente' | 'aceito' | 'expirado' (filtrar por status)
- `search?`: string (busca por email/nome do sindicato)
- `sortBy?`: string (ordenar por: email, createdAt, expiresAt)
- `sortOrder?`: 'asc' | 'desc' (ordem, default: desc)

**Response Success (200)**:
```typescript
{
  success: true
  data: {
    convites: [
      {
        id: string
        email: string
        token: string
        role: 'SINDICATO_ADMIN'
        expiresAt: string
        usado: boolean
        createdAt: string
        nomeSindicato: string
        cnpjSindicato: string
        cidadeSindicato: string
        estadoSindicato: string
        criadoPor: {
          id: string
          name: string
          email: string
        }
        status: 'pendente' | 'aceito' | 'expirado'
      }
    ]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
```

### GET /api/convites/[id]
**Descrição**: Obter convite específico

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do convite)

**Response Success (200)**:
```typescript
{
  success: true
  convite: {
    id: string
    email: string
    token: string
    role: 'SINDICATO_ADMIN'
    expiresAt: string
    usado: boolean
    createdAt: string
    nomeSindicato: string
    cnpjSindicato: string
    cidadeSindicato: string
    estadoSindicato: string
    criadoPor: {
      id: string
      name: string
      email: string
    }
    status: 'pendente' | 'aceito' | 'expirado'
  }
}
```

### POST /api/convites
**Descrição**: Criar novo convite (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  email: string
  nomeSindicato: string
  cnpjSindicato: string
  cidadeSindicato: string
  estadoSindicato: string
}
```

**Response Success (201)**:
```typescript
{
  success: true
  convite: {
    id: string
    email: string
    token: string
    expiresAt: string
    nomeSindicato: string
    cnpjSindicato: string
    cidadeSindicato: string
    estadoSindicato: string
  }
  emailSent: boolean
  message: "Convite criado e enviado com sucesso"
}
```

### PUT /api/convites/[id]
**Descrição**: Atualizar convite (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do convite)

**Request Body**:
```typescript
{
  email?: string
  nomeSindicato?: string
  cnpjSindicato?: string
  cidadeSindicato?: string
  estadoSindicato?: string
}
```

**Response Success (200)**:
```typescript
{
  success: true
  convite: {
    // Dados atualizados
  }
  message: "Convite atualizado com sucesso"
}
```

### DELETE /api/convites/[id]
**Descrição**: Cancelar convite (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do convite)

**Response Success (200)**:
```typescript
{
  success: true
  message: "Convite cancelado com sucesso"
}
```

## ✅ Aceitação de Convite

### GET /api/convites/accept/[token]
**Descrição**: Validar token e obter dados do convite (público)

**Path Parameters**:
- `token`: string (token do convite)

**Response Success (200)**:
```typescript
{
  success: true
  convite: {
    id: string
    email: string
    nomeSindicato: string
    cnpjSindicato: string
    cidadeSindicato: string
    estadoSindicato: string
    expiresAt: string
    valid: boolean
  }
}
```

**Response Error (400/404)**:
```typescript
{
  success: false
  error: 'Token inválido' | 'Convite expirado' | 'Convite já usado'
}
```

### POST /api/convites/accept/[token]
**Descrição**: Aceitar convite e criar sindicato (público)

**Path Parameters**:
- `token`: string (token do convite)

**Request Body**:
```typescript
{
  nome: string
  telefone?: string
  endereco?: string
  cep?: string
  password: string
}
```

**Response Success (201)**:
```typescript
{
  success: true
  sindicato: {
    id: string
    nome: string
    cnpj: string
    email: string
    cidade: string
    estado: string
    ativo: true
  }
  user: {
    id: string
    email: string
    name: string
    role: 'SINDICATO_ADMIN'
  }
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
  message: "Sindicato criado com sucesso"
}
```

## 📧 Reenvio de Convite

### POST /api/convites/[id]/resend
**Descrição**: Reenviar email do convite (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do convite)

**Response Success (200)**:
```typescript
{
  success: true
  emailSent: boolean
  message: "Email reenviado com sucesso"
}
```

## 📊 Estatísticas

### GET /api/convites/stats
**Descrição**: Obter estatísticas de convites

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```typescript
{
  success: true
  stats: {
    total: number
    pendentes: number
    aceitos: number
    expirados: number
    taxaAceitacao: number // % de convites aceitos
    porMes: [
      {
        mes: string
        enviados: number
        aceitos: number
      }
    ]
    tempoMedioAceitacao: number // em horas
  }
}
```

## 🔍 Busca e Filtros

### GET /api/convites/search
**Descrição**: Buscar convites com filtros avançados

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q?`: string (termo de busca)
- `status?`: string
- `estado?`: string
- `dataInicio?`: string (ISO date)
- `dataFim?`: string (ISO date)
- `page?`: number
- `limit?`: number

**Response Success (200)**:
```typescript
{
  success: true
  data: {
    convites: Convite[]
    pagination: PaginationInfo
    filters: {
      estados: string[]
      status: string[]
    }
  }
}
```

## 🔒 Validações

### Criação de Convite
- **Email único**: Não pode haver convite pendente para o mesmo email
- **CNPJ válido**: Formato e dígitos verificadores
- **Email válido**: Formato correto
- **Dados obrigatórios**: Todos os campos são obrigatórios

### Aceitação de Convite
- **Token válido**: Deve existir e não estar expirado
- **Token não usado**: Não pode ter sido usado anteriormente
- **Dados válidos**: Nome e senha obrigatórios
- **Email único**: Email não pode estar em uso

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Convite não encontrado |
| 409 | Email já convidado |
| 410 | Convite expirado |
| 500 | Erro interno do servidor |

## 🧪 Exemplos de Uso

### Listar convites
```bash
curl -X GET "https://fenafar-nextjs.vercel.app/api/convites?status=pendente&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Criar convite
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/convites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sindicatosp.com",
    "nomeSindicato": "Sindicato dos Farmacêuticos de SP",
    "cnpjSindicato": "12.345.678/0001-90",
    "cidadeSindicato": "São Paulo",
    "estadoSindicato": "SP"
  }'
```

### Aceitar convite
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/convites/accept/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "password": "senha123"
  }'
```
