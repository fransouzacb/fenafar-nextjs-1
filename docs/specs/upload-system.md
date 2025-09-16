# 📤 Sistema de Uploads

## Visão Geral

Sistema robusto de upload de arquivos utilizando Supabase Storage, com validações de segurança, otimização de imagens e controle de acesso baseado em roles.

## 🏗️ Arquitetura

### Fluxo de Upload
```
1. Usuário seleciona arquivo
2. Frontend valida tipo/tamanho
3. API gera URL assinada
4. Upload direto para Supabase Storage
5. URL salva no banco de dados
6. Notificação de sucesso/erro
```

### Componentes Principais
- **Supabase Storage**: Armazenamento de arquivos
- **API Routes**: Validação e geração de URLs
- **Frontend**: Interface de upload
- **Prisma**: Controle de metadados

## 📁 Estrutura de Storage

### Buckets
```
supabase-storage/
├── avatars/                    # Fotos de perfil
│   ├── sindicatos/            # Avatares de sindicatos
│   └── membros/               # Avatares de membros
├── documentos/                # Documentos oficiais
│   ├── cct/                   # Convenções Coletivas
│   ├── act/                   # Acordos Coletivos
│   └── outros/                # Outros documentos
└── temporarios/               # Arquivos temporários
```

### Convenção de Nomenclatura
```
{type}/{entity_id}/{timestamp}_{filename}
Exemplos:
- avatars/sindicatos/123_20241215_logo.png
- documentos/cct/456_20241215_convencao.pdf
- avatars/membros/789_20241215_foto.jpg
```

## 🔧 Implementação Técnica

### 1. Configuração Supabase Storage

```typescript
// src/lib/supabase-storage.ts
import { supabase } from './supabase'

export class StorageService {
  private static instance: StorageService
  private supabase = supabase

  static getInstance() {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: {
      cacheControl?: string
      contentType?: string
    }
  ) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        contentType: options?.contentType || file.type,
        upsert: false
      })

    if (error) throw error
    return data
  }

  async getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }
}
```

### 2. Validações de Arquivo

```typescript
// src/lib/validations.ts
export interface FileValidation {
  maxSize: number // em bytes
  allowedTypes: string[]
  allowedExtensions: string[]
}

export const FILE_VALIDATIONS: Record<string, FileValidation> = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
  },
  documento: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png']
  }
}

export function validateFile(file: File, type: keyof typeof FILE_VALIDATIONS): {
  valid: boolean
  error?: string
} {
  const validation = FILE_VALIDATIONS[type]
  
  // Verificar tamanho
  if (file.size > validation.maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${validation.maxSize / 1024 / 1024}MB`
    }
  }

  // Verificar tipo MIME
  if (!validation.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Permitidos: ${validation.allowedTypes.join(', ')}`
    }
  }

  // Verificar extensão
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!validation.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Extensão não permitida. Permitidas: ${validation.allowedExtensions.join(', ')}`
    }
  }

  return { valid: true }
}
```

### 3. API Route para Upload

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { StorageService } from '@/lib/supabase-storage'
import { validateFile } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const entityId = formData.get('entityId') as string
    const userId = formData.get('userId') as string

    if (!file || !type || !entityId || !userId) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Validar arquivo
    const validation = validateFile(file, type as any)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Gerar nome único
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `${entityId}_${timestamp}.${extension}`
    
    // Determinar bucket e caminho
    const bucket = type === 'avatar' ? 'avatars' : 'documentos'
    const path = `${type}/${fileName}`

    // Upload para Supabase Storage
    const storage = StorageService.getInstance()
    await storage.uploadFile(bucket, path, file)

    // Obter URL pública
    const publicUrl = await storage.getPublicUrl(bucket, path)

    // Salvar no banco de dados
    const documento = await prisma.documento.create({
      data: {
        titulo: file.name,
        tipo: type.toUpperCase() as any,
        arquivo: publicUrl,
        tamanho: file.size,
        mimeType: file.type,
        sindicatoId: entityId,
        membroId: type === 'avatar' ? entityId : null
      }
    })

    return NextResponse.json({
      success: true,
      url: publicUrl,
      documento
    })

  } catch (error: any) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### 4. Componente de Upload

```typescript
// src/components/forms/upload-form.tsx
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { validateFile } from '@/lib/validations'

interface UploadFormProps {
  type: 'avatar' | 'documento'
  entityId: string
  userId: string
  onSuccess: (url: string) => void
  onError: (error: string) => void
}

export function UploadForm({ type, entityId, userId, onSuccess, onError }: UploadFormProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    // Validar arquivo
    const validation = validateFile(file, type)
    if (!validation.valid) {
      onError(validation.error!)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('entityId', entityId)
      formData.append('userId', userId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        onSuccess(data.url)
      } else {
        onError(data.error)
      }
    } catch (error: any) {
      onError('Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        accept={type === 'avatar' ? 'image/*' : '.pdf,.jpg,.jpeg,.png'}
      />
      
      <div className="space-y-4">
        <div className="text-4xl">📁</div>
        <div>
          <p className="text-lg font-medium">
            {type === 'avatar' ? 'Upload de Avatar' : 'Upload de Documento'}
          </p>
          <p className="text-sm text-gray-500">
            Arraste e solte ou clique para selecionar
          </p>
        </div>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
        >
          {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
        </Button>
      </div>
    </div>
  )
}
```

## 🔒 Segurança

### Validações
- **Tipo de arquivo**: Apenas tipos permitidos
- **Tamanho**: Limite por tipo de arquivo
- **Extensão**: Validação de extensão
- **Conteúdo**: Verificação de tipo MIME

### Controle de Acesso
- **Autenticação**: Usuário deve estar logado
- **Autorização**: Verificação de role
- **Entity ID**: Apenas arquivos da própria entidade
- **Rate Limiting**: Limite de uploads por usuário

### Sanitização
- **Nome do arquivo**: Remoção de caracteres especiais
- **Path**: Prevenção de path traversal
- **Conteúdo**: Verificação de tipo real do arquivo

## 📊 Monitoramento

### Métricas
- **Uploads**: Sucesso/falha por hora
- **Tamanho**: Distribuição de tamanhos
- **Tipos**: Distribuição de tipos de arquivo
- **Performance**: Tempo de upload

### Alertas
- **Muitas falhas**: Possível problema
- **Arquivos grandes**: Possível abuso
- **Tipos suspeitos**: Possível malware
- **Latência alta**: Problema de performance

## 🧪 Testes

### Cenários de Teste
1. **Upload válido**: Arquivo dentro dos limites
2. **Upload inválido**: Arquivo fora dos limites
3. **Arquivo grande**: Teste de limite de tamanho
4. **Tipo incorreto**: Teste de validação de tipo
5. **Sem permissão**: Teste de autorização
6. **Rede lenta**: Teste de timeout

### Validações
- **Frontend**: Validação de formulário
- **Backend**: Validação de arquivo
- **Storage**: Verificação de upload
- **Banco**: Verificação de salvamento
