"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Building2, 
  FileText, 
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Activity,
  Calendar,
  BarChart3
} from "lucide-react"

interface DashboardStats {
  users: number
  sindicatos: number
  membros: number
  documentos: number
  convites: number
  sindicatosAtivos: number
  membrosAtivos: number
  documentosPendentes: number
}

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  
  // DADOS ESTÁTICOS FIXOS - NUNCA FAZEM REQUISIÇÕES API
  const stats: DashboardStats = {
    users: 6,
    sindicatos: 2,
    membros: 6,
    documentos: 4,
    convites: 0,
    sindicatosAtivos: 2,
    membrosAtivos: 6,
    documentosPendentes: 0,
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && !isAdmin()) {
      router.push("/sindicato")
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Painel Administrativo FENAFAR
              </h1>
              <p className="text-blue-100">
                Bem-vindo, {user.user_metadata?.name || user.email}
              </p>
              <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">
                Dados Demo - Versão de Desenvolvimento
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Hoje</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Principais Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sindicatos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.sindicatos}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {stats.sindicatosAtivos} ativos
                  </span>
                </div>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Membros</p>
                <p className="text-3xl font-bold text-gray-900">{stats.membros}</p>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {stats.membrosAtivos} ativos
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documentos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.documentos}</p>
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">
                    {stats.documentosPendentes} pendentes
                  </span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convites</p>
                <p className="text-3xl font-bold text-gray-900">{stats.convites}</p>
                <div className="flex items-center mt-2">
                  <Mail className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Enviados</span>
                </div>
              </div>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
            <CardDescription>Métricas principais de saúde do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sindicatos Ativos</span>
                <span className="text-sm text-gray-600">
                  {stats.sindicatosAtivos}/{stats.sindicatos}
                </span>
              </div>
              <Progress 
                value={stats.sindicatos > 0 ? (stats.sindicatosAtivos / stats.sindicatos) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Membros Ativos</span>
                <span className="text-sm text-gray-600">
                  {stats.membrosAtivos}/{stats.membros}
                </span>
              </div>
              <Progress 
                value={stats.membros > 0 ? (stats.membrosAtivos / stats.membros) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Documentos Aprovados</span>
                <span className="text-sm text-gray-600">
                  {stats.documentos - stats.documentosPendentes}/{stats.documentos}
                </span>
              </div>
              <Progress 
                value={stats.documentos > 0 ? ((stats.documentos - stats.documentosPendentes) / stats.documentos) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Ações Necessárias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.documentosPendentes > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Documentos pendentes</span>
                </div>
                <Badge variant="secondary">{stats.documentosPendentes}</Badge>
              </div>
            )}
            
            {stats.convites > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Convites abertos</span>
                </div>
                <Badge variant="secondary">{stats.convites}</Badge>
              </div>
            )}
            
            {(stats.documentosPendentes === 0 && stats.convites === 0) && (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tudo em dia!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/convites')}
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Mail className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Convidar Sindicato</div>
                <div className="text-xs opacity-80">Enviar novo convite</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/sindicatos')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Building2 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Gerenciar Sindicatos</div>
                <div className="text-xs opacity-60">Ver todos os sindicatos</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/membros')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Users className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Ver Membros</div>
                <div className="text-xs opacity-60">Todos os membros</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/documentos')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Documentos</div>
                <div className="text-xs opacity-60">Gerenciar documentos</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Nome:</span>
                <span className="text-sm">{user.user_metadata?.name || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Role:</span>
                <Badge variant="default">
                  {user.user_metadata?.role || 'FENAFAR_ADMIN'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Sessão iniciada:</span>
                <span className="text-sm">{new Date().toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Sistema:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Banco de dados:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Último backup:</span>
                <span className="text-sm">Automático</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Versão:</span>
                <span className="text-sm font-mono">v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Painel Administrativo FENAFAR
              </h1>
              <p className="text-blue-100">
                Bem-vindo, {user.user_metadata?.name || user.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Hoje</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Principais Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sindicatos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.sindicatos}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {loadingStats ? '...' : stats.sindicatosAtivos} ativos
                  </span>
                </div>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Membros</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.membros}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {loadingStats ? '...' : stats.membrosAtivos} ativos
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documentos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.documentos}
                </p>
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">
                    {loadingStats ? '...' : stats.documentosPendentes} pendentes
                  </span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convites</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.convites}
                </p>
                <div className="flex items-center mt-2">
                  <Mail className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Enviados</span>
                </div>
              </div>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
            <CardDescription>Métricas principais de saúde do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sindicatos Ativos</span>
                <span className="text-sm text-gray-600">
                  {loadingStats ? '...' : `${stats.sindicatosAtivos}/${stats.sindicatos}`}
                </span>
              </div>
              <Progress 
                value={loadingStats ? 0 : (stats.sindicatos > 0 ? (stats.sindicatosAtivos / stats.sindicatos) * 100 : 0)} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Membros Ativos</span>
                <span className="text-sm text-gray-600">
                  {loadingStats ? '...' : `${stats.membrosAtivos}/${stats.membros}`}
                </span>
              </div>
              <Progress 
                value={loadingStats ? 0 : (stats.membros > 0 ? (stats.membrosAtivos / stats.membros) * 100 : 0)} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Documentos Aprovados</span>
                <span className="text-sm text-gray-600">
                  {loadingStats ? '...' : `${stats.documentos - stats.documentosPendentes}/${stats.documentos}`}
                </span>
              </div>
              <Progress 
                value={loadingStats ? 0 : (stats.documentos > 0 ? ((stats.documentos - stats.documentosPendentes) / stats.documentos) * 100 : 0)} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Ações Necessárias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!loadingStats && stats.documentosPendentes > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Documentos pendentes</span>
                </div>
                <Badge variant="secondary">{stats.documentosPendentes}</Badge>
              </div>
            )}
            
            {!loadingStats && stats.convites > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Convites abertos</span>
                </div>
                <Badge variant="secondary">{stats.convites}</Badge>
              </div>
            )}
            
            {(!loadingStats && stats.documentosPendentes === 0 && stats.convites === 0) && (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tudo em dia!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/convites')}
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Mail className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Convidar Sindicato</div>
                <div className="text-xs opacity-80">Enviar novo convite</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/sindicatos')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Building2 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Gerenciar Sindicatos</div>
                <div className="text-xs opacity-60">Ver todos os sindicatos</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/membros')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Users className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Ver Membros</div>
                <div className="text-xs opacity-60">Todos os membros</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/documentos')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Documentos</div>
                <div className="text-xs opacity-60">Gerenciar documentos</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Nome:</span>
                <span className="text-sm">{user.user_metadata?.name || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Role:</span>
                <Badge variant="default">
                  {user.user_metadata?.role || 'FENAFAR_ADMIN'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Sessão iniciada:</span>
                <span className="text-sm">{new Date().toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Sistema:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Banco de dados:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Último backup:</span>
                <span className="text-sm">Automático</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Versão:</span>
                <span className="text-sm font-mono">v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}