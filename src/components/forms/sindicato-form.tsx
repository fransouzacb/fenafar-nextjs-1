'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Save, Building2 } from 'lucide-react'
import { toast } from 'sonner'

interface SindicatoFormData {
  name: string
  cnpj: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email: string
  website?: string
  description?: string
  active: boolean
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
}

interface SindicatoFormProps {
  sindicato?: SindicatoFormData & { id: string }
  onClose: () => void
  onSuccess: () => void
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function SindicatoForm({ sindicato, onClose, onSuccess }: SindicatoFormProps) {
  const [formData, setFormData] = useState<SindicatoFormData>({
    name: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    active: true,
    status: 'PENDING'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (sindicato) {
      setFormData({
        name: sindicato.name,
        cnpj: sindicato.cnpj,
        address: sindicato.address || '',
        city: sindicato.city || '',
        state: sindicato.state || '',
        zipCode: sindicato.zipCode || '',
        phone: sindicato.phone || '',
        email: sindicato.email,
        website: sindicato.website || '',
        description: sindicato.description || '',
        active: sindicato.active,
        status: sindicato.status || 'PENDING'
      })
    }
  }, [sindicato])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório'
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ deve estar no formato 00.000.000/0000-00'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website deve começar com http:// ou https://'
    }

    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (00) 00000-0000'
    }

    if (formData.zipCode && !/^\d{5}-?\d{3}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'CEP deve estar no formato 00000-000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    } else {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  }

  const handleChange = (field: keyof SindicatoFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('Token não encontrado')

      const url = sindicato ? `/api/sindicatos/${sindicato.id}` : '/api/sindicatos'
      const method = sindicato ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar sindicato')
      }

      toast.success(sindicato ? 'Sindicato atualizado com sucesso!' : 'Sindicato criado com sucesso!')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar sindicato:', error)
      toast.error(error.message || 'Erro ao salvar sindicato')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>
                  {sindicato ? 'Editar Sindicato' : 'Novo Sindicato'}
                </CardTitle>
                <CardDescription>
                  {sindicato ? 'Atualize as informações do sindicato' : 'Preencha os dados do novo sindicato'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Nome do sindicato"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleChange('cnpj', formatCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className={errors.cnpj ? 'border-red-500' : ''}
                  />
                  {errors.cnpj && (
                    <p className="text-sm text-red-500">{errors.cnpj}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contato@sindicato.com.br"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Breve descrição do sindicato"
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações de Contato</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://www.sindicato.com.br"
                    className={errors.website ? 'border-red-500' : ''}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500">{errors.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione o estado</option>
                    {estadosBrasil.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', formatZipCode(e.target.value))}
                    placeholder="00000-000"
                    maxLength={9}
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-500">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => handleChange('active', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="active">Sindicato ativo</Label>
              </div>
              
              {sindicato && formData.status && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Status de Aprovação:</strong> {
                      formData.status === 'APPROVED' ? 'Aprovado' :
                      formData.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apenas administradores FENAFAR podem alterar o status de aprovação
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="fenafar-primary"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Salvando...' : (sindicato ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
