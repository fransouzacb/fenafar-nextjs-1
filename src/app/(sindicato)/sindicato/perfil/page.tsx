'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, Building2, Calendar, Edit, FileText } from 'lucide-react'

export default function PerfilPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Suas informações básicas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-sm text-gray-900">{user.name || 'Não informado'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user.phone || 'Não informado'}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Cargo</label>
              <p className="text-sm text-gray-900">{user.cargo || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sindicato */}
      {user.sindicato && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Sindicato
            </CardTitle>
            <CardDescription>
              Informações do seu sindicato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Nome do Sindicato</label>
                <p className="text-sm text-gray-900">{user.sindicato.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">CNPJ</label>
                <p className="text-sm text-gray-900">{user.sindicato.cnpj}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Status da Conta
          </CardTitle>
          <CardDescription>
            Informações sobre sua conta no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Tipo de Usuário</label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Membro</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="flex items-center gap-2">
                <Badge variant={user.active ? "default" : "destructive"}>
                  {user.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Email Confirmado</label>
              <div className="flex items-center gap-2">
                <Badge variant={user.emailConfirmed ? "default" : "destructive"}>
                  {user.emailConfirmed ? 'Confirmado' : 'Pendente'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Membro desde</label>
              <p className="text-sm text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Ações que você pode realizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Meus Documentos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Edit className="h-6 w-6" />
              <span>Editar Perfil</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
