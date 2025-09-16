'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  Users, 
  Building2, 
  FileText, 
  Mail, 
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalSindicatos: number
  totalDocumentos: number
  pendingInvites: number
  activeSindicatos: number
  activeMembers: number
  recentDocumentos: number
  totalMembers: number
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
      toast.error('Erro ao carregar estatísticas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fenafar-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-heading text-fenafar-primary">FENAFAR Admin</h1>
              <Badge variant="secondary" className="ml-3">
                {user?.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.name || user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-heading mb-2">Dashboard Administrativo</h2>
          <p className="text-caption">
            Visão geral do sistema FENAFAR
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.totalUsers || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Todos os usuários cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats?.activeMembers || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                de {formatNumber(stats?.totalMembers || 0)} membros totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sindicatos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.totalSindicatos || 0)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(stats?.activeSindicatos || 0)} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.totalDocumentos || 0)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(stats?.recentDocumentos || 0)} esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Convites Pendentes
              </CardTitle>
              <CardDescription>
                Convites aguardando resposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {formatNumber(stats?.pendingInvites || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Convites enviados que ainda não foram aceitos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Documentos criados nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(stats?.recentDocumentos || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Novos documentos desde {formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-subheading mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <Building2 className="h-6 w-6 mb-2" />
              Gerenciar Sindicatos
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              Gerenciar Membros
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Mail className="h-6 w-6 mb-2" />
              Enviar Convites
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
