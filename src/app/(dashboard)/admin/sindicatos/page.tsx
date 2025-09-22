'use client'

import { useEffect, useState } from 'react'
import { useAuthSimple } from '@/hooks/use-auth-simple'
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
  AlertCircle,
  Eye,
  Lock,
  Unlock,
  User
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { SindicatoForm } from '@/components/forms/sindicato-form'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Tooltip } from '@/components/ui/tooltip'

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
  admin: {
    id: string
    name: string
    email: string
  }
}

export default function SindicatosPage() {
  const { user, isLoading: authLoading } = useAuthSimple()
  const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSindicato, setEditingSindicato] = useState<Sindicato | null>(null)
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean
    type: 'delete' | 'approve' | 'reject' | 'block' | 'unblock' | null
    sindicato: Sindicato | null
  }>({
    open: false,
    type: null,
    sindicato: null
  })
  const [viewingSindicato, setViewingSindicato] = useState<Sindicato | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      loadSindicatos()
    }
  }, [user, authLoading])

  const loadSindicatos = async () => {
    try {
      console.log('Carregando sindicatos...')
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/sindicatos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar sindicatos')
      }

      const data = await response.json()
      console.log('Sindicatos carregados:', data.length)
      setSindicatos(data)
    } catch (error) {
      console.error('Erro ao carregar sindicatos:', error)
      toast.error('Erro ao carregar sindicatos')
    } finally {
      setIsLoading(false)
    }
  }

  const openConfirmationDialog = (type: 'delete' | 'approve' | 'reject' | 'block' | 'unblock', sindicato: Sindicato) => {
    setConfirmationDialog({
      open: true,
      type,
      sindicato
    })
  }

  const closeConfirmationDialog = () => {
    setConfirmationDialog({
      open: false,
      type: null,
      sindicato: null
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmationDialog.sindicato || !confirmationDialog.type) return

    setIsProcessing(true)
    const { sindicato, type } = confirmationDialog

    try {
      let response: Response
      let successMessage: string

      switch (type) {
        case 'delete':
          response = await fetch(`/api/sindicatos/${sindicato.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
          successMessage = 'Sindicato excluído com sucesso!'
          break

        case 'approve':
          response = await fetch(`/api/sindicatos/${sindicato.id}/approve`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
          successMessage = 'Sindicato aprovado com sucesso!'
          break

        case 'reject':
          response = await fetch(`/api/sindicatos/${sindicato.id}/reject`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
          successMessage = 'Sindicato rejeitado com sucesso!'
          break

        case 'block':
          response = await fetch(`/api/sindicatos/${sindicato.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ active: false })
          })
          successMessage = 'Sindicato bloqueado com sucesso!'
          break

        case 'unblock':
          response = await fetch(`/api/sindicatos/${sindicato.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ active: true })
          })
          successMessage = 'Sindicato desbloqueado com sucesso!'
          break

        default:
          throw new Error('Ação inválida')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro na operação')
      }

      toast.success(successMessage)
      loadSindicatos()
      closeConfirmationDialog()
    } catch (error: any) {
      console.error(`Erro ao ${type} sindicato:`, error)
      toast.error(error.message || `Erro ao ${type} sindicato`)
    } finally {
      setIsProcessing(false)
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
                <p className="text-sm font-medium text-gray-500">Total de Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sindicatos.length}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredSindicatos.map((sindicato) => (
            <Card key={sindicato.id} className="fenafar-card hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{sindicato.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500 truncate">
                        CNPJ: {sindicato.cnpj}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    <Badge variant={sindicato.active ? "default" : "secondary"} className="text-xs">
                      {sindicato.active ? 'Ativo' : 'Bloqueado'}
                    </Badge>
                    {(() => {
                      const statusInfo = getStatusInfo(sindicato.status)
                      return (
                        <Badge 
                          variant="outline" 
                          className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs`}
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
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{sindicato.email}</span>
                    </div>
                  )}
                  {sindicato.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{sindicato.phone}</span>
                    </div>
                  )}
                  {sindicato.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{sindicato.city}, {sindicato.state}</span>
                    </div>
                  )}
                  {sindicato.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                      <a 
                        href={sindicato.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {sindicato.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Admin Info */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Admin: {sindicato.admin?.name || 'N/A'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200">
                  {/* Grid de botões centralizados */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Visualizar */}
                    <Tooltip content="Visualizar detalhes" side="top">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingSindicato(sindicato)}
                        className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Tooltip>

                    {/* Editar */}
                    <Tooltip content="Editar informações" side="top">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSindicato(sindicato)}
                        className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Tooltip>

                    {/* Bloquear/Desbloquear */}
                    <Tooltip content={sindicato.active ? "Bloquear acesso" : "Desbloquear acesso"} side="top">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConfirmationDialog(sindicato.active ? 'block' : 'unblock', sindicato)}
                        className={`w-full h-10 flex items-center justify-center p-0 ${sindicato.active 
                          ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {sindicato.active ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </Button>
                    </Tooltip>

                    {/* Aprovar/Rejeitar/Excluir baseado no status */}
                    {sindicato.status === 'PENDING' ? (
                      <>
                        {/* Aprovar */}
                        <Tooltip content="Aprovar sindicato" side="top">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationDialog('approve', sindicato)}
                            className="w-full h-10 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center justify-center p-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        
                        {/* Rejeitar */}
                        <Tooltip content="Rejeitar sindicato" side="top">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationDialog('reject', sindicato)}
                            className="w-full h-10 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center p-0"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </Tooltip>

                        {/* Espaço vazio para manter grid */}
                        <div></div>
                      </>
                    ) : (
                      /* Excluir */
                      <>
                        <Tooltip content="Excluir permanentemente" side="top">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationDialog('delete', sindicato)}
                            className="w-full h-10 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        
                        {/* Espaços vazios para manter grid */}
                        <div></div>
                        <div></div>
                      </>
                    )}
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

      {/* Dialog de Confirmação */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={closeConfirmationDialog}
        onConfirm={handleConfirmAction}
        title={
          confirmationDialog.type === 'delete' 
            ? 'Excluir Sindicato' 
            : confirmationDialog.type === 'approve'
            ? 'Aprovar Sindicato'
            : confirmationDialog.type === 'reject'
            ? 'Rejeitar Sindicato'
            : confirmationDialog.type === 'block'
            ? 'Bloquear Sindicato'
            : 'Desbloquear Sindicato'
        }
        description={
          confirmationDialog.type === 'delete'
            ? `Tem certeza que deseja excluir o sindicato "${confirmationDialog.sindicato?.name}"? Esta ação não pode ser desfeita.`
            : confirmationDialog.type === 'approve'
            ? `Tem certeza que deseja aprovar o sindicato "${confirmationDialog.sindicato?.name}"?`
            : confirmationDialog.type === 'reject'
            ? `Tem certeza que deseja rejeitar o sindicato "${confirmationDialog.sindicato?.name}"?`
            : confirmationDialog.type === 'block'
            ? `Tem certeza que deseja bloquear o sindicato "${confirmationDialog.sindicato?.name}"? O sindicato não poderá acessar o sistema.`
            : `Tem certeza que deseja desbloquear o sindicato "${confirmationDialog.sindicato?.name}"? O sindicato poderá acessar o sistema novamente.`
        }
        variant={
          confirmationDialog.type === 'delete' 
            ? 'danger' 
            : confirmationDialog.type === 'approve'
            ? 'success'
            : confirmationDialog.type === 'reject'
            ? 'danger'
            : confirmationDialog.type === 'block'
            ? 'danger'
            : 'success'
        }
        isLoading={isProcessing}
      />

      {/* Modal de Visualização */}
      {viewingSindicato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Sindicato</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingSindicato(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nome</label>
                        <p className="text-gray-900">{viewingSindicato.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">CNPJ</label>
                        <p className="text-gray-900">{viewingSindicato.cnpj}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{viewingSindicato.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Telefone</label>
                        <p className="text-gray-900">{viewingSindicato.phone || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Endereço</label>
                        <p className="text-gray-900">{viewingSindicato.address || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cidade/Estado</label>
                        <p className="text-gray-900">
                          {viewingSindicato.city && viewingSindicato.state 
                            ? `${viewingSindicato.city}, ${viewingSindicato.state}`
                            : 'Não informado'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">CEP</label>
                        <p className="text-gray-900">{viewingSindicato.zipCode || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <p className="text-gray-900">
                          {viewingSindicato.website ? (
                            <a 
                              href={viewingSindicato.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {viewingSindicato.website}
                            </a>
                          ) : (
                            'Não informado'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Administrador */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrador</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{viewingSindicato.admin?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{viewingSindicato.admin?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant={viewingSindicato.active ? "default" : "secondary"}>
                        {viewingSindicato.active ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const statusInfo = getStatusInfo(viewingSindicato.status)
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
                </div>

                {/* Descrição */}
                {viewingSindicato.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{viewingSindicato.description}</p>
                    </div>
                  </div>
                )}

                {/* Informações de Data */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Criado em</label>
                      <p className="text-gray-900">{formatDate(viewingSindicato.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Atualizado em</label>
                      <p className="text-gray-900">{formatDate(viewingSindicato.updatedAt)}</p>
                    </div>
                    {viewingSindicato.approvedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Aprovado em</label>
                        <p className="text-gray-900">{formatDate(viewingSindicato.approvedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setViewingSindicato(null)}
                >
                  Fechar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSindicato(viewingSindicato)
                    setViewingSindicato(null)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
