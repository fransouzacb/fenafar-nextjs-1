'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Building2, Users } from 'lucide-react'
import { toast } from 'sonner'

interface Convite {
  id: string
  email: string
  role: 'SINDICATO_ADMIN' | 'MEMBER'
  token: string
  expiresAt: string
  usado: boolean
  maxMembers?: number
  sindicato?: {
    id: string
    name: string
    cnpj: string
  }
  criadoPor: {
    name: string
    email: string
  }
}

interface UserFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  cpf?: string
  cargo?: string
}

interface SindicatoFormData {
  name: string
  cnpj: string
  email: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
}

export default function AceitarConvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [convite, setConvite] = useState<Convite | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'loading' | 'expired' | 'used' | 'form' | 'success'>('loading')
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [sindicatoForm, setSindicatoForm] = useState<SindicatoFormData>({
    name: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (token) {
      loadConvite()
    }
  }, [token])

  const loadConvite = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/convites/aceitar/${token}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Convite não encontrado')
      }

      const data = await response.json()
      const conviteData = data.convite

      // Verificar se convite expirou
      if (new Date(conviteData.expiresAt) < new Date()) {
        setStep('expired')
        return
      }

      // Verificar se convite já foi usado
      if (conviteData.usado) {
        setStep('used')
        return
      }

      setConvite(conviteData)
      setUserForm(prev => ({ ...prev, email: conviteData.email }))
      setStep('form')
    } catch (error) {
      console.error('Erro ao carregar convite:', error)
      toast.error('Convite inválido ou expirado')
      setStep('expired')
    } finally {
      setIsLoading(false)
    }
  }

  const validateUserForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!userForm.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!userForm.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!userForm.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (userForm.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (userForm.password !== userForm.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    // Para SINDICATO_ADMIN, CPF e cargo são obrigatórios
    if (convite?.role === 'SINDICATO_ADMIN') {
      if (!userForm.cpf?.trim()) {
        newErrors.cpf = 'CPF é obrigatório para administrador'
      }
      if (!userForm.cargo?.trim()) {
        newErrors.cargo = 'Cargo é obrigatório para administrador'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSindicatoForm = (): boolean => {
    if (convite?.role !== 'SINDICATO_ADMIN') return true

    const newErrors: Record<string, string> = {}

    if (!sindicatoForm.name.trim()) {
      newErrors.name = 'Nome do sindicato é obrigatório'
    }

    if (!sindicatoForm.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório'
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(sindicatoForm.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido (formato: 00.000.000/0000-00)'
    }

    if (!sindicatoForm.email.trim()) {
      newErrors.email = 'Email do sindicato é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sindicatoForm.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateUserForm() || !validateSindicatoForm()) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/convites/aceitar/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userForm,
          sindicato: convite?.role === 'SINDICATO_ADMIN' ? sindicatoForm : undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao aceitar convite')
      }

      const data = await response.json()
      toast.success('Convite aceito com sucesso! Redirecionando para login...')
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
      setStep('success')
    } catch (error: any) {
      console.error('Erro ao aceitar convite:', error)
      toast.error(error.message || 'Erro ao aceitar convite')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('user.')) {
      const userField = field.replace('user.', '') as keyof UserFormData
      setUserForm(prev => ({ ...prev, [userField]: value }))
    } else if (field.startsWith('sindicato.')) {
      const sindicatoField = field.replace('sindicato.', '') as keyof SindicatoFormData
      setSindicatoForm(prev => ({ ...prev, [sindicatoField]: value }))
    }

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Verificando convite...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Convite Expirado</CardTitle>
            <CardDescription>
              Este convite expirou ou é inválido. Entre em contato com quem enviou o convite.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/login')} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'used') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-xl text-yellow-600">Convite Já Utilizado</CardTitle>
            <CardDescription>
              Este convite já foi utilizado. Você pode fazer login normalmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/login')} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-600">Convite Aceito!</CardTitle>
            <CardDescription>
              Sua conta foi criada com sucesso. Você será redirecionado para o login.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {convite?.role === 'SINDICATO_ADMIN' ? (
                <Building2 className="h-8 w-8 text-blue-600" />
              ) : (
                <Users className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {convite?.role === 'SINDICATO_ADMIN' 
                ? 'Aceitar Convite de Administração' 
                : 'Aceitar Convite de Membro'
              }
            </CardTitle>
            <CardDescription>
              {convite?.role === 'SINDICATO_ADMIN' 
                ? 'Complete o cadastro para administrar um novo sindicato'
                : `Complete o cadastro para se tornar membro do sindicato ${convite?.sindicato?.name}`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                <strong>Convite enviado por:</strong> {convite?.criadoPor.name} ({convite?.criadoPor.email})
                <br />
                <strong>Email do convite:</strong> {convite?.email}
                <br />
                {convite?.role === 'SINDICATO_ADMIN' && (
                  <>
                    <strong>Limite de membros:</strong> {convite.maxMembers}
                  </>
                )}
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Usuário */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user.name">Nome Completo *</Label>
                    <Input
                      id="user.name"
                      value={userForm.name}
                      onChange={(e) => handleInputChange('user.name', e.target.value)}
                      className={errors['user.name'] ? 'border-red-500' : ''}
                    />
                    {errors['user.name'] && (
                      <p className="text-sm text-red-500 mt-1">{errors['user.name']}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="user.email">Email *</Label>
                    <Input
                      id="user.email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => handleInputChange('user.email', e.target.value)}
                      className={errors['user.email'] ? 'border-red-500' : ''}
                    />
                    {errors['user.email'] && (
                      <p className="text-sm text-red-500 mt-1">{errors['user.email']}</p>
                    )}
                  </div>

                  {convite?.role === 'SINDICATO_ADMIN' && (
                    <>
                      <div>
                        <Label htmlFor="user.cpf">CPF *</Label>
                        <Input
                          id="user.cpf"
                          value={userForm.cpf || ''}
                          onChange={(e) => handleInputChange('user.cpf', e.target.value)}
                          placeholder="000.000.000-00"
                          className={errors['user.cpf'] ? 'border-red-500' : ''}
                        />
                        {errors['user.cpf'] && (
                          <p className="text-sm text-red-500 mt-1">{errors['user.cpf']}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="user.cargo">Cargo *</Label>
                        <Input
                          id="user.cargo"
                          value={userForm.cargo || ''}
                          onChange={(e) => handleInputChange('user.cargo', e.target.value)}
                          placeholder="Ex: Presidente, Secretário"
                          className={errors['user.cargo'] ? 'border-red-500' : ''}
                        />
                        {errors['user.cargo'] && (
                          <p className="text-sm text-red-500 mt-1">{errors['user.cargo']}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="user.password">Senha *</Label>
                    <Input
                      id="user.password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => handleInputChange('user.password', e.target.value)}
                      className={errors['user.password'] ? 'border-red-500' : ''}
                    />
                    {errors['user.password'] && (
                      <p className="text-sm text-red-500 mt-1">{errors['user.password']}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="user.confirmPassword">Confirmar Senha *</Label>
                    <Input
                      id="user.confirmPassword"
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(e) => handleInputChange('user.confirmPassword', e.target.value)}
                      className={errors['user.confirmPassword'] ? 'border-red-500' : ''}
                    />
                    {errors['user.confirmPassword'] && (
                      <p className="text-sm text-red-500 mt-1">{errors['user.confirmPassword']}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados do Sindicato (apenas para SINDICATO_ADMIN) */}
              {convite?.role === 'SINDICATO_ADMIN' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dados do Sindicato</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="sindicato.name">Nome do Sindicato *</Label>
                      <Input
                        id="sindicato.name"
                        value={sindicatoForm.name}
                        onChange={(e) => handleInputChange('sindicato.name', e.target.value)}
                        className={errors['sindicato.name'] ? 'border-red-500' : ''}
                      />
                      {errors['sindicato.name'] && (
                        <p className="text-sm text-red-500 mt-1">{errors['sindicato.name']}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sindicato.cnpj">CNPJ *</Label>
                      <Input
                        id="sindicato.cnpj"
                        value={sindicatoForm.cnpj}
                        onChange={(e) => handleInputChange('sindicato.cnpj', e.target.value)}
                        placeholder="00.000.000/0000-00"
                        className={errors['sindicato.cnpj'] ? 'border-red-500' : ''}
                      />
                      {errors['sindicato.cnpj'] && (
                        <p className="text-sm text-red-500 mt-1">{errors['sindicato.cnpj']}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sindicato.email">Email do Sindicato *</Label>
                      <Input
                        id="sindicato.email"
                        type="email"
                        value={sindicatoForm.email}
                        onChange={(e) => handleInputChange('sindicato.email', e.target.value)}
                        className={errors['sindicato.email'] ? 'border-red-500' : ''}
                      />
                      {errors['sindicato.email'] && (
                        <p className="text-sm text-red-500 mt-1">{errors['sindicato.email']}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sindicato.telefone">Telefone</Label>
                      <Input
                        id="sindicato.telefone"
                        value={sindicatoForm.telefone || ''}
                        onChange={(e) => handleInputChange('sindicato.telefone', e.target.value)}
                        placeholder="(00) 0000-0000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sindicato.cep">CEP</Label>
                      <Input
                        id="sindicato.cep"
                        value={sindicatoForm.cep || ''}
                        onChange={(e) => handleInputChange('sindicato.cep', e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sindicato.cidade">Cidade</Label>
                      <Input
                        id="sindicato.cidade"
                        value={sindicatoForm.cidade || ''}
                        onChange={(e) => handleInputChange('sindicato.cidade', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sindicato.estado">Estado</Label>
                      <Input
                        id="sindicato.estado"
                        value={sindicatoForm.estado || ''}
                        onChange={(e) => handleInputChange('sindicato.estado', e.target.value)}
                        placeholder="Ex: SP"
                        maxLength={2}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="sindicato.endereco">Endereço</Label>
                      <Input
                        id="sindicato.endereco"
                        value={sindicatoForm.endereco || ''}
                        onChange={(e) => handleInputChange('sindicato.endereco', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Aceitar Convite'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
