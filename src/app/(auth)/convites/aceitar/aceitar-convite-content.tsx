"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  nomeResponsavel: string
  emailResponsavel: string
  telefoneResponsavel: string
  senhaResponsavel: string
  confirmarSenha: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  observacoes: string
}

const mockConvite = {
  id: "1",
  sindicato: {
    nome: "Sindicato dos Farmacêuticos de São Paulo",
    cnpj: "12.345.678/0001-90",
    email: "contato@sindfarmasp.org.br"
  },
  token: "abc123",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
}

export function AceitarConviteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { success, error } = useToast()

  const [token] = useState(searchParams.get('token') || '')
  const [convite, setConvite] = useState(mockConvite)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    nomeResponsavel: '',
    emailResponsavel: '',
    telefoneResponsavel: '',
    senhaResponsavel: '',
    confirmarSenha: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.senhaResponsavel !== formData.confirmarSenha) {
      error("Erro", "As senhas não coincidem")
      return
    }

    setIsLoading(true)

    try {
      // Mock success - em produção faria POST para /api/convites/aceitar/${token}
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      success("Sucesso!", "Sindicato registrado com sucesso!")
      
      router.push('/login?message=registro-completo')
    } catch (err) {
      error("Erro", "Erro ao registrar sindicato")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Token Inválido ou Expirado
            </h1>
            <p className="text-gray-600 mb-6">
              O link de convite não é válido ou já expirou.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Aceitar Convite</CardTitle>
            <CardDescription>
              Complete o cadastro do seu sindicato para aceitar o convite
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Informações do Convite */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Dados do Sindicato:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {convite.sindicato.nome}</p>
                <p><strong>CNPJ:</strong> {convite.sindicato.cnpj}</p>
                <p><strong>Email:</strong> {convite.sindicato.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dados do Responsável */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dados do Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeResponsavel">Nome Completo *</Label>
                    <Input
                      id="nomeResponsavel"
                      name="nomeResponsavel"
                      value={formData.nomeResponsavel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailResponsavel">Email *</Label>
                    <Input
                      id="emailResponsavel"
                      name="emailResponsavel"
                      type="email"
                      value={formData.emailResponsavel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefoneResponsavel">Telefone *</Label>
                    <Input
                      id="telefoneResponsavel"
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="senhaResponsavel">Senha *</Label>
                    <Input
                      id="senhaResponsavel"
                      name="senhaResponsavel"
                      type="password"
                      value={formData.senhaResponsavel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Input
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      placeholder="Ex: SP"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Aceitar Convite e Registrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}