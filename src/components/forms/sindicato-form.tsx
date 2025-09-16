"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface SindicatoFormProps {
  initialData?: {
    name?: string
    cnpj?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    phone?: string
    email?: string
    website?: string
    description?: string
  }
  onSubmit: (data: { name: string; cnpj: string; email: string; phone: string; address: string; city: string; state: string; zipCode: string; website: string; description: string }) => Promise<void>
  loading?: boolean
  submitText?: string
}

export function SindicatoForm({ 
  initialData, 
  onSubmit, 
  loading = false,
  submitText = "Salvar"
}: SindicatoFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    cnpj: initialData?.cnpj || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
    description: initialData?.description || "",
  })

  const { success, error: showError } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(formData)
      success("Sindicato salvo com sucesso!", "As informações foram atualizadas.")
    } catch {
      showError("Erro ao salvar", "Ocorreu um erro ao salvar o sindicato.")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Sindicato</CardTitle>
        <CardDescription>
          Preencha as informações básicas do sindicato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Sindicato *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nome do sindicato"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleChange("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Rua, número, bairro"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Cidade"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="UF"
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                placeholder="00000-000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(00) 0000-0000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contato@sindicato.com.br"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://www.sindicato.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Breve descrição do sindicato"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
