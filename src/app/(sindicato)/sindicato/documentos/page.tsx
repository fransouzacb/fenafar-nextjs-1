'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Download, 
  Trash2, 
  Search,
  Plus,
  Calendar,
  User
} from 'lucide-react'

interface Documento {
  id: string
  titulo: string
  tipo: string
  arquivo: string
  tamanho?: number
  mimeType?: string
  versao: string
  ativo: boolean
  createdAt: string
  sindicato: {
    id: string
    name: string
    cnpj: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface DocumentosResponse {
  documentos: Documento[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function DocumentosPage() {
  const { user } = useAuth()
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Estados para upload
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadType, setUploadType] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDocumentos()
  }, [pagination.page, searchTerm, filterType])

  const loadDocumentos = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterType && { tipo: filterType })
      })

      const response = await fetch(`/api/documentos?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar documentos')
      }

      const data: DocumentosResponse = await response.json()
      setDocumentos(data.documentos)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle || !uploadType) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('titulo', uploadTitle)
      formData.append('tipo', uploadType)
      if (uploadDescription) {
        formData.append('descricao', uploadDescription)
      }

      const response = await fetch('/api/documentos/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer upload')
      }

      // Reset form
      setUploadFile(null)
      setUploadTitle('')
      setUploadType('')
      setUploadDescription('')
      setUploadDialogOpen(false)

      // Recarregar lista
      await loadDocumentos()

      alert('Documento enviado com sucesso!')
    } catch (error: any) {
      console.error('Erro no upload:', error)
      alert(error.message || 'Erro ao fazer upload do documento')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (documento: Documento) => {
    try {
      const response = await fetch(`/api/documentos/${documento.id}/download`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar link de download')
      }

      const data = await response.json()
      
      // Abrir link de download em nova aba
      window.open(data.downloadUrl, '_blank')
    } catch (error: any) {
      console.error('Erro no download:', error)
      alert(error.message || 'Erro ao fazer download do documento')
    }
  }

  const handleDelete = async (documentoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return
    }

    try {
      const response = await fetch(`/api/documentos/${documentoId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir documento')
      }

      // Recarregar lista
      await loadDocumentos()
      alert('Documento excluído com sucesso!')
    } catch (error: any) {
      console.error('Erro ao excluir:', error)
      alert(error.message || 'Erro ao excluir documento')
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="h-5 w-5" />
    
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="h-5 w-5 text-blue-600" />
    if (mimeType.includes('image')) return <FileText className="h-5 w-5 text-green-600" />
    
    return <FileText className="h-5 w-5 text-gray-600" />
  }

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'ESTATUTO':
        return 'bg-blue-100 text-blue-800'
      case 'ATA':
        return 'bg-green-100 text-green-800'
      case 'BALANCO':
        return 'bg-yellow-100 text-yellow-800'
      case 'OUTRO':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && documentos.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Documentos do Sindicato
        </h1>
        <p className="text-gray-600">
          Gerencie e organize os documentos do sindicato
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="ESTATUTO">Estatuto</option>
            <option value="ATA">Ata</option>
            <option value="BALANCO">Balanço</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        {/* Upload Button */}
        {user?.role === 'SINDICATO_ADMIN' && (
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload de Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Arquivo *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Nome do documento"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <select
                    id="tipo"
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="ESTATUTO">Estatuto</option>
                    <option value="ATA">Ata</option>
                    <option value="BALANCO">Balanço</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Descrição opcional"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documentos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-gray-500 text-center">
                {user?.role === 'SINDICATO_ADMIN' 
                  ? 'Faça upload do primeiro documento para começar'
                  : 'Não há documentos disponíveis no momento'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          documentos.map((documento) => (
            <Card key={documento.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(documento.mimeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {documento.titulo}
                        </h3>
                        <Badge className={getTypeColor(documento.tipo)}>
                          {documento.tipo}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(documento.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {documento.user.name}
                        </span>
                        <span>
                          {formatFileSize(documento.tamanho)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(documento)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {user?.role === 'SINDICATO_ADMIN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(documento.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {pagination.page} de {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}