"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function PrimeiroLoginPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const router = useRouter()
  const { success, error: showError } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  const handleResendEmail = async () => {
    if (!user?.email) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      })

      if (error) {
        showError("Erro ao reenviar email", error.message)
      } else {
        success("Email reenviado!", "Verifique sua caixa de entrada.")
      }
    } catch {
      showError("Erro inesperado", "Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (!user) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema FENAFAR</h1>
          <p className="mt-2 text-sm text-gray-600">
            Confirmação de email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Confirme seu email</CardTitle>
            <CardDescription>
              Quase lá! Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Enviamos um link de confirmação para:
              </p>
              <p className="font-medium text-gray-900 mt-1">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">
                Clique no link no email para confirmar sua conta e começar a usar o sistema.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleResendEmail}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? "Reenviando..." : "Reenviar email"}
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full"
              >
                Fazer logout
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Não recebeu o email? Verifique sua pasta de spam.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
