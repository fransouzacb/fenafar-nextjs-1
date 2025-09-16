"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface Convite {
  id: string
  email: string
  role: string
  criadoEm: string
  expiraEm: string
  criadoPor: {
    name: string
    email: string
  }
}

interface FormData {
  nomeResponsavel: string
  password: string
  confirmarSenha: string
  nomeSindicato: string
  cnpjSindicato: string
  cidadeSindicato: string
  estadoSindicato: string
  telefone: string
  endereco: string
  cep: string
  website: string
  descricao: string
}

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function AceitarConviteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [token] = useState(searchParams.get('token') || '')
  const [convite, setConvite] = useState<Convite | null>(null)
  const [isLoadingConvite, setIsLoadingConvite] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    nomeResponsavel: '',
    password: '',
    confirmarSenha: '',
    nomeSindicato: '',
    cnpjSindicato: '',
    cidadeSindicato: '',
    estadoSindicato: '',
    telefone: '',
    endereco: '',
    cep: '',
    website: '',
    descricao: ''
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Validar e carregar convite
  useEffect(() => {
    if (!token) {
      setError('Token não fornecido na URL')
      setIsLoadingConvite(false)
      return
    }

    const loadConvite = async () => {
      try {
        const response = await fetch(`/api/convites/accept/${token}`)
        const result = await response.json()

        if (result.success) {
          setConvite(result.convite)
        } else {
          setError(result.error || 'Convite inválido')
        }
      } catch (err) {
        setError('Erro ao validar convite')
        console.error('Erro ao carregar convite:', err)
      } finally {
        setIsLoadingConvite(false)
      }
    }

    loadConvite()
  }, [token])

  // Função para mostrar notificações
  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    const toastEl = document.createElement('div')
    toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`
    toastEl.innerHTML = `
      <div class="font-medium">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `
    document.body.appendChild(toastEl)
    
    setTimeout(() => {
      document.body.removeChild(toastEl)
    }, 5000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.nomeResponsavel.trim()) errors.nomeResponsavel = 'Nome é obrigatório'
    if (!formData.password) errors.password = 'Senha é obrigatória'
    else if (formData.password.length < 8) errors.password = 'Senha deve ter pelo menos 8 caracteres'
    
    if (formData.password !== formData.confirmarSenha) {
      errors.confirmarSenha = 'Senhas não coincidem'
    }
    
    if (!formData.nomeSindicato.trim()) errors.nomeSindicato = 'Nome do sindicato é obrigatório'
    if (!formData.cnpjSindicato.trim()) errors.cnpjSindicato = 'CNPJ é obrigatório'
    if (!formData.cidadeSindicato.trim()) errors.cidadeSindicato = 'Cidade é obrigatória'
    if (!formData.estadoSindicato) errors.estadoSindicato = 'Estado é obrigatório'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast('Erro de validação', 'Por favor, corrija os erros no formulário', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/convites/accept/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        showToast('Sucesso!', result.message || 'Cadastro realizado com sucesso!')
        
        // Aguardar um pouco e redirecionar
        setTimeout(() => {
          router.push(result.redirectTo || '/auth/login?message=cadastro-completo')
        }, 3000)
      } else {
        throw new Error(result.error || 'Erro ao aceitar convite')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      showToast('Erro', errorMsg, 'error')
      setError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Tela de carregamento
  if (isLoadingConvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <h1 className="text-xl font-bold mb-2">
              Validando convite...
            </h1>
            <p className="text-gray-600">
              Aguarde enquanto verificamos seu convite.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de erro
  if (error && !convite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Convite Inválido
            </h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de sucesso
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h1 className="text-xl font-bold text-green-600 mb-4">
              Cadastro Realizado!
            </h1>
            <p className="text-gray-600 mb-6">
              Seu sindicato foi cadastrado com sucesso. Você será redirecionado para o login em instantes.
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Redirecionando...
            </div>
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
              <h3 className="font-semibold mb-2">Dados do Convite:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> {convite?.email}</p>
                <p><strong>Role:</strong> {convite?.role}</p>
                <p><strong>Criado por:</strong> {convite?.criadoPor.name} ({convite?.criadoPor.email})</p>
                <p><strong>Expira em:</strong> {convite?.expiraEm ? new Date(convite.expiraEm).toLocaleDateString('pt-BR') : 'N/A'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Responsável */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dados do Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeResponsavel">Nome Completo *</Label>
                    <Input
                      id="nomeResponsavel"
                      value={formData.nomeResponsavel}
                      onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
                      className={formErrors.nomeResponsavel ? 'border-red-500' : ''}
                      required
                    />
                    {formErrors.nomeResponsavel && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.nomeResponsavel}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={formErrors.password ? 'border-red-500' : ''}
                      required
                    />
                    {formErrors.password && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      className={formErrors.confirmarSenha ? 'border-red-500' : ''}
                      required
                    />
                    {formErrors.confirmarSenha && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.confirmarSenha}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados do Sindicato */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dados do Sindicato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nomeSindicato">Nome do Sindicato *</Label>
                    <Input
                      id="nomeSindicato"
                      value={formData.nomeSindicato}
                      onChange={(e) => handleInputChange('nomeSindicato', e.target.value)}
                      className={formErrors.nomeSindicato ? 'border-red-500' : ''}
                      placeholder="Sindicato dos Farmacêuticos de..."
                      required
                    />
                    {formErrors.nomeSindicato && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.nomeSindicato}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cnpjSindicato">CNPJ *</Label>
                    <Input
                      id="cnpjSindicato"
                      value={formData.cnpjSindicato}
                      onChange={(e) => handleInputChange('cnpjSindicato', e.target.value)}
                      className={formErrors.cnpjSindicato ? 'border-red-500' : ''}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                    {formErrors.cnpjSindicato && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.cnpjSindicato}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.sindicato.org.br"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidadeSindicato">Cidade *</Label>
                    <Input
                      id="cidadeSindicato"
                      value={formData.cidadeSindicato}
                      onChange={(e) => handleInputChange('cidadeSindicato', e.target.value)}
                      className={formErrors.cidadeSindicato ? 'border-red-500' : ''}
                      required
                    />
                    {formErrors.cidadeSindicato && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.cidadeSindicato}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="estadoSindicato">Estado *</Label>
                    <Select 
                      value={formData.estadoSindicato} 
                      onValueChange={(value) => handleInputChange('estadoSindicato', value)}
                    >
                      <SelectTrigger className={formErrors.estadoSindicato ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS_BRASIL.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.estadoSindicato && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.estadoSindicato}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao">Descrição do Sindicato</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={3}
                  placeholder="Breve descrição sobre o sindicato, seus objetivos e área de atuação..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando cadastro...
                  </>
                ) : (
                  'Aceitar Convite e Cadastrar Sindicato'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}