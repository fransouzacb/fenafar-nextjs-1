"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface MembroFormProps {
  initialData?: {
    name?: string
    email?: string
    phone?: string
    cpf?: string
    cargo?: string
    sindicatoId?: string
  }
  sindicatos: Array<{ id: string; name: string }>
  onSubmit: (data: { name: string; email: string; phone: string; cpf: string; cargo: string; sindicatoId: string }) => Promise<void>
  loading?: boolean
  submitText?: string
}

export function MembroForm({ 
  initialData, 
  sindicatos,
  onSubmit, 
  loading = false,
  submitText = "Salvar"
}: MembroFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    cpf: initialData?.cpf || "",
    cargo: initialData?.cargo || "",
    sindicatoId: initialData?.sindicatoId || "",
  })

  const { success, error: showError } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(formData)
      success("Membro salvo com sucesso!", "As informações foram atualizadas.")
    } catch {
      showError("Erro ao salvar", "Ocorreu um erro ao salvar o membro.")
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
        <CardTitle>Informações do Membro</CardTitle>
        <CardDescription>
          Preencha as informações do membro do sindicato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nome completo do membro"
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
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Número de Registro *</Label>
              <Input
                id="registrationNumber"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="REG-0001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sindicatoId">Sindicato *</Label>
            <Select
              value={formData.sindicatoId}
              onValueChange={(value) => handleChange("sindicatoId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sindicato" />
              </SelectTrigger>
              <SelectContent>
                {sindicatos.map((sindicato) => (
                  <SelectItem key={sindicato.id} value={sindicato.id}>
                    {sindicato.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
