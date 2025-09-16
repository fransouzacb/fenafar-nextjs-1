"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  Mail,
  Settings,
  LogOut,
  Building2,
  Upload
} from "lucide-react"

export default function SindicatoPage() {
  const { user, loading, isAdmin: isFenafarAdmin, isSindicatoAdmin, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && isFenafarAdmin()) {
      router.push("/admin")
    }
  }, [user, loading, isFenafarAdmin, router])

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
  
  const navigationItems = [
    { name: 'Membros', href: '/sindicato/membros', icon: Users, count: '0', adminOnly: true },
    { name: 'Documentos', href: '/sindicato/documentos', icon: FileText, count: '0', adminOnly: false },
    { name: 'Convites', href: '/sindicato/convites', icon: Mail, count: '0', adminOnly: true },
  ].filter(item => !item.adminOnly || isSindicatoAdminUser)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <Building2 className="inline mr-3 h-8 w-8 text-blue-600" />
                Sistema FENAFAR
              </h1>
              <p className="text-sm text-gray-600">
                {isSindicatoAdminUser ? 'Painel do Sindicato' : 'Área do Membro'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user.user_metadata?.name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/sindicato/configuracoes')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Message */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Bem-vindo ao Sistema FENAFAR
            </h2>
            <p className="text-blue-700">
              {isSindicatoAdminUser 
                ? 'Gerencie os membros, documentos e convites do seu sindicato.'
                : 'Acesse documentos e informações do seu sindicato.'
              }
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {navigationItems.map((item) => (
              <Card key={item.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.count}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de {item.name.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                {isSindicatoAdminUser ? 'Ações de administração' : 'Ações disponíveis'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  onClick={() => router.push('/sindicato/documentos')}
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Documentos
                </Button>
                
                {isSindicatoAdminUser && (
                  <>
                    <Button 
                      onClick={() => router.push('/sindicato/membros')}
                      variant="outline"
                      className="w-full"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Gerenciar Membros
                    </Button>
                    <Button 
                      onClick={() => router.push('/sindicato/convites')}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Convites
                    </Button>
                  </>
                )}
                
                <Button 
                  onClick={() => router.push('/sindicato/documentos')}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documento
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm">
                    <strong>Nome:</strong> {user.user_metadata?.name || 'Não informado'}
                  </p>
                  <p className="text-sm">
                    <strong>Tipo de Usuário:</strong> 
                    <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {isSindicatoAdminUser ? 'Administrador do Sindicato' : 'Membro'}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Sindicato:</strong> 
                    <span className="ml-1 text-gray-600">
                      Aguardando configuração
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong>Última sessão:</strong> {new Date().toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}