"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileText, 
  Mail,
  Settings,
  LogOut,
  Building2,
  Upload,
  Activity,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from "lucide-react"

interface SindicatoStats {
  sindicatoName: string
  totalDocumentos: number
  documentosRecentes: number
  totalMembros: number
  membrosAtivos: number
  convitesPendentes: number
}

export default function SindicatoPage() {
  const { user, loading, isAdmin: isFenafarAdmin, isSindicatoAdmin, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<SindicatoStats>({
    sindicatoName: 'Carregando...',
    totalDocumentos: 0,
    documentosRecentes: 0,
    totalMembros: 0,
    membrosAtivos: 0,
    convitesPendentes: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && isFenafarAdmin()) {
      router.push("/admin")
    }
  }, [user, loading, isFenafarAdmin, router])

  // Carregar estatísticas do sindicato (dados estáticos por enquanto)
  useEffect(() => {
    async function loadSindicatoStats() {
      if (!user) return
      
      setLoadingStats(true)
      
      // Simular dados do sindicato
      setTimeout(() => {
        setStats({
          sindicatoName: 'Sindicato dos Farmacêuticos SP',
          totalDocumentos: 12,
          documentosRecentes: 3,
          totalMembros: 45,
          membrosAtivos: 42,
          convitesPendentes: 2,
        })
        setLoadingStats(false)
      }, 800)
      
      // TODO: Implementar chamada real quando corrigir problemas de autenticação
      /*
      try {
        const response = await fetch('/api/sindicatos/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas do sindicato:', error)
      } finally {
        setLoadingStats(false)
      }
      */
    }
    
    loadSindicatoStats()
  }, [user])

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

  const isSindicatoAdminUser = isSindicatoAdmin()

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {loadingStats ? 'Carregando...' : stats.sindicatoName}
              </h1>
              <p className="text-green-100">
                {isSindicatoAdminUser ? 'Painel de Administração' : 'Área do Membro'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Bem-vindo,</p>
              <p className="text-xl font-semibold">
                {user.user_metadata?.name || user.email}
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
                <p className="text-sm font-medium text-gray-600">Documentos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalDocumentos}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {loadingStats ? '...' : stats.documentosRecentes} novos
                  </span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {isSindicatoAdminUser && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Membros</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loadingStats ? '...' : stats.totalMembros}
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
        )}

        {isSindicatoAdminUser && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Convites</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loadingStats ? '...' : stats.convitesPendentes}
                  </p>
                  <div className="flex items-center mt-2">
                    <Mail className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">Pendentes</span>
                  </div>
                </div>
                <Mail className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-bold text-gray-900">Sistema</p>
                <div className="flex items-center mt-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance e Estatísticas */}
      {isSindicatoAdminUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Atividade do Sindicato
              </CardTitle>
              <CardDescription>Métricas de engajamento e participação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Membros Ativos</span>
                  <span className="text-sm text-gray-600">
                    {loadingStats ? '...' : `${stats.membrosAtivos}/${stats.totalMembros}`}
                  </span>
                </div>
                <Progress 
                  value={loadingStats ? 0 : (stats.totalMembros > 0 ? (stats.membrosAtivos / stats.totalMembros) * 100 : 0)} 
                  className="h-2" 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Documentos Recentes</span>
                  <span className="text-sm text-gray-600">
                    {loadingStats ? '...' : `${stats.documentosRecentes}/${stats.totalDocumentos}`}
                  </span>
                </div>
                <Progress 
                  value={loadingStats ? 0 : (stats.totalDocumentos > 0 ? (stats.documentosRecentes / stats.totalDocumentos) * 100 : 0)} 
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
              {!loadingStats && stats.convitesPendentes > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Convites pendentes</span>
                  </div>
                  <Badge variant="secondary">{stats.convitesPendentes}</Badge>
                </div>
              )}
              
              {!loadingStats && stats.documentosRecentes === 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Fazer upload de documentos</span>
                  </div>
                  <Badge variant="secondary">Sugestão</Badge>
                </div>
              )}
              
              {(!loadingStats && stats.convitesPendentes === 0 && stats.documentosRecentes > 0) && (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tudo em ordem!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ações Rápidas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            {isSindicatoAdminUser ? 'Funcionalidades de administração' : 'Ações disponíveis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/sindicato/documentos')}
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Ver Documentos</div>
                <div className="text-xs opacity-80">CCT, ACT e outros</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => router.push('/sindicato/documentos')}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              <Upload className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Upload Documento</div>
                <div className="text-xs opacity-60">Novo documento</div>
              </div>
            </Button>
            
            {isSindicatoAdminUser && (
              <>
                <Button 
                  onClick={() => router.push('/sindicato/membros')}
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col gap-2"
                >
                  <Users className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Membros</div>
                    <div className="text-xs opacity-60">Gerenciar membros</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => router.push('/sindicato/convites')}
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col gap-2"
                >
                  <Mail className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Convites</div>
                    <div className="text-xs opacity-60">Convidar membros</div>
                  </div>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações da Sessão */}
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
                <span className="text-sm font-medium text-gray-600">Tipo:</span>
                <Badge variant={isSindicatoAdminUser ? "default" : "secondary"}>
                  {isSindicatoAdminUser ? 'Admin do Sindicato' : 'Membro'}
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
              <Building2 className="w-5 h-5" />
              Sindicato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Nome:</span>
                <span className="text-sm">{loadingStats ? 'Carregando...' : stats.sindicatoName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Ativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Última atualização:</span>
                <span className="text-sm">Hoje</span>
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