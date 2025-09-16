"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Building2, 
  FileText, 
  Mail, 
  Plus
} from "lucide-react"

interface AdminDashboardProps {
  stats?: {
    totalSindicatos: number
    totalMembros: number
    totalDocumentos: number
    totalConvites: number
  }
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const defaultStats = {
    totalSindicatos: 0,
    totalMembros: 0,
    totalDocumentos: 0,
    totalConvites: 0,
  }

  const currentStats = stats || defaultStats

  const quickActions = [
    {
      title: "Novo Sindicato",
      description: "Cadastrar novo sindicato",
      href: "/admin/sindicatos/novo",
      icon: Building2,
      color: "bg-blue-500"
    },
    {
      title: "Novo Membro",
      description: "Adicionar membro",
      href: "/admin/membros/novo",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Enviar Convite",
      description: "Convidar nova pessoa",
      href: "/admin/convites/novo",
      icon: Mail,
      color: "bg-purple-500"
    },
    {
      title: "Upload Documento",
      description: "Enviar documento",
      href: "/admin/documentos/upload",
      icon: FileText,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral do sistema FENAFAR</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sindicatos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalSindicatos}</div>
            <p className="text-xs text-muted-foreground">
              Sindicatos cadastrados
            </p>
          </CardContent>
        </Card>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Últimas ações realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Novo sindicato cadastrado</p>
                <p className="text-xs text-gray-500">Sindicato dos Farmacêuticos de São Paulo</p>
              </div>
              <span className="text-xs text-gray-500">2 horas atrás</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Membro adicionado</p>
                <p className="text-xs text-gray-500">Carlos Oliveira</p>
              </div>
              <span className="text-xs text-gray-500">4 horas atrás</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Convite enviado</p>
                <p className="text-xs text-gray-500">convidado@exemplo.com</p>
              </div>
              <span className="text-xs text-gray-500">6 horas atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
