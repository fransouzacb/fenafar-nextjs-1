"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { success, error: showError, warning } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          warning("Email não confirmado", "Por favor, verifique seu email e clique no link de confirmação.")
        } else {
          showError("Erro no login", error.message)
        }
        return
      }

      if (data.user && data.session) {
        // Salvar dados no localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('access_token', data.session.access_token)
        
        // Salvar token no cookie para middleware
        document.cookie = `access_token=${data.session.access_token}; path=/; secure; samesite=strict`
        
        // Disparar evento para atualizar outros componentes
        window.dispatchEvent(new CustomEvent('auth-change'))
        
        success("Login realizado com sucesso!", "Bem-vindo ao sistema FENAFAR.")
        
        // Redirecionar baseado no role do usuário
        const role = data.user.user_metadata?.role || 'MEMBER'
        switch (role) {
          case 'FENAFAR_ADMIN':
            router.push("/admin")
            break
          case 'SINDICATO_ADMIN':
            router.push("/sindicato/dashboard")
            break
          case 'MEMBER':
            router.push("/perfil")
            break
          default:
            router.push("/perfil")
        }
      }
    } catch {
      showError("Erro inesperado", "Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sistema FENAFAR
        </CardTitle>
        <CardDescription className="text-center">
          Faça login em sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a
            href="/recuperar-senha"
            className="text-blue-600 hover:text-blue-500"
          >
            Esqueceu sua senha?
          </a>
        </div>
        <div className="mt-2 text-center text-sm">
          <span className="text-gray-600">Não tem uma conta? </span>
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
