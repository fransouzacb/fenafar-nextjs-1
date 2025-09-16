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

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirect') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(formData)
      toast.success('Login realizado com sucesso!')
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectTo)
      }
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Credenciais de teste:
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p><strong>Admin FENAFAR:</strong> admin@fenafar.com.br / admin123</p>
            <p><strong>Admin Sindicato:</strong> sindicato1@teste.com / sindicato123</p>
            <p><strong>Membro:</strong> membro1@teste.com / membro123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
