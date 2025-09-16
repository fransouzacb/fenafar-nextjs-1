"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  Mail, 
  Plus,
  Building2
} from "lucide-react"

interface SindicatoDashboardProps {
  sindicato?: {
    name: string
    cnpj: string
    city: string
    state: string
  }
  stats?: {
    totalMembros: number
    totalDocumentos: number
    totalConvites: number
  }
}

export function SindicatoDashboard({ sindicato, stats }: SindicatoDashboardProps) {
  const defaultStats = {
    totalMembros: 0,
    totalDocumentos: 0,
    totalConvites: 0,
  }

  const currentStats = stats || defaultStats

  const quickActions = [
    {
      title: "Novo Membro",
      description: "Adicionar membro ao sindicato",
      href: "/sindicato/membros/novo",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Enviar Convite",
      description: "Convidar nova pessoa",
      href: "/sindicato/convites/novo",
      icon: Mail,
      color: "bg-purple-500"
    },
    {
      title: "Upload Documento",
      description: "Enviar documento",
      href: "/sindicato/documentos/upload",
      icon: FileText,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Sindicato</h1>
          <p className="text-gray-600">
            {sindicato?.name || "Sindicato"} - {sindicato?.city}, {sindicato?.state}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ação
        </Button>
      </div>

      {/* Sindicato Info */}
      {sindicato && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Informações do Sindicato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-lg">{sindicato.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CNPJ</p>
                <p className="text-lg">{sindicato.cnpj}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cidade</p>
                <p className="text-lg">{sindicato.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <p className="text-lg">{sindicato.state}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalMembros}</div>
            <p className="text-xs text-muted-foreground">
              Membros ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalDocumentos}</div>
            <p className="text-xs text-muted-foreground">
              Documentos enviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalConvites}</div>
            <p className="text-xs text-muted-foreground">
              Convites pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimas ações realizadas no sindicato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Novo membro adicionado</p>
                <p className="text-xs text-gray-500">Carlos Oliveira</p>
              </div>
              <span className="text-xs text-gray-500">1 hora atrás</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Documento enviado</p>
                <p className="text-xs text-gray-500">Estatuto do Sindicato</p>
              </div>
              <span className="text-xs text-gray-500">3 horas atrás</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Convite enviado</p>
                <p className="text-xs text-gray-500">convidado@exemplo.com</p>
              </div>
              <span className="text-xs text-gray-500">5 horas atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
