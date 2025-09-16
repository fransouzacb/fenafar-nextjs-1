'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { SindicatoForm } from '@/components/forms/sindicato-form'

interface Sindicato {
  id: string
  name: string
  cnpj: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email: string
  website?: string
  description?: string
  active: boolean
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedAt?: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
  _count: {
    membros: number
  }
}

export default function SindicatosPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSindicato, setEditingSindicato] = useState<Sindicato | null>(null)

  useEffect(() => {
    if (user && !authLoading) {
      loadSindicatos()
    }
  }, [user, authLoading])

  const loadSindicatos = async () => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }
      
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.log('Token não encontrado, aguardando autenticação...')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/sindicatos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar sindicatos')
      }

      const data = await response.json()
      setSindicatos(data)
    } catch (error) {
      console.error('Erro ao carregar sindicatos:', error)
      toast.error('Erro ao carregar sindicatos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sindicato?')) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(`/api/sindicatos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir sindicato')
      }

      toast.success('Sindicato excluído com sucesso!')
      loadSindicatos()
    } catch (error) {
      console.error('Erro ao excluir sindicato:', error)
      toast.error('Erro ao excluir sindicato')
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(`/api/sindicatos/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao aprovar sindicato')
      }

      toast.success('Sindicato aprovado com sucesso!')
      loadSindicatos()
    } catch (error) {
      console.error('Erro ao aprovar sindicato:', error)
      toast.error('Erro ao aprovar sindicato')
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Tem certeza que deseja rejeitar este sindicato?')) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(`/api/sindicatos/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao rejeitar sindicato')
      }

      toast.success('Sindicato rejeitado com sucesso!')
      loadSindicatos()
    } catch (error) {
      console.error('Erro ao rejeitar sindicato:', error)
      toast.error('Erro ao rejeitar sindicato')
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Aprovado'
        }
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Rejeitado'
        }
      case 'PENDING':
      default:
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: 'Pendente'
        }
    }
  }

  const filteredSindicatos = sindicatos.filter(sindicato =>
    sindicato.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sindicato.cnpj.includes(searchTerm) ||
    sindicato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sindicato.city?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Sindicatos</h1>
          <p className="text-gray-600">Gerencie os sindicatos cadastrados no sistema</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="fenafar-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Sindicato
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CNPJ, email ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Sindicatos</p>
                <p className="text-2xl font-bold text-gray-900">{sindicatos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sindicatos.filter(s => s.status === 'APPROVED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sindicatos.filter(s => s.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Membros</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sindicatos.reduce((acc, s) => acc + s._count.membros, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sindicatos List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSindicatos.map((sindicato) => (
            <Card key={sindicato.id} className="fenafar-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{sindicato.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        CNPJ: {sindicato.cnpj}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={sindicato.active ? "default" : "secondary"}>
                      {sindicato.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {(() => {
                      const statusInfo = getStatusInfo(sindicato.status)
                      return (
                        <Badge 
                          variant="outline" 
                          className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}
                        >
                          <statusInfo.icon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {sindicato.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {sindicato.email}
                    </div>
                  )}
                  {sindicato.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {sindicato.phone}
                    </div>
                  )}
                  {sindicato.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {sindicato.city}, {sindicato.state}
                    </div>
                  )}
                  {sindicato.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <a 
                        href={sindicato.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {sindicato.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {sindicato._count.membros} membros
                  </div>
                  <div className="flex space-x-2">
                    {sindicato.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(sindicato.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(sindicato.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSindicato(sindicato)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sindicato.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Criado em {formatDate(sindicato.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredSindicatos.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum sindicato encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro sindicato'}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Sindicato
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulários */}
      {showCreateForm && (
        <SindicatoForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            loadSindicatos()
            setShowCreateForm(false)
          }}
        />
      )}

      {editingSindicato && (
        <SindicatoForm
          sindicato={editingSindicato}
          onClose={() => setEditingSindicato(null)}
          onSuccess={() => {
            loadSindicatos()
            setEditingSindicato(null)
          }}
        />
      )}
    </div>
  )
}
