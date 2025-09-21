'use client'

import { useEffect, useState } from 'react'
import { useAuthSimple } from '@/hooks/use-auth-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TestTube,
  Settings,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
  type: 'convite_sindicato' | 'convite_membro' | 'notificacao' | 'custom'
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

export default function EmailTemplatesPage() {
  const { user } = useAuthSimple()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [viewingTemplate, setViewingTemplate] = useState<EmailTemplate | null>(null)
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean
    template: EmailTemplate | null
  }>({
    isOpen: false,
    template: null
  })

  // Carregar templates
  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/email-templates', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar templates')
      }

      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
      toast.error('Erro ao carregar templates')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  // Funções de tipo
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'convite_sindicato':
        return {
          text: 'Convite Sindicato',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        }
      case 'convite_membro':
        return {
          text: 'Convite Membro',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        }
      case 'notificacao':
        return {
          text: 'Notificação',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        }
      case 'custom':
        return {
          text: 'Personalizado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        }
      default:
        return {
          text: type,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        }
    }
  }

  // Abrir diálogo de confirmação
  const openConfirmationDialog = (template: EmailTemplate) => {
    setConfirmationDialog({
      isOpen: true,
      template
    })
  }

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!confirmationDialog.template) return

    try {
      const response = await fetch(`/api/email-templates/${confirmationDialog.template.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir template')
      }

      toast.success('Template excluído com sucesso!')
      await loadTemplates()
    } catch (error) {
      console.error('Erro ao excluir template:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir template')
    } finally {
      setConfirmationDialog({
        isOpen: false,
        template: null
      })
    }
  }

  // Testar template
  const handleTestTemplate = async (template: EmailTemplate) => {
    const testEmail = prompt('Digite o e-mail para teste:')
    if (!testEmail) return

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          templateType: template.type
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('E-mail de teste enviado com sucesso!')
      } else {
        toast.error(data.error || 'Erro ao enviar e-mail de teste')
      }
    } catch (error) {
      console.error('Erro ao testar template:', error)
      toast.error('Erro ao enviar e-mail de teste')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de E-mail</h1>
          <p className="text-gray-600">Gerencie os templates de e-mail para convites e notificações</p>
        </div>
        <Button onClick={() => setEditingTemplate({} as EmailTemplate)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const typeInfo = getTypeInfo(template.type)
          
          return (
            <Card key={template.id} className="fenafar-card">
              <CardHeader className="pb-3">
                {/* Primeira linha: Nome e ícone */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate">{template.name}</CardTitle>
                    </div>
                  </div>
                </div>
                
                {/* Segunda linha: Assunto */}
                <div className="mb-2">
                  <CardDescription className="text-sm text-gray-500 truncate">
                    {template.subject}
                  </CardDescription>
                </div>
                
                {/* Terceira linha: Badges */}
                <div className="flex items-center justify-between gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${typeInfo.bgColor} ${typeInfo.color} border-0 text-xs px-2 py-1`}
                  >
                    {typeInfo.text}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${template.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} border-0 text-xs px-2 py-1`}
                  >
                    {template.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {template.variables.length} variáveis
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Settings className="h-4 w-4 mr-2" />
                    Criado por {template.createdBy?.name || 'Usuário não encontrado'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Visualizar */}
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingTemplate(template)}
                        className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        Visualizar
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>

                    {/* Editar */}
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                        className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        Editar
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>

                    {/* Testar */}
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestTemplate(template)}
                        className="w-full h-10 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center justify-center p-0"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        Testar
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>

                    {/* Excluir */}
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConfirmationDialog(template)}
                        className="w-full h-10 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        Excluir
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Criado em {formatDate(template.createdAt)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum template encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro template de e-mail
            </p>
            <Button onClick={() => setEditingTemplate({} as EmailTemplate)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Visualização */}
      {viewingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{viewingTemplate.name}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setViewingTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assunto</label>
                    <p className="text-sm text-gray-900">{viewingTemplate.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                    <p className="text-sm text-gray-900">{getTypeInfo(viewingTemplate.type).text}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Variáveis Disponíveis</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewingTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Preview HTML</label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: viewingTemplate.htmlContent }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setViewingTemplate(null)}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    setViewingTemplate(null)
                    setEditingTemplate(viewingTemplate)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmationDialog
        open={confirmationDialog.isOpen}
        title="Excluir Template"
        description="Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onOpenChange={() => setConfirmationDialog({
          isOpen: false,
          template: null
        })}
      />
    </div>
  )
}
