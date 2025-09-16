"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Save, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldConfig {
  key: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "select" | "number" | "date"
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: (value: any) => string | null
  className?: string
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Record<string, any>) => Promise<void>
  title: string
  description?: string
  fields: FieldConfig[]
  initialData?: Record<string, any>
  loading?: boolean
  tabs?: Array<{
    key: string
    label: string
    fields: FieldConfig[]
  }>
  className?: string
}

export function EditModal({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  fields,
  initialData = {},
  loading = false,
  tabs,
  className
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
      setErrors({})
      setShowPasswords({})
    }
  }, [isOpen, initialData])

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    
    // Limpar erro do campo
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }))
    }
  }

  const validateField = (field: FieldConfig, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} é obrigatório`
    }
    
    if (field.validation) {
      return field.validation(value)
    }
    
    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const fieldsToValidate = tabs ? tabs.flatMap(tab => tab.fields) : fields
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field.key])
      if (error) {
        newErrors[field.key] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  const renderField = (field: FieldConfig) => {
    const error = errors[field.key]
    const value = formData[field.key] || ""
    
    const commonProps = {
      id: field.key,
      value: value,
      onChange: (e: any) => handleFieldChange(field.key, e.target.value),
      placeholder: field.placeholder,
      className: cn(field.className, error && "border-red-500"),
      required: field.required
    }

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            rows={4}
          />
        )
      
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(value) => handleFieldChange(field.key, value)}
          >
            <SelectTrigger className={cn(error && "border-red-500")}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case "password":
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type={showPasswords[field.key] ? "text" : "password"}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPasswords(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
            >
              {showPasswords[field.key] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        )
      
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
          />
        )
    }
  }

  const renderFields = (fieldsToRender: FieldConfig[]) => (
    <div className="space-y-4">
      {fieldsToRender.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(field)}
          {errors[field.key] && (
            <p className="text-sm text-red-500">{errors[field.key]}</p>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-2xl max-h-[90vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">
          {tabs ? (
            <Tabs defaultValue={tabs[0]?.key} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.key} value={tab.key} className="mt-6">
                  {renderFields(tab.fields)}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            renderFields(fields)
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook para gerenciar estado do modal
export function useEditModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleSave = async (saveFunction: (data: any) => Promise<void>, data: any) => {
    setLoading(true)
    try {
      await saveFunction(data)
      closeModal()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    isOpen,
    loading,
    openModal,
    closeModal,
    handleSave
  }
}
