"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Building2, Shield } from "lucide-react"

export default function SindicatoPerfilPage() {
  const { user, loading, isSindicatoAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && !isSindicatoAdmin()) {
      router.push("/admin")
    }
  }, [user, loading, isSindicatoAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="mt-2 text-gray-600">
              Gerencie suas informações pessoais como administrador do sindicato
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar e informações básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                  Sua foto de perfil no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_metadata?.name || user.email}`} alt="Avatar" />
                  <AvatarFallback className="text-2xl">
                    {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Alterar Foto
                </Button>
              </CardContent>
            </Card>

            {/* Formulário de edição */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          defaultValue={user.user_metadata?.name || ''}
                          className="pl-10"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          defaultValue={user.email}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          className="pl-10"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Função</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="role"
                          value="Administrador do Sindicato"
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        className="pl-10"
                        placeholder="Rua, número, bairro"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      Cancelar
                    </Button>
                    <Button>
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Informações do sindicato */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações do Sindicato
                </CardTitle>
                <CardDescription>
                  Dados do sindicato que você administra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome do Sindicato</p>
                    <p className="text-lg">Sindicato dos Farmacêuticos de SP</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CNPJ</p>
                    <p className="text-lg">12.345.678/0001-90</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
                    <p className="text-lg">São Paulo, SP</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email de Contato</p>
                    <p className="text-lg">contato@sindicatosp.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do sistema */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
                <CardDescription>
                  Dados da sua conta no sistema FENAFAR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID do Usuário</p>
                    <p className="text-lg font-mono">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-lg">{user.user_metadata?.role || 'SINDICATO_ADMIN'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Confirmado</p>
                    <p className="text-lg">Sim</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                    <p className="text-lg">Hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
