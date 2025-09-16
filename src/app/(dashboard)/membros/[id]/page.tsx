"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  FileText,
  User,
  Shield,
  Activity
} from "lucide-react"

interface User {
  id: string
  name?: string
  email: string
  cpf?: string
  phone?: string
  cargo?: string
  active: boolean
  role: string
  createdAt: string
  updatedAt?: string
  sindicato?: {
    id: string
    name: string
    cnpj: string
  }
}

interface Sindicato {
  id: string
  name: string
  cnpj: string
}

export default function MembroDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [membro, setMembro] = useState<User | null>(null)
  const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cargo: "",
    observacoes: "",
    sindicatoId: ""
  })

  const { success, error: showError } = useToast()
  const { getUserRole } = useAuth()
  const userRole = getUserRole()

  // Buscar dados do membro
  useEffect(() => {
    async function fetchMembro() {
      if (!params.id) return
      
      try {
        const response = await fetch(`/api/membros/${params.id}`)
        if (response.ok) {
          const membroData = await response.json()
          setMembro(membroData)
          
          // Preencher formulário
          setFormData({
            name: membroData.name || "",
            email: membroData.email,
            phone: membroData.phone || "",
            cargo: membroData.cargo || "",
            observacoes: "",
            sindicatoId: membroData.sindicato?.id || ""
          })
        } else {
          showError("Erro", "Membro não encontrado")
        }
      } catch (error) {
        console.error('Erro ao buscar membro:', error)
        showError("Erro", "Erro ao carregar dados do membro")
      } finally {
        setLoading(false)
      }
    }
    
    // Buscar sindicatos
    async function fetchSindicatos() {
      try {
        const response = await fetch('/api/sindicatos')
        if (response.ok) {
          const sindicatosData = await response.json()
          setSindicatos(sindicatosData)
        }
      } catch (error) {
        console.error('Erro ao buscar sindicatos:', error)
      }
    }
    
    fetchMembro()
    fetchSindicatos()
  }, [params.id, showError])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!membro) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/membros/${membro.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        const updatedMembro = await response.json()
        setMembro(updatedMembro)
        success("Sucesso!", "Dados do membro atualizados com sucesso!")
        setEditing(false)
      } else {
        const errorData = await response.json()
        showError("Erro", errorData.error || "Erro ao atualizar dados do membro")
      }
    } catch (err) {
      showError("Erro", "Erro ao atualizar dados do membro")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (membro) {
      setFormData({
        name: membro.name || "",
        email: membro.email,
        phone: membro.phone || "",
        cargo: membro.cargo || "",
        observacoes: "",
        sindicatoId: membro.sindicato?.id || ""
      })
    }
    setEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getInitials = (name?: string) => {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados do membro...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!membro) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Membro não encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              O membro solicitado não existe ou foi removido.
            </p>
            <Button onClick={() => router.push("/membros")}>
              Voltar para Membros
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/membros")}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Membro</h1>
          <p className="text-gray-600 mt-1">
            Informações completas e histórico do membro
          </p>
        </div>
        
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  {editing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-medium">{membro.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {editing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-medium">{membro.email}</p>
                  )}
                </div>

                <div>
                  <Label>CPF</Label>
                  <p className="font-medium">{membro.cpf}</p>
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  {editing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                    />
                  ) : (
                    <p className="font-medium">{membro.phone || "Não informado"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cargo">Cargo/Função</Label>
                  {editing ? (
                    <Input
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      placeholder="Ex: Farmacêutico"
                    />
                  ) : (
                    <p className="font-medium">{membro.cargo || "Não informado"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sindicatoId">Sindicato</Label>
                  {editing ? (
                    <Select
                      value={formData.sindicatoId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sindicatoId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sindicatos.map(sindicato => (
                          <SelectItem key={sindicato.id} value={sindicato.id}>
                            {sindicato.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{membro.sindicato?.name || "Nenhum sindicato"}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                {editing ? (
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Observações sobre o membro..."
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 mt-1">
                    {"Nenhuma observação registrada"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Atividade e Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atividade e Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Membro desde</p>
                  <p className="font-semibold">{formatDate(membro.createdAt)}</p>
                </div>

                {membro.updatedAt && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Edit className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Última atualização</p>
                    <p className="font-semibold">{formatDate(membro.updatedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar e Status */}
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">
                  {getInitials(membro.name)}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="font-semibold text-lg mb-2">{membro.name}</h3>
              <Badge 
                variant={membro.active ? "default" : "secondary"}
                className="mb-4"
              >
                {membro.active ? "Ativo" : "Inativo"}
              </Badge>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{membro.email}</span>
                </div>
                
                {membro.phone && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{membro.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sindicato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-5 h-5" />
                Sindicato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{membro.sindicato?.name || "Nenhum sindicato"}</p>
                <p className="text-sm text-gray-600">
                  CNPJ: {membro.sindicato?.cnpj || "N/A"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => router.push(`/sindicatos/${membro.sindicato?.id}`)}
                  disabled={!membro.sindicato}
                >
                  Ver Detalhes do Sindicato
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Ver Documentos
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-2" />
                {membro.active ? "Desativar Membro" : "Ativar Membro"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}