# 📄 API Endpoints - Documentos

## Visão Geral

Endpoints para gerenciamento de documentos, incluindo upload, download, versionamento e controle de acesso.

## 📁 Documentos

### GET /api/documentos
**Descrição**: Listar documentos (acesso baseado em role)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `sindicatoId?`: string (filtrar por sindicato)
- `membroId?`: string (filtrar por membro)
- `tipo?`: 'CCT' | 'ACT' | 'AVATAR' | 'OUTRO' (filtrar por tipo)
- `page?`: number (página, default: 1)
- `limit?`: number (itens por página, default: 10)
- `search?`: string (busca por título)
- `ativo?`: boolean (filtrar por status)
- `sortBy?`: string (ordenar por: titulo, tipo, createdAt)
- `sortOrder?`: 'asc' | 'desc' (ordem, default: desc)

**Response Success (200)**:
```typescript
{
  success: true
  data: {
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
        updatedAt: string
        sindicato: {
          id: string
          nome: string
        }
        membro?: {
          id: string
          nome: string
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

### GET /api/documentos/[id]
**Descrição**: Obter documento específico

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do documento)

**Response Success (200)**:
```typescript
{
  success: true
  documento: {
    id: string
    titulo: string
    tipo: string
    arquivo: string
    tamanho?: number
    mimeType?: string
    versao: string
    ativo: boolean
    createdAt: string
    updatedAt: string
    sindicato: {
      id: string
      nome: string
      cnpj: string
    }
    membro?: {
      id: string
      nome: string
      cpf: string
    }
    downloadUrl: string // URL assinada para download
  }
}
```

### POST /api/documentos
**Descrição**: Upload de novo documento

**Headers**: `Authorization: Bearer <token>`

**Request Body** (multipart/form-data):
```typescript
{
  file: File
  titulo: string
  tipo: 'CCT' | 'ACT' | 'AVATAR' | 'OUTRO'
  sindicatoId: string
  membroId?: string // Opcional, para documentos pessoais
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
    tamanho: number
    mimeType: string
    versao: string
    ativo: boolean
    createdAt: string
  }
  message: "Documento enviado com sucesso"
}
```

### PUT /api/documentos/[id]
**Descrição**: Atualizar documento (metadados)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do documento)

**Request Body**:
```typescript
{
  titulo?: string
  ativo?: boolean
}
```

**Response Success (200)**:
```typescript
{
  success: true
  documento: {
    // Dados atualizados
  }
  message: "Documento atualizado com sucesso"
}
```

### DELETE /api/documentos/[id]
**Descrição**: Excluir documento

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do documento)

**Response Success (200)**:
```typescript
{
  success: true
  message: "Documento excluído com sucesso"
}
```

## 📤 Upload Específico

### POST /api/upload/avatar
**Descrição**: Upload de avatar (sindicato ou membro)

**Headers**: `Authorization: Bearer <token>`

**Request Body** (multipart/form-data):
```typescript
{
  file: File
  entityType: 'sindicato' | 'membro'
  entityId: string
}
```

**Response Success (201)**:
```typescript
{
  success: true
  url: string
  documento: {
    id: string
    titulo: string
    tipo: 'AVATAR'
    arquivo: string
  }
  message: "Avatar enviado com sucesso"
}
```

### POST /api/upload/documento
**Descrição**: Upload de documento oficial

**Headers**: `Authorization: Bearer <token>`

**Request Body** (multipart/form-data):
```typescript
{
  file: File
  titulo: string
  tipo: 'CCT' | 'ACT' | 'OUTRO'
  sindicatoId: string
  membroId?: string
}
```

**Response Success (201)**:
```typescript
{
  success: true
  url: string
  documento: {
    id: string
    titulo: string
    tipo: string
    arquivo: string
  }
  message: "Documento enviado com sucesso"
}
```

## 📥 Download

### GET /api/documentos/[id]/download
**Descrição**: Download de documento

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do documento)

**Response Success (200)**:
```typescript
// Retorna o arquivo diretamente
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="documento.pdf"
```

### GET /api/documentos/[id]/preview
**Descrição**: Preview de documento (imagens)

**Headers**: `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: string (ID do documento)

**Response Success (200)**:
```typescript
// Retorna a imagem para preview
Content-Type: image/jpeg
```

## 📊 Estatísticas

### GET /api/documentos/stats
**Descrição**: Obter estatísticas de documentos

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `sindicatoId?`: string (filtrar por sindicato)

**Response Success (200)**:
```typescript
{
  success: true
  stats: {
    total: number
    porTipo: [
      {
        tipo: string
        quantidade: number
      }
    ]
    tamanhoTotal: number
    porSindicato: [
      {
        sindicato: string
        quantidade: number
      }
    ]
    crescimento: {
      documentos: number // % de crescimento
    }
  }
}
```

## 🔍 Busca e Filtros

### GET /api/documentos/search
**Descrição**: Buscar documentos com filtros avançados

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q?`: string (termo de busca)
- `tipo?`: string
- `sindicatoId?`: string
- `membroId?`: string
- `dataInicio?`: string (ISO date)
- `dataFim?`: string (ISO date)
- `tamanhoMin?`: number (bytes)
- `tamanhoMax?`: number (bytes)
- `page?`: number
- `limit?`: number

**Response Success (200)**:
```typescript
{
  success: true
  data: {
    documentos: Documento[]
    pagination: PaginationInfo
    filters: {
      tipos: string[]
      sindicatos: string[]
    }
  }
}
```

## 🔒 Validações

### Tipos de Arquivo Permitidos
- **CCT/ACT**: PDF, DOC, DOCX
- **AVATAR**: JPG, JPEG, PNG, WEBP
- **OUTRO**: PDF, DOC, DOCX, JPG, JPEG, PNG

### Limites
- **Tamanho máximo**: 10MB por arquivo
- **Quantidade**: 100 documentos por sindicato
- **Rate limiting**: 10 uploads por minuto por usuário

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Documento não encontrado |
| 413 | Arquivo muito grande |
| 415 | Tipo de arquivo não suportado |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |

## 🧪 Exemplos de Uso

### Listar documentos
```bash
curl -X GET "https://fenafar-nextjs.vercel.app/api/documentos?tipo=CCT&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Upload de documento
```bash
curl -X POST https://fenafar-nextjs.vercel.app/api/documentos \
  -H "Authorization: Bearer <token>" \
  -F "file=@convencao.pdf" \
  -F "titulo=Convenção Coletiva 2024" \
  -F "tipo=CCT" \
  -F "sindicatoId=123"
```

### Download de documento
```bash
curl -X GET https://fenafar-nextjs.vercel.app/api/documentos/456/download \
  -H "Authorization: Bearer <token>" \
  -o "documento.pdf"
```
