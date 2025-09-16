'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Mail, CheckCircle2, XCircle, Clock } from 'lucide-react'

// Mock data temporário
const convitesData = [
  {
    id: '1',
    nomeResponsavel: 'João Silva',
    emailResponsavel: 'joao@sindicatofarmaceuticos.com.br',
    nomeSindicato: 'Sindicato dos Farmacêuticos de São Paulo',
    cnpj: '12.345.678/0001-00',
    status: 'PENDENTE' as const,
    criadoEm: '2024-01-15T10:30:00Z',
    vence: '2024-01-22T10:30:00Z'
  },
  {
    id: '2',
    nomeResponsavel: 'Maria Santos',
    emailResponsavel: 'maria@sindicatofarmarj.com.br',
    nomeSindicato: 'Sindicato dos Farmacêuticos do Rio de Janeiro',
    cnpj: '98.765.432/0001-00',
    status: 'ACEITO' as const,
    criadoEm: '2024-01-10T14:20:00Z',
    vence: '2024-01-17T14:20:00Z'
  },
  {
    id: '3',
    nomeResponsavel: 'Carlos Oliveira',
    emailResponsavel: 'carlos@sindicatomg.com.br',
    nomeSindicato: 'Sindicato dos Farmacêuticos de Minas Gerais',
    cnpj: '11.222.333/0001-44',
    status: 'EXPIRADO' as const,
    criadoEm: '2024-01-01T09:00:00Z',
    vence: '2024-01-08T09:00:00Z'
  }
]

const stats = {
  total: 15,
  pendentes: 8,
  aceitos: 5,
  expirados: 2
}

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
    case 'ACEITO':
      return <CheckCircle2 className="h-4 w-4" />
    case 'EXPIRADO':
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ACEITO':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'EXPIRADO':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
}

export default function ConvitesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    emailResponsavel: '',
    nomeSindicato: '',
    cnpj: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Enviando convite:', formData)
    
    // Simular requisição
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Convite enviado com sucesso!')
    setIsDialogOpen(false)
    setFormData({
      nomeResponsavel: '',
      emailResponsavel: '',
      nomeSindicato: '',
      cnpj: ''
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          {convitesData.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum convite encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece enviando um convite para um novo sindicato.
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
              {convitesData.map((convite) => (
                <div key={convite.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{convite.nomeSindicato}</h4>
                      <p className="text-sm text-muted-foreground">
                        {convite.nomeResponsavel} • {convite.emailResponsavel}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CNPJ: {convite.cnpj}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-muted-foreground">
                        <div>Enviado: {formatDate(convite.criadoEm)}</div>
                        <div>Expira: {formatDate(convite.vence)}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${getStatusColor(convite.status)}`}
                      >
                        {getStatusIcon(convite.status)}
                        {convite.status}
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
                <Label htmlFor="emailResponsavel">Email do Responsável</Label>
                <Input
                  id="emailResponsavel"
                  type="email"
                  value={formData.emailResponsavel}
                  onChange={(e) => handleChange('emailResponsavel', e.target.value)}
                  placeholder="email@sindicato.com.br"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomeSindicato">Nome do Sindicato</Label>
                <Input
                  id="nomeSindicato"
                  value={formData.nomeSindicato}
                  onChange={(e) => handleChange('nomeSindicato', e.target.value)}
                  placeholder="Sindicato dos Farmacêuticos de..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Enviar Convite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}