# 👥 API Endpoints - Membros

## Visão Geral

Endpoints para gerenciamento de membros dos sindicatos, incluindo CRUD completo e operações específicas.

## 👤 Membros

### GET /api/membros
**Descrição**: Listar membros (FENAFAR_ADMIN: todos, SINDICATO_ADMIN: do seu sindicato)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `sindicatoId?`: string (filtrar por sindicato - apenas FENAFAR_ADMIN)
- `page?`: number (página, default: 1)
- `limit?`: number (itens por página, default: 10)
- `search?`: string (busca por nome/CPF/email)
- `ativo?`: boolean (filtrar por status)
- `cargo?`: string (filtrar por cargo)
- `sortBy?`: string (ordenar por: nome, cpf, createdAt)
- `sortOrder?`: 'asc' | 'desc' (ordem, default: asc)

**Response Success (200)**:
```typescript
{
  success: true
  data: {
    membros: [
      {
        id: string
        nome: string
        cpf: string
        email: string
        telefone?: string
        cargo?: string
        ativo: boolean
        createdAt: string
        updatedAt: string
        sindicato: {
          id: string
          nome: string
          cnpj: string
        }
        user: {
          id: string
          email: string
          role: string
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

### GET /api/membros/[id]
**Descrição**: Obter membro específico

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do membro)

**Response Success (200)**:
```typescript
{
  success: true
  membro: {
    id: string
    nome: string
    cpf: string
    email: string
    telefone?: string
    cargo?: string
    ativo: boolean
    createdAt: string
    updatedAt: string
    sindicato: {
      id: string
      nome: string
      cnpj: string
      cidade: string
      estado: string
    }
    user: {
      id: string
      email: string
      name: string
      role: string
    }
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

### POST /api/membros
**Descrição**: Criar novo membro (SINDICATO_ADMIN: no seu sindicato, FENAFAR_ADMIN: em qualquer sindicato)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  nome: string
  cpf: string
  email: string
  telefone?: string
  cargo?: string
  sindicatoId: string // Apenas FENAFAR_ADMIN
  password: string
}
```

**Response Success (201)**:
```typescript
{
  success: true
  membro: {
    id: string
    nome: string
    cpf: string
    email: string
    // ... outros campos
  }
  user: {
    id: string
    email: string
    role: 'MEMBER'
  }
  message: "Membro criado com sucesso"
}
```

### PUT /api/membros/[id]
**Descrição**: Atualizar membro

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do membro)

**Request Body**:
```typescript
{
  nome?: string
  telefone?: string
  cargo?: string
  ativo?: boolean
}
```

**Response Success (200)**:
```typescript
{
  success: true
  membro: {
    // Dados atualizados
  }
  message: "Membro atualizado com sucesso"
}
```

### DELETE /api/membros/[id]
**Descrição**: Excluir membro (SINDICATO_ADMIN: do seu sindicato, FENAFAR_ADMIN: qualquer)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do membro)

**Response Success (200)**:
```typescript
{
  success: true
  message: "Membro excluído com sucesso"
}
```

## 📊 Estatísticas

### GET /api/membros/stats
**Descrição**: Obter estatísticas dos membros

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `sindicatoId?`: string (filtrar por sindicato - apenas FENAFAR_ADMIN)

**Response Success (200)**:
```typescript
{
  success: true
  stats: {
    total: number
    ativos: number
    inativos: number
    porCargo: [
      {
        cargo: string
        quantidade: number
      }
    ]
    porSindicato: [
      {
        sindicato: string
        quantidade: number
      }
    ]
    crescimento: {
      membros: number // % de crescimento
    }
  }
}
```

### GET /api/sindicatos/[id]/membros/stats
**Descrição**: Obter estatísticas de membros de um sindicato específico

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
    }
    membros: {
      total: number
      ativos: number
      inativos: number
    }
    porCargo: [
      {
        cargo: string
        quantidade: number
      }
    ]
    ultimaAtividade: string
  }
}
```

## 🔍 Busca e Filtros

### GET /api/membros/search
**Descrição**: Buscar membros com filtros avançados

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q?`: string (termo de busca)
- `sindicatoId?`: string
- `cargo?`: string
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
    membros: Membro[]
    pagination: PaginationInfo
    filters: {
      cargos: string[]
      sindicatos: string[]
    }
  }
}
```

## 📄 Documentos do Membro

### GET /api/membros/[id]/documentos
**Descrição**: Listar documentos de um membro

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do membro)

**Response Success (200)**:
```typescript
{
  success: true
  documentos: [
    {
      id: string
      titulo: string
      tipo: string
      arquivo: string
      tamanho?: number
      mimeType?: string
      versao: string
      ativo: boolean
      createdAt: string
    }
  ]
}
```

### POST /api/membros/[id]/documentos
**Descrição**: Upload de documento para um membro

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do membro)

**Request Body** (multipart/form-data):
```typescript
{
  file: File
  titulo: string
  tipo: 'AVATAR' | 'OUTRO'
}
```

**Response Success (201)**:
```typescript
{
  success: true
  documento: {
    id: string
    titulo: string
    tipo: string
    arquivo: string
    // ... outros campos
  }
  message: "Documento enviado com sucesso"
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
| 404 | Membro não encontrado |
| 409 | CPF já cadastrado |
| 500 | Erro interno do servidor |

## 🧪 Exemplos de Uso

### Listar membros
```bash
curl -X GET "https://fenafar-nextjs.vercel.app/api/membros?sindicatoId=123&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Criar membro
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/membros \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "cpf": "123.456.789-00",
    "email": "maria@email.com",
    "cargo": "Farmacêutica",
    "password": "senha123"
  }'
```

### Upload de documento
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/membros/123/documentos \
  -H "Authorization: Bearer <token>" \
  -F "file=@documento.pdf" \
  -F "titulo=Diploma de Farmácia" \
  -F "tipo=OUTRO"
```
