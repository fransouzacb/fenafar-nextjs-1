'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Mail, CheckCircle2, XCircle, Clock, Loader2, AlertCircle, Trash2, Search, Filter } from 'lucide-react'

interface Convite {
  id: string
  email: string
  role: string
  createdAt: string
  expiresAt: string
  acceptedAt?: string
  status: 'pendente' | 'aceito' | 'expirado'
  criadoPor: {
    id: string
    name: string
    email: string
  }
}

interface ConvitesStats {
  total: number
  pendentes: number
  aceitos: number
  expirados: number
}

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'aceito':
      return <CheckCircle2 className="h-4 w-4" />
    case 'expirado':
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'aceito':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'expirado':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
}

export default function ConvitesPage() {
  const [convites, setConvites] = useState<Convite[]>([])
  const [stats, setStats] = useState<ConvitesStats>({ total: 0, pendentes: 0, aceitos: 0, expirados: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  const [formData, setFormData] = useState({
    email: '',
    nomeResponsavel: '',
    nomeSindicato: '',
    cnpjSindicato: '',
    cidadeSindicato: '',
    estadoSindicato: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Função para mostrar notificações
  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    const toastEl = document.createElement('div')
    toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`
    toastEl.innerHTML = `
      <div class="font-medium">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `
    document.body.appendChild(toastEl)
    
    setTimeout(() => {
      document.body.removeChild(toastEl)
    }, 5000)
  }

  // Carregar convites
  const loadConvites = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('access_token')
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter && statusFilter !== 'todos') params.append('status', statusFilter)
      
      const response = await fetch(`/api/convites?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setConvites(result.data.convites)
        
        // Calcular estatísticas
        const newStats = result.data.convites.reduce((acc: ConvitesStats, convite: Convite) => {
          acc.total++
          switch (convite.status) {
            case 'aceito':
              acc.aceitos++
              break
            case 'expirado':
              acc.expirados++
              break
            default:
              acc.pendentes++
          }
          return acc
        }, { total: 0, pendentes: 0, aceitos: 0, expirados: 0 })
        
        setStats(newStats)
      } else {
        throw new Error(result.error || 'Erro ao carregar convites')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMsg)
      showToast('Erro', errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar convites quando o componente monta ou filtros mudam
  useEffect(() => {
    loadConvites()
  }, [searchTerm, statusFilter])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.email) errors.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido'
    
    if (!formData.nomeResponsavel) errors.nomeResponsavel = 'Nome é obrigatório'
    if (!formData.nomeSindicato) errors.nomeSindicato = 'Nome do sindicato é obrigatório'
    if (!formData.cnpjSindicato) errors.cnpjSindicato = 'CNPJ é obrigatório'
    if (!formData.cidadeSindicato) errors.cidadeSindicato = 'Cidade é obrigatória'
    if (!formData.estadoSindicato) errors.estadoSindicato = 'Estado é obrigatório'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast('Erro de validação', 'Por favor, corrija os erros no formulário', 'error')
      return
    }

    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/convites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        showToast('Sucesso!', result.message || 'Convite enviado com sucesso')
        
        // Resetar formulário
        setFormData({
          email: '',
          nomeResponsavel: '',
          nomeSindicato: '',
          cnpjSindicato: '',
          cidadeSindicato: '',
          estadoSindicato: '',
        })
        setFormErrors({})
        setIsDialogOpen(false)
        
        // Recarregar lista
        await loadConvites()
        
        if (!result.data.email.sent) {
          showToast('Atenção', 'Convite criado, mas houve problema no envio do email', 'error')
        }
      } else {
        throw new Error(result.error || 'Erro ao enviar convite')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      showToast('Erro', errorMsg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
          <p className="text-muted-foreground">
            Gerencie convites para novos sindicatos
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Novo Convite
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="aceito">Aceitos</SelectItem>
            <SelectItem value="expirado">Expirados</SelectItem>
          </SelectContent>
        </Select>
        
        {(searchTerm || (statusFilter && statusFilter !== 'todos')) && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('todos')
            }}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Convites
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aceitos
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aceitos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expirados
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expirados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convites */}
      <Card>
        <CardHeader>
          <CardTitle>Convites Enviados</CardTitle>
          <CardDescription>
            Acompanhe o status dos convites enviados para novos sindicatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando convites...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-sm font-semibold text-red-800">Erro ao carregar</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <div className="mt-6">
                <Button onClick={loadConvites} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : convites.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum convite encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || statusFilter 
                  ? "Nenhum convite encontrado com os filtros aplicados."
                  : "Comece enviando um convite para um novo sindicato."
                }
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Convite
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {convites.map((convite) => (
                <div key={convite.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{convite.email}</h4>
                      <p className="text-sm text-muted-foreground">
                        {convite.role} • Criado por {convite.criadoPor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Email: {convite.criadoPor.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-muted-foreground">
                        <div>Enviado: {formatDate(convite.createdAt)}</div>
                        <div>Expira: {formatDate(convite.expiresAt)}</div>
                        {convite.acceptedAt && <div>Aceito: {formatDate(convite.acceptedAt)}</div>}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${getStatusColor(convite.status)}`}
                      >
                        {getStatusIcon(convite.status)}
                        {convite.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para novo convite */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border-2">
          <DialogHeader>
            <DialogTitle>Novo Convite</DialogTitle>
            <DialogDescription>
              Preencha os dados para enviar um convite para um novo sindicato.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
                <Input
                  id="nomeResponsavel"
                  value={formData.nomeResponsavel}
                  onChange={(e) => handleChange('nomeResponsavel', e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email do Responsável</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@sindicato.com.br"
                  className={formErrors.email ? 'border-red-500' : ''}
                  required
                />
                {formErrors.email && (
                  <p className="text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomeSindicato">Nome do Sindicato</Label>
                <Input
                  id="nomeSindicato"
                  value={formData.nomeSindicato}
                  onChange={(e) => handleChange('nomeSindicato', e.target.value)}
                  placeholder="Sindicato dos Farmacêuticos de..."
                  className={formErrors.nomeSindicato ? 'border-red-500' : ''}
                  required
                />
                {formErrors.nomeSindicato && (
                  <p className="text-sm text-red-600">{formErrors.nomeSindicato}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpjSindicato">CNPJ</Label>
                <Input
                  id="cnpjSindicato"
                  value={formData.cnpjSindicato}
                  onChange={(e) => handleChange('cnpjSindicato', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className={formErrors.cnpjSindicato ? 'border-red-500' : ''}
                  required
                />
                {formErrors.cnpjSindicato && (
                  <p className="text-sm text-red-600">{formErrors.cnpjSindicato}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidadeSindicato">Cidade</Label>
                  <Input
                    id="cidadeSindicato"
                    value={formData.cidadeSindicato}
                    onChange={(e) => handleChange('cidadeSindicato', e.target.value)}
                    placeholder="São Paulo"
                    className={formErrors.cidadeSindicato ? 'border-red-500' : ''}
                    required
                  />
                  {formErrors.cidadeSindicato && (
                    <p className="text-sm text-red-600">{formErrors.cidadeSindicato}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoSindicato">Estado</Label>
                  <Select value={formData.estadoSindicato} onValueChange={(value) => handleChange('estadoSindicato', value)}>
                    <SelectTrigger className={formErrors.estadoSindicato ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BRASIL.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.estadoSindicato && (
                    <p className="text-sm text-red-600">{formErrors.estadoSindicato}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Convite'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}