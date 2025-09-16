"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Building2, 
  FileText, 
  Mail
} from "lucide-react"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

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

  const navigationItems = [
    { name: 'Sindicatos', href: '/sindicatos', icon: Building2, count: '0' },
    { name: 'Membros', href: '/membros', icon: Users, count: '0' },
    { name: 'Documentos', href: '/documentos', icon: FileText, count: '0' },
    { name: 'Convites', href: '/convites', icon: Mail, count: '0' },
  ]

  return (
    <div className="p-6">
      {/* Welcome Banner */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Bem-vindo ao Sistema FENAFAR
        </h2>
        <p className="text-blue-700">
          Painel administrativo para gerenciamento de sindicatos e membros da FENAFAR.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            Ações mais comuns do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/convites')}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Convidar Sindicato
            </Button>
            <Button 
              onClick={() => router.push('/sindicatos')}
              variant="outline"
              className="w-full"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Ver Sindicatos
            </Button>
            <Button 
              onClick={() => router.push('/membros')}
              variant="outline"
              className="w-full"
            >
              <Users className="mr-2 h-4 w-4" />
              Ver Membros
            </Button>
            <Button 
              onClick={() => router.push('/documentos')}
              variant="outline"
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Documentos
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
                <strong>Role:</strong> 
                <span className="ml-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {user.user_metadata?.role || 'MEMBER'}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>ID:</strong> 
                <span className="ml-1 text-xs font-mono text-gray-600">
                  {user.id}
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
  )
}