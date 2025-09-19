'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface LoginFormProps {
  onSuccess?: () => void
}

const testCredentials = [
  {
    name: 'Admin FENAFAR',
    email: 'admin@fenafar.com.br',
    password: 'admin123',
    role: 'FENAFAR_ADMIN'
  },
  {
    name: 'Admin Sindicato',
    email: 'sindicato1@teste.com',
    password: 'sindicato123',
    role: 'SINDICATO_ADMIN'
  },
  {
    name: 'Membro',
    email: 'membro1@teste.com',
    password: 'membro123',
    role: 'MEMBER'
  }
]

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirect')

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'FENAFAR_ADMIN':
        return '/admin'
      case 'SINDICATO_ADMIN':
        return '/sindicato'
      case 'MEMBER':
        return '/sindicato' // Membros também vão para o painel do sindicato
      default:
        return '/admin'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await login(formData)
      toast.success('Login realizado com sucesso!')
      
      // Aguardar um pouco para garantir que o estado foi atualizado
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          // Redirecionar baseado na role do usuário
          const userRole = (result as any)?.user?.role || 'FENAFAR_ADMIN'
          const redirectPath = redirectTo || getRedirectPath(userRole)
          router.push(redirectPath)
        }
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
      toast.error('Erro ao fazer login')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const fillTestCredentials = (credential: typeof testCredentials[0]) => {
    setFormData({
      email: credential.email,
      password: credential.password
    })
    toast.info(`Credenciais de ${credential.name} preenchidas`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Digite suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full fenafar-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Credenciais de teste disponíveis:
            </p>
            <div className="space-y-2">
              {testCredentials.map((credential, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials(credential)}
                  className="w-full text-xs"
                >
                  {credential.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
