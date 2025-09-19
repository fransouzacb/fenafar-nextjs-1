'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Save, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

interface ConviteFormData {
  email: string
  role: 'SINDICATO_ADMIN' | 'MEMBER'
  sindicatoId?: string
  maxMembers?: number
}

interface Sindicato {
  id: string
  name: string
  cnpj: string
}

interface ConviteFormProps {
  convite?: ConviteFormData & { id: string }
  onClose: () => void
  onSuccess: () => void
}

export function ConviteForm({ convite, onClose, onSuccess }: ConviteFormProps) {
  const [formData, setFormData] = useState<ConviteFormData>({
    email: '',
    role: 'MEMBER',
    sindicatoId: '',
    maxMembers: undefined
  })
  const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (convite) {
      setFormData({
        email: convite.email,
        role: convite.role,
        sindicatoId: convite.sindicatoId || '',
        maxMembers: convite.maxMembers || undefined
      })
    }
    loadSindicatos()
  }, [convite])

  const loadSindicatos = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/sindicatos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSindicatos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar sindicatos:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.role) {
      newErrors.role = 'Role é obrigatório'
    }

    if (formData.role === 'SINDICATO_ADMIN' && !formData.sindicatoId) {
      newErrors.sindicatoId = 'Sindicato é obrigatório para admin de sindicato'
    }

    if (formData.role === 'SINDICATO_ADMIN' && (!formData.maxMembers || formData.maxMembers <= 0)) {
      newErrors.maxMembers = 'Limite de membros é obrigatório para admin de sindicato'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof ConviteFormData, value: string | number) => {
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

      const url = convite ? `/api/convites/${convite.id}` : '/api/convites'
      const method = convite ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        sindicatoId: formData.role === 'SINDICATO_ADMIN' ? formData.sindicatoId || null : null,
        maxMembers: formData.role === 'SINDICATO_ADMIN' ? formData.maxMembers || null : null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar convite')
      }

      toast.success(convite ? 'Convite atualizado com sucesso!' : 'Convite criado com sucesso!')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar convite:', error)
      toast.error(error.message || 'Erro ao salvar convite')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>
                  {convite ? 'Editar Convite' : 'Novo Convite'}
                </CardTitle>
                <CardDescription>
                  {convite ? 'Atualize as informações do convite' : 'Envie um convite para um novo usuário'}
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
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="usuario@exemplo.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value as 'SINDICATO_ADMIN' | 'MEMBER')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="MEMBER">Membro</option>
                <option value="SINDICATO_ADMIN">Admin de Sindicato</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Sindicato (apenas para SINDICATO_ADMIN) */}
            {formData.role === 'SINDICATO_ADMIN' && (
              <div className="space-y-2">
                <Label htmlFor="sindicatoId">Sindicato *</Label>
                <select
                  id="sindicatoId"
                  value={formData.sindicatoId}
                  onChange={(e) => handleChange('sindicatoId', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione um sindicato</option>
                  {sindicatos.map(sindicato => (
                    <option key={sindicato.id} value={sindicato.id}>
                      {sindicato.name} ({sindicato.cnpj})
                    </option>
                  ))}
                </select>
                {errors.sindicatoId && (
                  <p className="text-sm text-red-500">{errors.sindicatoId}</p>
                )}
              </div>
            )}

            {/* Limite de Membros (apenas para SINDICATO_ADMIN) */}
            {formData.role === 'SINDICATO_ADMIN' && (
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Limite de Membros *</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min="1"
                  value={formData.maxMembers || ''}
                  onChange={(e) => handleChange('maxMembers', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 100"
                  className={errors.maxMembers ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500">
                  Número máximo de membros que este sindicato pode ter
                </p>
                {errors.maxMembers && (
                  <p className="text-sm text-red-500">{errors.maxMembers}</p>
                )}
              </div>
            )}

            {/* Info */}
            <Alert>
              <AlertDescription>
                O convite será válido por 7 dias e um token único será gerado automaticamente.
              </AlertDescription>
            </Alert>

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
                {isLoading ? 'Salvando...' : (convite ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
