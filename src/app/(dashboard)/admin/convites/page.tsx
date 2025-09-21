'use client'

import { useEffect, useState } from 'react'
import { useAuthSimple } from '@/hooks/use-auth-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Eye,
  Send
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { ConviteForm } from '@/components/forms/convite-form'

interface Convite {
  id: string
  email: string
  role: 'SINDICATO_ADMIN' | 'MEMBER'
  token: string
  usado: boolean
  expiresAt: string
  createdAt: string
  updatedAt: string
  sindicatoId?: string
  criadoPorId: string
  maxMembers?: number | null
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
  email: string
}

export default function ConvitesPage() {
  // const { user } = useAuthSimple()
  const [convites, setConvites] = useState<Convite[]>([])
  // const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingConvite, setEditingConvite] = useState<Convite | null>(null)
  const [viewingConvite, setViewingConvite] = useState<Convite | null>(null)
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean
    type: 'delete' | 'resend' | null
    convite: Convite | null
  }>({
    isOpen: false,
    type: null,
    convite: null
  })

  // Carregar convites
  const loadConvites = async () => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/convites', {
        credentials: 'include', // Usar cookies para autenticação
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar convites')
      }

      const data = await response.json()
      setConvites(data.convites || [])
    } catch (error) {
      console.error('Erro ao carregar convites:', error)
      toast.error('Erro ao carregar convites')
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar sindicatos
  const loadSindicatos = async () => {
    try {
      const response = await fetch('/api/sindicatos', {
        credentials: 'include', // Usar cookies para autenticação
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // setSindicatos(data.sindicatos || [])
      }
    } catch (error) {
      console.error('Erro ao carregar sindicatos:', error)
    }
  }

  useEffect(() => {
    loadConvites()
    loadSindicatos()
  }, [])

  // Filtrar convites
  const filteredConvites = convites.filter(convite =>
    convite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convite.sindicato?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convite.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Funções de status
  const getStatusInfo = (convite: Convite) => {
    const now = new Date()
    const expiresAt = new Date(convite.expiresAt)

    if (convite.usado) {
      return {
        text: 'Aceito',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle
      }
    } else if (expiresAt <= now) {
      return {
        text: 'Expirado',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: XCircle
      }
    } else {
      return {
        text: 'Pendente',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: Clock
      }
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'SINDICATO_ADMIN':
        return {
          text: 'Admin Sindicato',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        }
      case 'MEMBER':
        return {
          text: 'Membro',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        }
      default:
        return {
          text: role,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        }
    }
  }

  // Abrir diálogo de confirmação
  const openConfirmationDialog = (type: 'delete' | 'resend', convite: Convite) => {
    console.log('🔧 Abrindo diálogo de confirmação:', { type, conviteId: convite.id })
    setConfirmationDialog({
      isOpen: true,
      type,
      convite
    })
  }

  // Confirmar ação
  const handleConfirmAction = async () => {
    if (!confirmationDialog.convite) return

    const { type, convite } = confirmationDialog

    try {
      let response: Response
      let successMessage: string

      switch (type) {
        case 'delete':
          response = await fetch(`/api/convites/${convite.id}`, {
            method: 'DELETE',
            credentials: 'include', // Usar cookies para autenticação
            headers: {
              'Content-Type': 'application/json'
            }
          })
          successMessage = 'Convite excluído com sucesso!'
          break

        case 'resend':
          // Reenviar e-mail do convite existente
          console.log('🔄 Reenviando convite:', convite)
          
          response = await fetch(`/api/convites/${convite.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          console.log('📧 Resposta do reenvio:', response.status, response.ok)
          
          if (response.ok) {
            const responseData = await response.json()
            console.log('✅ Dados da resposta:', responseData)
            toast.success('Convite reenviado com sucesso!')
          } else {
            const errorData = await response.json()
            console.error('❌ Erro no reenvio:', errorData)
            toast.error(errorData.error || 'Erro ao reenviar convite')
          }
          
          successMessage = 'Convite reenviado com sucesso!'
          break

        default:
          return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro na operação')
      }

      toast.success(successMessage)
      // Recarregar lista apenas para delete (reenvio não cria novo convite)
      if (confirmationDialog.type === 'delete') {
        await loadConvites()
      }
    } catch (error) {
      console.error('Erro na operação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro na operação')
    } finally {
      setConfirmationDialog({
        isOpen: false,
        type: null,
        convite: null
      })
    }
  }

  // Estatísticas
  const stats = {
    total: convites.length,
    pendentes: convites.filter(c => !c.usado && new Date(c.expiresAt) > new Date()).length,
    aceitos: convites.filter(c => c.usado).length,
    expirados: convites.filter(c => !c.usado && new Date(c.expiresAt) <= new Date()).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Convites</h1>
          <p className="text-gray-600">Gerencie os convites de sindicatos</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Convite
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Aceitos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aceitos}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Expirados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expirados}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por email, sindicato ou função..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Card key={convite.id} className="fenafar-card">
                <CardHeader className="pb-3">
                  {/* Primeira linha: Email e ícone */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{convite.email}</CardTitle>
                      </div>
                    </div>
                  </div>
                  
                  {/* Segunda linha: Sindicato */}
                  <div className="mb-2">
                    <CardDescription className="text-sm text-gray-500 truncate">
                      {convite.sindicato?.name || 'Sem sindicato'}
                    </CardDescription>
                  </div>
                  
                  {/* Terceira linha: Badges em linha horizontal */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${roleInfo.bgColor} ${roleInfo.color} border-0 text-xs px-2 py-1`}
                    >
                      {roleInfo.text}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs px-2 py-1`}
                    >
{(() => {
                        const StatusIcon = statusInfo.icon
                        return <StatusIcon className="h-3 w-3 mr-1" />
                      })()}
                      {statusInfo.text}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {convite.sindicato && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {convite.sindicato.name} ({convite.sindicato.cnpj})
                      </div>
                    )}
                    {convite.maxMembers && (
                      <div className="flex items-center text-sm text-gray-600">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Máximo {convite.maxMembers} membros
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Expira em {formatDate(convite.expiresAt)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      Criado por {convite.criadoPor.name}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200">
                    {/* Grid de botões centralizados */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Visualizar */}
                      <div className="relative group">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingConvite(convite)}
                          className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          Visualizar detalhes
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>

                      {/* Editar */}
                      <div className="relative group">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingConvite(convite)}
                          disabled={convite.usado}
                          className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          Editar convite
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>

                      {/* Reenviar */}
                      {(() => {
                        const isUsado = convite.usado
                        const isExpired = new Date(convite.expiresAt) < new Date()
                        const canResend = !isUsado && !isExpired
                        
                        console.log('Status do convite:', {
                          id: convite.id,
                          usado: isUsado,
                          expirado: isExpired,
                          podeReenviar: canResend,
                          expiresAt: convite.expiresAt
                        })
                        
                        return canResend
                      })() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            console.log('🟢 CLIQUE NO BOTÃO REENVIAR DETECTADO!', convite.id)
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Botão reenviar clicado para convite:', convite.id)
                            openConfirmationDialog('resend', convite)
                          }}
                          onMouseDown={(e) => {
                            console.log('🟢 MOUSE DOWN no botão reenviar')
                          }}
                          onMouseUp={(e) => {
                            console.log('🟢 MOUSE UP no botão reenviar')
                          }}
                          className="w-full h-10 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center justify-center p-2 cursor-pointer"
                          title="Reenviar convite"
                          style={{ pointerEvents: 'auto', zIndex: 10 }}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          <span className="text-xs">Reenviar</span>
                        </Button>
                      )}

                      {/* Excluir */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          console.log('🔴 CLIQUE NO BOTÃO EXCLUIR DETECTADO!', convite.id)
                          e.preventDefault()
                          e.stopPropagation()
                          openConfirmationDialog('delete', convite)
                        }}
                        onMouseDown={(e) => {
                          console.log('🔴 MOUSE DOWN no botão excluir')
                        }}
                        onMouseUp={(e) => {
                          console.log('🔴 MOUSE UP no botão excluir')
                        }}
                        disabled={convite.usado}
                        className="w-full h-10 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Excluir convite"
                        style={{ pointerEvents: 'auto', zIndex: 10 }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Excluir</span>
                      </Button>
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
            setShowCreateForm(false)
            loadConvites()
          }}
        />
      )}

      {editingConvite && (
        <ConviteForm
          convite={editingConvite}
          onClose={() => setEditingConvite(null)}
          onSuccess={() => {
            setEditingConvite(null)
            loadConvites()
          }}
        />
      )}

      {/* Modal de Visualização */}
      {viewingConvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detalhes do Convite</h2>
                <Button
                  variant="ghost"
                  onClick={() => setViewingConvite(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{viewingConvite.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Função</label>
                    <p className="text-sm text-gray-900">{getRoleInfo(viewingConvite.role).text}</p>
                  </div>
                </div>

                {viewingConvite.sindicato && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sindicato</label>
                    <p className="text-sm text-gray-900">
                      {viewingConvite.sindicato.name} ({viewingConvite.sindicato.cnpj})
                    </p>
                  </div>
                )}

                {viewingConvite.maxMembers && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Limite de Membros</label>
                    <p className="text-sm text-gray-900">{viewingConvite.maxMembers}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Token</label>
                    <p className="text-xs text-gray-900 font-mono break-all">{viewingConvite.token}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusInfo(viewingConvite).bgColor} ${getStatusInfo(viewingConvite).color} border-0`}
                      >
{(() => {
                          const StatusIcon = getStatusInfo(viewingConvite).icon
                          return <StatusIcon className="h-3 w-3 mr-1" />
                        })()}
                        {getStatusInfo(viewingConvite).text}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Criado em</label>
                    <p className="text-sm text-gray-900">{formatDate(viewingConvite.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expira em</label>
                    <p className="text-sm text-gray-900">{formatDate(viewingConvite.expiresAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Criado por</label>
                  <p className="text-sm text-gray-900">
                    {viewingConvite.criadoPor.name} ({viewingConvite.criadoPor.email})
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setViewingConvite(null)}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    setViewingConvite(null)
                    setEditingConvite(viewingConvite)
                  }}
                  disabled={viewingConvite.usado}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmationDialog
        open={confirmationDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmationDialog({
              isOpen: false,
              type: null,
              convite: null
            })
          }
        }}
        title={
          confirmationDialog.type === 'delete' 
            ? 'Excluir Convite' 
            : 'Reenviar Convite'
        }
        description={
          confirmationDialog.type === 'delete'
            ? 'Tem certeza que deseja excluir este convite? Esta ação não pode ser desfeita.'
            : 'Tem certeza que deseja reenviar este convite? Um novo convite será criado com os mesmos dados.'
        }
        confirmText={
          confirmationDialog.type === 'delete' 
            ? 'Excluir' 
            : 'Reenviar'
        }
        cancelText="Cancelar"
        variant={confirmationDialog.type === 'delete' ? 'danger' : 'default'}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}