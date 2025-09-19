'use client'

import { useEffect, useState } from 'react'
import { useAuthSimple } from '@/hooks/use-auth-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  Send,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { ConviteForm } from '@/components/forms/convite-form'
import { Tooltip } from '@/components/ui/tooltip'

interface Convite {
  id: string
  email: string
  role: 'SINDICATO_ADMIN' | 'MEMBER'
  token: string
  usado: boolean
  expiresAt: string
  maxMembers?: number | null
  createdAt: string
  updatedAt: string
  sindicatoId?: string
  criadoPorId: string
  sindicato?: {
    id: string
    name: string
    cnpj: string
  }
  criadoPor: {
    id: string
    name: string
    email: string
  }
}

interface Sindicato {
  id: string
  name: string
  cnpj: string
}

export default function ConvitesPage() {
  const { user, isLoading: authLoading } = useAuthSimple()
  const [convites, setConvites] = useState<Convite[]>([])
  const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingConvite, setEditingConvite] = useState<Convite | null>(null)
  const [viewingConvite, setViewingConvite] = useState<Convite | null>(null)
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean
    type: 'delete' | 'resend' | null
    convite: Convite | null
  }>({
    open: false,
    type: null,
    convite: null
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      loadConvites()
      loadSindicatos()
    }
  }, [user, authLoading])

  const loadConvites = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/convites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar convites')
      }

      const data = await response.json()
      setConvites(data)
    } catch (error) {
      console.error('Erro ao carregar convites:', error)
      toast.error('Erro ao carregar convites')
    } finally {
      setIsLoading(false)
    }
  }

  const loadSindicatos = async () => {
    try {
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
      setSindicatos(data)
    } catch (error) {
      console.error('Erro ao carregar sindicatos:', error)
    }
  }

  const openConfirmationDialog = (type: 'delete' | 'resend', convite: Convite) => {
    setConfirmationDialog({
      open: true,
      type,
      convite
    })
  }

  const closeConfirmationDialog = () => {
    setConfirmationDialog({
      open: false,
      type: null,
      convite: null
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmationDialog.convite || !confirmationDialog.type) return

    setIsProcessing(true)
    const { convite, type } = confirmationDialog

    try {
      const token = localStorage.getItem('access_token')
      let response: Response
      let successMessage: string

      switch (type) {
        case 'delete':
          response = await fetch(`/api/convites/${convite.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          successMessage = 'Convite excluído com sucesso!'
          break

        case 'resend':
          response = await fetch('/api/convites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: convite.email,
              role: convite.role,
              sindicatoId: convite.sindicatoId,
              maxMembers: convite.maxMembers
            })
          })
          successMessage = 'Convite reenviado com sucesso!'
          break

        default:
          throw new Error('Ação inválida')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro na operação')
      }

      toast.success(successMessage)
      loadConvites()
      closeConfirmationDialog()
    } catch (error: any) {
      console.error(`Erro ao ${type} convite:`, error)
      toast.error(error.message || `Erro ao ${type} convite`)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusInfo = (convite: Convite) => {
    const now = new Date()
    const expiresAt = new Date(convite.expiresAt)

    if (convite.usado) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: 'Usado'
      }
    }

    if (expiresAt < now) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: 'Expirado'
      }
    }

    return {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      text: 'Pendente'
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'SINDICATO_ADMIN':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Admin Sindicato'
        }
      case 'MEMBER':
        return {
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          text: 'Membro'
        }
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: role
        }
    }
  }

  const filteredConvites = convites.filter(convite =>
    convite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convite.sindicato?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convite.role.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Convites</h1>
          <p className="text-gray-600">Gerencie os convites enviados para novos usuários</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="fenafar-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Convite
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por email, sindicato ou role..."
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
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Convites</p>
                <p className="text-2xl font-bold text-gray-900">{convites.length}</p>
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
                  {convites.filter(c => !c.usado && new Date(c.expiresAt) > new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {convites.filter(c => c.usado).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expirados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {convites.filter(c => !c.usado && new Date(c.expiresAt) < new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Convites List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredConvites.map((convite) => {
            const statusInfo = getStatusInfo(convite)
            const roleInfo = getRoleInfo(convite.role)
            
            return (
              <Card key={convite.id} className="fenafar-card hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{convite.email}</CardTitle>
                        <CardDescription className="text-sm text-gray-500 truncate">
                          {convite.sindicato?.name || 'Sem sindicato'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                      <Badge 
                        variant="outline" 
                        className={`${roleInfo.bgColor} ${roleInfo.color} border-0 text-xs`}
                      >
                        {roleInfo.text}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs`}
                      >
                        <statusInfo.icon className="h-3 w-3 mr-1" />
                        {statusInfo.text}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {convite.sindicato && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{convite.sindicato.name} ({convite.sindicato.cnpj})</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Expira em {formatDate(convite.expiresAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Criado por {convite.criadoPor.name}</span>
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  {convite.maxMembers && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserPlus className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Limite: {convite.maxMembers} membros</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200">
                    {/* Grid de botões centralizados */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Visualizar */}
                      <Tooltip content="Visualizar detalhes" side="top">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingConvite(convite)}
                          className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>

                      {/* Editar */}
                      <Tooltip content="Editar convite" side="top">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingConvite(convite)}
                          disabled={convite.usado}
                          className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>

                      {/* Reenviar/Excluir baseado no status */}
                      {!convite.usado && new Date(convite.expiresAt) >= new Date() ? (
                        /* Reenviar */
                        <Tooltip content="Reenviar convite" side="top">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationDialog('resend', convite)}
                            className="w-full h-10 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center justify-center p-0"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      ) : (
                        /* Excluir */
                        <Tooltip content="Excluir convite" side="top">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationDialog('delete', convite)}
                            disabled={convite.usado}
                            className="w-full h-10 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    Criado em {formatDate(convite.createdAt)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredConvites.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum convite encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro convite'}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Convite
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulários */}
      {showCreateForm && (
        <ConviteForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            loadConvites()
            setShowCreateForm(false)
          }}
        />
      )}

      {editingConvite && (
        <ConviteForm
          convite={editingConvite}
          onClose={() => setEditingConvite(null)}
          onSuccess={() => {
            loadConvites()
            setEditingConvite(null)
          }}
        />
      )}

      {/* Modal de Visualização */}
      {viewingConvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Detalhes do Convite</CardTitle>
                    <CardDescription>Informações completas do convite</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewingConvite(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{viewingConvite.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Função</Label>
                  <p className="text-sm">{viewingConvite.role === 'SINDICATO_ADMIN' ? 'Administrador de Sindicato' : 'Membro'}</p>
                </div>
                {viewingConvite.sindicato && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Sindicato</Label>
                    <p className="text-sm">{viewingConvite.sindicato.name} ({viewingConvite.sindicato.cnpj})</p>
                  </div>
                )}
                {viewingConvite.maxMembers && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Limite de Membros</Label>
                    <p className="text-sm">{viewingConvite.maxMembers}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Token</Label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{viewingConvite.token}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Expira em</Label>
                  <p className="text-sm">{formatDate(viewingConvite.expiresAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <p className="text-sm">{viewingConvite.usado ? 'Usado' : 'Pendente'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Criado por</Label>
                  <p className="text-sm">{viewingConvite.criadoPor.name} ({viewingConvite.criadoPor.email})</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog de Confirmação */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={closeConfirmationDialog}
        onConfirm={handleConfirmAction}
        title={confirmationDialog.type === 'delete' ? 'Excluir Convite' : 'Reenviar Convite'}
        description={
          confirmationDialog.type === 'delete' 
            ? `Tem certeza que deseja excluir o convite para "${confirmationDialog.convite?.email}"? Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja reenviar o convite para "${confirmationDialog.convite?.email}"? Um novo token será gerado.`
        }
        variant={confirmationDialog.type === 'delete' ? 'danger' : 'default'}
        isLoading={isProcessing}
      />
    </div>
  )
}

