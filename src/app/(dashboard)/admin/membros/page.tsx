'use client'

import { useEffect, useState } from 'react'
import { useAuthSimple } from '@/hooks/use-auth-simple'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building2, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface Membro {
  id: string
  nome: string
  cpf: string
  email: string
  telefone?: string
  cargo: string
  ativo: boolean
  createdAt: string
  updatedAt: string
  userId: string
  sindicatoId: string
  sindicato: {
    id: string
    name: string
    cnpj: string
  }
  user: {
    id: string
    email: string
    name?: string
    role: string
  }
}

export default function MembrosPage() {
  const { user, isLoading: authLoading } = useAuthSimple()
  const [membros, setMembros] = useState<Membro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user && !authLoading) {
      loadMembros()
    }
  }, [user, authLoading])

  const loadMembros = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/membros', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar membros')
      }

      const data = await response.json()
      setMembros(data)
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
      toast.error('Erro ao carregar membros')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMembros = membros.filter(membro =>
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membro.cpf.includes(searchTerm) ||
    membro.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membro.sindicato.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
          <p className="text-gray-600">Gerencie os membros dos sindicatos</p>
        </div>
        <Button className="fenafar-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, email ou sindicato..."
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
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Membros</p>
                <p className="text-2xl font-bold text-gray-900">{membros.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sindicatos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(membros.map(m => m.sindicatoId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {membros.filter(m => m.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {membros.filter(m => !m.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membros List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembros.map((membro) => (
            <Card key={membro.id} className="fenafar-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{membro.nome}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        CPF: {membro.cpf}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={membro.ativo ? "default" : "secondary"}>
                    {membro.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {membro.email}
                  </div>
                  {membro.telefone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {membro.telefone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    {membro.sindicato.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {membro.cargo}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-400">
                    Criado em {formatDate(membro.createdAt)}
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
          ))}
        </div>
      )}

      {filteredMembros.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Nenhum membro cadastrado ainda'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
