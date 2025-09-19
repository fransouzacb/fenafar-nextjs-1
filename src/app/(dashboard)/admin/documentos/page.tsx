'use client'

import { useEffect, useState } from 'react'
import { useAuthSimple } from '@/hooks/use-auth-simple'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Building2, 
  User,
  Calendar,
  Download,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface Documento {
  id: string
  titulo: string
  tipo: 'CCT' | 'ACT' | 'AVATAR' | 'OUTRO'
  arquivo: string
  tamanho: number
  versao: string
  createdAt: string
  updatedAt: string
  sindicatoId: string
  membroId?: string
  sindicato: {
    id: string
    name: string
    cnpj: string
  }
  membro?: {
    id: string
    nome: string
    cargo: string
  }
}

export default function DocumentosPage() {
  const { user, isLoading: authLoading } = useAuthSimple()
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user && !authLoading) {
      loadDocumentos()
    }
  }, [user, authLoading])

  const loadDocumentos = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/documentos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar documentos')
      }

      const data = await response.json()
      setDocumentos(data)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
      toast.error('Erro ao carregar documentos')
    } finally {
      setIsLoading(false)
    }
  }

  const getTipoInfo = (tipo: string) => {
    switch (tipo) {
      case 'CCT':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'CCT'
        }
      case 'ACT':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'ACT'
        }
      case 'AVATAR':
        return {
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          text: 'Avatar'
        }
      case 'OUTRO':
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Outro'
        }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocumentos = documentos.filter(documento =>
    documento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    documento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    documento.sindicato.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando usuário...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Usuário não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600">Gerencie os documentos dos sindicatos</p>
        </div>
        <Button className="fenafar-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, tipo ou sindicato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Documentos</p>
                <p className="text-2xl font-bold text-gray-900">{documentos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">CCTs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documentos.filter(d => d.tipo === 'CCT').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ACTs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documentos.filter(d => d.tipo === 'ACT').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sindicatos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(documentos.map(d => d.sindicatoId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentos List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocumentos.map((documento) => {
            const tipoInfo = getTipoInfo(documento.tipo)
            
            return (
              <Card key={documento.id} className="fenafar-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{documento.titulo}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          v{documento.versao}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${tipoInfo.bgColor} ${tipoInfo.color} border-0`}
                    >
                      {tipoInfo.text}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      {documento.sindicato.name}
                    </div>
                    {documento.membro && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {documento.membro.nome} - {documento.membro.cargo}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-2" />
                      {formatFileSize(documento.tamanho)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Criado em {formatDate(documento.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredDocumentos.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Nenhum documento cadastrado ainda'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
