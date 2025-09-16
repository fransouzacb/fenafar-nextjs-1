# 🏢 API Endpoints - Sindicatos

## Visão Geral

Endpoints para gerenciamento de sindicatos, incluindo CRUD completo e operações específicas.

## 📋 Sindicatos

### GET /api/sindicatos
**Descrição**: Listar todos os sindicatos (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page?`: number (página, default: 1)
- `limit?`: number (itens por página, default: 10)
- `search?`: string (busca por nome/CNPJ)
- `ativo?`: boolean (filtrar por status)
- `estado?`: string (filtrar por estado)
- `sortBy?`: string (ordenar por: nome, cnpj, createdAt)
- `sortOrder?`: 'asc' | 'desc' (ordem, default: asc)

**Response Success (200)**:
```typescript
{
  success: true
  data: {
    sindicatos: [
      {
        id: string
        nome: string
        cnpj: string
        email: string
        telefone?: string
        cidade: string
        estado: string
        ativo: boolean
        createdAt: string
        updatedAt: string
        _count: {
          membros: number
          documentos: number
        }
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

### GET /api/sindicatos/[id]
**Descrição**: Obter sindicato específico

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do sindicato)

**Response Success (200)**:
```typescript
{
  success: true
  sindicato: {
    id: string
    nome: string
    cnpj: string
    email: string
    telefone?: string
    endereco?: string
    cidade: string
    estado: string
    cep?: string
    ativo: boolean
    createdAt: string
    updatedAt: string
    admin: {
      id: string
      name: string
      email: string
    }
    membros: [
      {
        id: string
        nome: string
        cpf: string
        email: string
        cargo?: string
        ativo: boolean
      }
    ]
    documentos: [
      {
        id: string
        titulo: string
        tipo: string
        arquivo: string
        createdAt: string
      }
    ]
  }
}
```

### POST /api/sindicatos
**Descrição**: Criar novo sindicato (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  nome: string
  cnpj: string
  email: string
  telefone?: string
  endereco?: string
  cidade: string
  estado: string
  cep?: string
  adminEmail: string
  adminName: string
  adminPassword: string
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
    // ... outros campos
  }
  admin: {
    id: string
    email: string
    name: string
  }
  message: "Sindicato criado com sucesso"
}
```

### PUT /api/sindicatos/[id]
**Descrição**: Atualizar sindicato

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do sindicato)

**Request Body**:
```typescript
{
  nome?: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  ativo?: boolean
}
```

**Response Success (200)**:
```typescript
{
  success: true
  sindicato: {
    // Dados atualizados
  }
  message: "Sindicato atualizado com sucesso"
}
```

### DELETE /api/sindicatos/[id]
**Descrição**: Excluir sindicato (apenas FENAFAR_ADMIN)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do sindicato)

**Response Success (200)**:
```typescript
{
  success: true
  message: "Sindicato excluído com sucesso"
}
```

## 📊 Estatísticas

### GET /api/sindicatos/stats
**Descrição**: Obter estatísticas dos sindicatos

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```typescript
{
  success: true
  stats: {
    total: number
    ativos: number
    inativos: number
    porEstado: [
      {
        estado: string
        quantidade: number
      }
    ]
    membrosTotal: number
    documentosTotal: number
    crescimento: {
      sindicatos: number // % de crescimento
      membros: number
    }
  }
}
```

### GET /api/sindicatos/[id]/stats
**Descrição**: Obter estatísticas de um sindicato específico

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do sindicato)

**Response Success (200)**:
```typescript
{
  success: true
  stats: {
    sindicato: {
      id: string
      nome: string
      cnpj: string
    }
    membros: {
      total: number
      ativos: number
      inativos: number
    }
    documentos: {
      total: number
      porTipo: [
        {
          tipo: string
          quantidade: number
        }
      ]
    }
    ultimaAtividade: string
  }
}
```

## 🔍 Busca e Filtros

### GET /api/sindicatos/search
**Descrição**: Buscar sindicatos com filtros avançados

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q?`: string (termo de busca)
- `estado?`: string
- `cidade?`: string
- `ativo?`: boolean
- `dataInicio?`: string (ISO date)
- `dataFim?`: string (ISO date)
- `page?`: number
- `limit?`: number

**Response Success (200)**:
```typescript
{
  success: true
  data: {
    sindicatos: Sindicato[]
    pagination: PaginationInfo
    filters: {
      estados: string[]
      cidades: string[]
    }
  }
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
| 404 | Sindicato não encontrado |
| 409 | CNPJ já cadastrado |
| 500 | Erro interno do servidor |

## 🧪 Exemplos de Uso

### Listar sindicatos
```bash
curl -X GET "https://fenafar-nextjs.vercel.app/api/sindicatos?page=1&limit=10&search=farmacêuticos" \
  -H "Authorization: Bearer <token>"
```

### Criar sindicato
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/sindicatos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Sindicato dos Farmacêuticos de SP",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@sindicatosp.com",
    "cidade": "São Paulo",
    "estado": "SP",
    "adminEmail": "admin@sindicatosp.com",
    "adminName": "João Silva",
    "adminPassword": "senha123"
  }'
```

### Obter estatísticas
```bash
curl -X GET https://fenafar-nextjs.vercel.app/api/sindicatos/stats \
  -H "Authorization: Bearer <token>"
```
