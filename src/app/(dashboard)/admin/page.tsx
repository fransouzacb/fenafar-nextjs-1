'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
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
  const { user, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Só carregar stats se o usuário estiver autenticado
    if (user && !authLoading) {
      loadStats()
    }
  }, [user, authLoading])

  const loadStats = async () => {
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do sistema FENAFAR</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Sistema Ativo
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.totalUsers || 0)}</div>
              <p className="text-xs text-muted-foreground">
                +{formatNumber(stats?.activeMembers || 0)} membros ativos
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
                +{formatNumber(stats?.recentDocumentos || 0)} esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.pendingInvites || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Membros Ativos
              </CardTitle>
              <CardDescription>
                Usuários com atividade recente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(stats?.activeMembers || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {((stats?.activeMembers || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Sindicatos Ativos
              </CardTitle>
              <CardDescription>
                Sindicatos com atividade recente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(stats?.activeSindicatos || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {((stats?.activeSindicatos || 0) / (stats?.totalSindicatos || 1) * 100).toFixed(1)}% do total
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
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
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
      </div>
    )
}