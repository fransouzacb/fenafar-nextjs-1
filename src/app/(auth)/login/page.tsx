"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@fenafar.com.br")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { success, error: showError } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Login direto com fetch - SEM SUPABASE CLIENT
      const response = await fetch('https://dnjyilirfyfyqebodeue.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuanlpbGlyZnlmeXFlYm9kZXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Njk3MjcsImV4cCI6MjA3MzU0NTcyN30.WsFJ8319v8rDC0LUjHWNYgrU5bUEqHDp_F83mU0GwcI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorText = await response.text()
        showError("Erro no login", `Status: ${response.status} - ${errorText}`)
        return
      }

      const data = await response.json()
      
      if (data.user) {
        success("Login realizado com sucesso!", "Bem-vindo ao sistema FENAFAR.")
        
        // Salvar dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('access_token', data.access_token)
        
        // Definir cookie para o middleware
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`
        
        // Disparar evento customizado para atualizar o useAuth
        window.dispatchEvent(new CustomEvent('auth-change'))
        
        // Aguardar um pouco para o estado atualizar
        setTimeout(() => {
          // Redirecionar baseado no role do usuário
          const role = data.user.user_metadata?.role || 'MEMBER'
          if (role === 'FENAFAR_ADMIN') {
            router.push("/admin")
          } else {
            router.push("/sindicato")
          }
        }, 100)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro inesperado. Tente novamente."
      showError("Erro inesperado", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema FENAFAR</h1>
          <p className="mt-2 text-sm text-gray-600">
            Faça login em sua conta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}