"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { success, error: showError } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) {
        showError("Erro ao enviar email", error.message)
        return
      }

      setEmailSent(true)
      success("Email enviado com sucesso!", "Verifique sua caixa de entrada e siga as instruções.")
    } catch {
      showError("Erro inesperado", "Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sistema FENAFAR</h1>
            <p className="mt-2 text-sm text-gray-600">
              Recuperação de senha
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email enviado!</CardTitle>
              <CardDescription>
                Verifique sua caixa de entrada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Enviamos um link para redefinir sua senha para{" "}
                <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Clique no link no email para continuar com a redefinição.
              </p>
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Enviar novamente
                </Button>
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Voltar ao login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
            Recuperar senha
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recuperar senha</CardTitle>
            <CardDescription>
              Digite seu email para receber um link de redefinição
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Lembrou da senha?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
