"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Camera, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  currentAvatar?: string
  name?: string
  onUpload: (file: File) => Promise<void>
  onRemove?: () => Promise<void>
  loading?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24", 
  lg: "h-32 w-32",
  xl: "h-40 w-40"
}

export function AvatarUpload({
  currentAvatar,
  name,
  onUpload,
  onRemove,
  loading = false,
  disabled = false,
  size = "md",
  className
}: AvatarUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Fazer upload
    try {
      await onUpload(file)
    } catch (error) {
      console.error('Erro no upload:', error)
      setPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleRemove = async () => {
    if (onRemove) {
      try {
        await onRemove()
        setPreview(null)
      } catch (error) {
        console.error('Erro ao remover:', error)
      }
    }
  }

  const displayAvatar = preview || currentAvatar
  const displayName = name || "Usuário"

  return (
    <Card className={cn("w-fit", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Foto de Perfil</CardTitle>
        <CardDescription>
          Faça upload de uma foto para seu perfil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar Display */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className={cn(sizeClasses[size])}>
              <AvatarImage 
                src={displayAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} 
                alt="Avatar" 
              />
              <AvatarFallback className={cn("text-lg", size === "xl" && "text-2xl")}>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {loading && (
              <div className={cn(
                "absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center",
                sizeClasses[size]
              )}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              if (!disabled) setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={disabled}
            />
            
            <div className="space-y-2">
              <div className="text-4xl text-gray-400">
                {dragActive ? <Upload className="mx-auto" /> : <Camera className="mx-auto" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dragActive ? "Solte a imagem aqui" : "Clique para fazer upload"}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP até 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {currentAvatar ? "Alterar" : "Upload"}
            </Button>
            
            {displayAvatar && onRemove && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || loading}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook para gerenciar upload de avatar
export function useAvatarUpload() {
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)

  const uploadAvatar = async (file: File) => {
    setLoading(true)
    try {
      // Simular upload - substituir pela implementação real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Criar URL temporária para preview
      const url = URL.createObjectURL(file)
      setAvatar(url)
      
      // Aqui você faria o upload real para o servidor
      // const formData = new FormData()
      // formData.append('avatar', file)
      // const response = await fetch('/api/upload/avatar', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()
      // setAvatar(data.url)
      
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeAvatar = async () => {
    setLoading(true)
    try {
      // Simular remoção - substituir pela implementação real
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAvatar(null)
    } catch (error) {
      console.error('Erro ao remover:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    avatar,
    loading,
    uploadAvatar,
    removeAvatar
  }
}
