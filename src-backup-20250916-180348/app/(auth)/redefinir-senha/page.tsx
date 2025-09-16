"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

function RedefinirSenhaContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const router = useRouter()
  const { success, error: showError } = useToast()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setValidSession(true)
      } else {
        showError("Sessão inválida", "O link de redefinição expirou ou é inválido.")
        router.push("/recuperar-senha")
      }
    }

    checkSession()
  }, [router, showError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validações
    if (password !== confirmPassword) {
      showError("Erro na validação", "As senhas não coincidem.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      showError("Erro na validação", "A senha deve ter pelo menos 6 caracteres.")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        showError("Erro ao redefinir senha", error.message)
        return
      }

      success("Senha redefinida com sucesso!", "Sua senha foi atualizada. Faça login com a nova senha.")

      // Fazer logout e redirecionar para login
      await supabase.auth.signOut()
      router.push("/login")
    } catch {
      showError("Erro inesperado", "Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sistema FENAFAR</h1>
            <p className="mt-2 text-sm text-gray-600">
              Verificando sessão...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema FENAFAR</h1>
          <p className="mt-2 text-sm text-gray-600">
            Redefinir senha
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova senha</CardTitle>
            <CardDescription>
              Digite sua nova senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sistema FENAFAR</h1>
            <p className="mt-2 text-sm text-gray-600">
              Carregando...
            </p>
          </div>
        </div>
      </div>
    }>
      <RedefinirSenhaContent />
    </Suspense>
  )
}
