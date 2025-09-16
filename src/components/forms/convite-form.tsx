"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ConviteFormProps {
  initialData?: {
    email?: string
    role?: string
    sindicatoId?: string
  }
  sindicatos: Array<{ id: string; name: string }>
  onSubmit: (data: { email: string; role: string; sindicatoId: string }) => Promise<void>
  loading?: boolean
  submitText?: string
}

const ROLES = [
  { value: "MEMBER", label: "Membro" },
  { value: "SINDICATO_ADMIN", label: "Administrador do Sindicato" },
]

export function ConviteForm({ 
  initialData, 
  sindicatos,
  onSubmit, 
  loading = false,
  submitText = "Enviar Convite"
}: ConviteFormProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    role: initialData?.role || "MEMBER",
    sindicatoId: initialData?.sindicatoId || "",
  })

  const { success, error: showError } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(formData)
      success("Convite enviado com sucesso!", "O convite foi enviado para o email informado.")
    } catch {
      showError("Erro ao enviar convite", "Ocorreu um erro ao enviar o convite.")
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
        <CardTitle>Enviar Convite</CardTitle>
        <CardDescription>
          Convide uma nova pessoa para participar do sindicato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email do Convidado *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="convidado@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Acesso *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de acesso" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informações do Convite</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• O convite será enviado por email</li>
              <li>• O convite expira em 7 dias</li>
              <li>• O convidado precisará criar uma conta</li>
              <li>• Após aceitar, terá acesso ao sindicato selecionado</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
