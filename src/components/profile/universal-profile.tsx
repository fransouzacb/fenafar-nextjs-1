'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Building2, Calendar, Edit, Upload, Lock, Camera, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface UniversalProfileProps {
  userRole: 'FENAFAR_ADMIN' | 'SINDICATO_ADMIN' | 'MEMBER'
}

export function UniversalProfile({ userRole }: UniversalProfileProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cargo: user?.cargo || '',
    cpf: user?.cpf || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil')
      }

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
    }
  }

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('As senhas não coincidem')
        return
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha')
      }

      toast.success('Senha alterada com sucesso!')
      setIsChangingPassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar senha')
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploadingAvatar(true)
      
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload do avatar')
      }

      toast.success('Avatar atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload do avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        handleAvatarUpload(file)
      } else {
        toast.error('Por favor, selecione apenas arquivos de imagem')
      }
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'FENAFAR_ADMIN':
        return 'Admin FENAFAR'
      case 'SINDICATO_ADMIN':
        return 'Admin Sindicato'
      case 'MEMBER':
        return 'Membro'
      default:
        return 'Usuário'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile}>
                Salvar Alterações
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar e Informações Básicas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {user.name ? (
                    <span className="text-2xl font-semibold text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Clique ou arraste uma imagem aqui
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG ou WEBP (máx. 5MB)
                </p>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleAvatarUpload(file)
                  }}
                />
              </div>

              {/* Status da Conta */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Tipo de Usuário</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={user.active ? "default" : "destructive"}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Detalhadas */}
        <div className="lg:col-span-2 space-y-6">
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
                  <Label htmlFor="name">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{user.name || 'Não informado'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {user.phone || 'Não informado'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  {isEditing ? (
                    <Input
                      id="cargo"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{user.cargo || 'Não informado'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  {isEditing ? (
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{user.cpf || 'Não informado'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Email Confirmado</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.emailConfirmed ? "default" : "destructive"}>
                      {user.emailConfirmed ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sindicato (se aplicável) */}
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
                    <Label className="text-sm font-medium text-gray-500">Nome do Sindicato</Label>
                    <p className="text-sm text-gray-900">{user.sindicato.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">CNPJ</Label>
                    <p className="text-sm text-gray-900">{user.sindicato.cnpj}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Troca de Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              )}
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

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Membro desde</Label>
                  <p className="text-sm text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Não informado'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Última atualização</Label>
                  <p className="text-sm text-gray-900">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'Não informado'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
