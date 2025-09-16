"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Search, Filter, Edit, Trash2, Users, Mail, Phone, Building } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  cpf?: string
  phone?: string
  cargo?: string
  active: boolean
  role: string
  createdAt: string
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

interface FormData {
  name: string
  email: string
  cpf: string
  phone: string
  cargo: string
  password: string
  sindicatoId: string
}

export default function MembrosPage() {
  const [membros, setMembros] = useState<User[]>([])
  const [sindicatos, setSindicatos] = useState<Sindicato[]>([])
  const [filteredMembros, setFilteredMembros] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | "all">("all")
  const [selectedSindicato, setSelectedSindicato] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMembro, setEditingMembro] = useState<User | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    cargo: "",
    password: "",
    sindicatoId: ""
  })

  const { success, error: showError } = useToast()
  const { getUserRole } = useAuth()
  const userRole = getUserRole()

  // Buscar dados do banco
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Buscar membros
        const membrosResponse = await fetch('/api/membros')
        if (membrosResponse.ok) {
          const membrosResult = await membrosResponse.json()
          // Garantir que temos um array de membros
          if (membrosResult.success && Array.isArray(membrosResult.membros)) {
            setMembros(membrosResult.membros)
          } else if (membrosResult.success && membrosResult.data && Array.isArray(membrosResult.data.membros)) {
            setMembros(membrosResult.data.membros)
          } else if (Array.isArray(membrosResult)) {
            setMembros(membrosResult)
          } else {
            setMembros([])
          }
        }
        
        // Buscar sindicatos
        const sindicatosResponse = await fetch('/api/sindicatos')
        if (sindicatosResponse.ok) {
          const sindicatosResult = await sindicatosResponse.json()
          // Garantir que temos um array, mesmo que a resposta tenha estrutura diferente
          if (sindicatosResult.success && Array.isArray(sindicatosResult.sindicatos)) {
            setSindicatos(sindicatosResult.sindicatos)
          } else if (sindicatosResult.success && sindicatosResult.data && Array.isArray(sindicatosResult.data.sindicatos)) {
            setSindicatos(sindicatosResult.data.sindicatos)
          } else if (Array.isArray(sindicatosResult)) {
            setSindicatos(sindicatosResult)
          } else {
            setSindicatos([])
          }
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        showError("Erro", "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [showError])

  // Filtrar membros
  useEffect(() => {
    let filtered = membros.filter(m => m.role === 'MEMBER')

    // Filtrar por busca
    if (search) {
      filtered = filtered.filter(membro =>
        membro.name?.toLowerCase().includes(search.toLowerCase()) ||
        membro.email.toLowerCase().includes(search.toLowerCase()) ||
        membro.cpf?.includes(search) ||
        membro.cargo?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtrar por status ativo
    if (filterActive !== "all") {
      filtered = filtered.filter(membro => membro.active === filterActive)
    }

    // Filtrar por sindicato (se necessário)
    if (selectedSindicato !== "all" && userRole === "FENAFAR_ADMIN") {
      filtered = filtered.filter(membro => membro.sindicato?.id === selectedSindicato)
    }

    setFilteredMembros(filtered)
  }, [membros, search, filterActive, selectedSindicato, userRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingMembro ? `/api/membros/${editingMembro.id}` : '/api/membros'
      const method = editingMembro ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedMembro = await response.json()
        
        if (editingMembro) {
          setMembros(prev => prev.map(m => m.id === editingMembro.id ? updatedMembro : m))
          success("Sucesso!", "Membro atualizado com sucesso!")
        } else {
          setMembros(prev => [updatedMembro, ...prev])
          success("Sucesso!", "Membro criado com sucesso!")
        }

        // Resetar formulário
        setFormData({
          name: "",
          email: "",
          cpf: "",
          phone: "",
          cargo: "",
          password: "",
          sindicatoId: ""
        })
        setDialogOpen(false)
        setEditingMembro(null)
        
      } else {
        const errorData = await response.json()
        showError("Erro", errorData.error || "Erro ao salvar membro")
      }

    } catch (err) {
      showError("Erro", "Erro ao salvar membro")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (membro: User) => {
    setEditingMembro(membro)
    setFormData({
      name: membro.name || "",
      email: membro.email,
      cpf: membro.cpf || "",
      phone: membro.phone || "",
      cargo: membro.cargo || "",
      password: "",
      sindicatoId: membro.sindicato?.id || ""
    })
    setDialogOpen(true)
  }

  const handleDelete = async (membroId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este membro?")) {
      try {
        const response = await fetch(`/api/membros/${membroId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setMembros(prev => prev.filter(m => m.id !== membroId))
          success("Sucesso!", "Membro excluído com sucesso!")
        } else {
          const errorData = await response.json()
          showError("Erro", errorData.error || "Erro ao excluir membro")
        }
      } catch (error) {
        showError("Erro", "Erro ao excluir membro")
      }
    }
  }

  const toggleActive = async (membroId: string) => {
    try {
      const membro = membros.find(m => m.id === membroId)
      if (!membro) return
      
      const response = await fetch(`/api/membros/${membroId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...membro, 
          active: !membro.active 
        }),
      })
      
      if (response.ok) {
        const updatedMembro = await response.json()
        setMembros(prev => prev.map(m => m.id === membroId ? updatedMembro : m))
        success("Sucesso!", "Status do membro atualizado!")
      } else {
        showError("Erro", "Erro ao atualizar status")
      }
    } catch (error) {
      showError("Erro", "Erro ao atualizar status")
    }
  }

  const openNewMemberDialog = () => {
    setEditingMembro(null)
    setFormData({
      name: "",
      email: "",
      cpf: "",
      phone: "",
      cargo: "",
      password: "",
      sindicatoId: ""
    })
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando membros...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Membros</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os membros dos sindicatos filiados à FENAFAR
          </p>
        </div>
        <Button onClick={openNewMemberDialog} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Membro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Membros</p>
                <p className="text-2xl font-bold">{membros.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membros Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {membros.filter(m => m.active).length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membros Inativos</p>
                <p className="text-2xl font-bold text-red-600">
                  {membros.filter(m => !m.active).length}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800">Inativo</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sindicatos</p>
                <p className="text-2xl font-bold">{sindicatos.length}</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email, CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterActive === "all" ? "all" : filterActive.toString()}
              onValueChange={(value) => 
                setFilterActive(value === "all" ? "all" : value === "true")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativos</SelectItem>
                <SelectItem value="false">Inativos</SelectItem>
              </SelectContent>
            </Select>

            {userRole === "FENAFAR_ADMIN" && (
              <Select value={selectedSindicato} onValueChange={setSelectedSindicato}>
                <SelectTrigger>
                  <SelectValue placeholder="Sindicato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Sindicatos</SelectItem>
                  {Array.isArray(sindicatos) && sindicatos.map(sindicato => (
                    <SelectItem key={sindicato.id} value={sindicato.id}>
                      {sindicato.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembros.map(membro => (
          <Card key={membro.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{membro.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {membro.cargo || "Cargo não informado"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={membro.active}
                    onCheckedChange={() => toggleActive(membro.id)}
                  />
                  <Badge variant={membro.active ? "default" : "secondary"}>
                    {membro.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {membro.email}
              </div>
              
              {membro.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {membro.phone}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                {membro.sindicato?.name || "Nenhum sindicato"}
              </div>
              
              <div className="text-xs text-gray-500">
                CPF: {membro.cpf}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(membro)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(membro.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembros.length === 0 && (
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {search || filterActive !== "all" || selectedSindicato !== "all"
                ? "Tente ajustar os filtros de pesquisa"
                : "Comece adicionando o primeiro membro"
              }
            </p>
            {(!search && filterActive === "all" && selectedSindicato === "all") && (
              <Button onClick={openNewMemberDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Membro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog para Criar/Editar Membro */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMembro ? "Editar Membro" : "Novo Membro"}
            </DialogTitle>
            <DialogDescription>
              {editingMembro 
                ? "Atualize as informações do membro"
                : "Preencha os dados para criar um novo membro"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  placeholder="Ex: Farmacêutico"
                />
              </div>

              <div>
                <Label htmlFor="sindicatoId">Sindicato *</Label>
                <Select
                  value={formData.sindicatoId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sindicatoId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sindicato" />
                  </SelectTrigger>
                  <SelectContent>
                    {sindicatos.map(sindicato => (
                      <SelectItem key={sindicato.id} value={sindicato.id}>
                        {sindicato.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!editingMembro && (
              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 8 caracteres"
                  required={!editingMembro}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Salvando..." : (editingMembro ? "Atualizar" : "Criar")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}