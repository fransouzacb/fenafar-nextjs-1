"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, Download, Eye, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  status: "uploading" | "completed" | "error"
  progress?: number
}

interface DocumentUploadProps {
  onUpload: (files: File[]) => Promise<void>
  onRemove?: (fileId: string) => Promise<void>
  onDownload?: (fileId: string) => void
  onPreview?: (fileId: string) => void
  files?: DocumentFile[]
  maxFiles?: number
  maxSize?: number // em MB
  acceptedTypes?: string[]
  loading?: boolean
  disabled?: boolean
  className?: string
}

const defaultAcceptedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

export function DocumentUpload({
  onUpload,
  onRemove,
  onDownload,
  onPreview,
  files = [],
  maxFiles = 10,
  maxSize = 10, // 10MB
  acceptedTypes = defaultAcceptedTypes,
  loading = false,
  disabled = false,
  className
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("image")) return "🖼️"
    if (type.includes("word")) return "📝"
    return "📎"
  }

  const validateFile = (file: File): string | null => {
    // Verificar tipo
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido. Tipos aceitos: ${acceptedTypes.join(", ")}`
    }

    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxSize}MB`
    }

    return null
  }

  const handleFiles = async (fileList: FileList) => {
    const filesArray = Array.from(fileList)
    
    // Validar número de arquivos
    if (files.length + filesArray.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    // Validar cada arquivo
    for (const file of filesArray) {
      const error = validateFile(file)
      if (error) {
        alert(`${file.name}: ${error}`)
        return
      }
    }

    try {
      await onUpload(filesArray)
    } catch (error) {
      console.error("Erro no upload:", error)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleRemove = async (fileId: string) => {
    if (onRemove) {
      try {
        await onRemove(fileId)
      } catch (error) {
        console.error("Erro ao remover:", error)
      }
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Documentos
          </CardTitle>
          <CardDescription>
            Arraste e solte arquivos ou clique para selecionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
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
              multiple
              accept={acceptedTypes.join(",")}
              onChange={handleChange}
              className="hidden"
              disabled={disabled}
            />
            
            <div className="space-y-4">
              <div className="text-6xl text-gray-400">
                {dragActive ? <Upload className="mx-auto" /> : <File className="mx-auto" />}
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {dragActive ? "Solte os arquivos aqui" : "Clique para fazer upload"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Máximo {maxFiles} arquivos, {maxSize}MB cada
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Tipos aceitos: PDF, DOC, DOCX, JPG, PNG, WEBP
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || loading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Arquivos ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-2xl">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                        <Badge
                          variant={
                            file.status === "completed" 
                              ? "default" 
                              : file.status === "error" 
                                ? "destructive" 
                                : "secondary"
                          }
                        >
                          {file.status === "uploading" && "Enviando..."}
                          {file.status === "completed" && "Concluído"}
                          {file.status === "error" && "Erro"}
                        </Badge>
                      </div>
                      {file.status === "uploading" && file.progress !== undefined && (
                        <Progress value={file.progress} className="mt-2" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {file.status === "completed" && (
                      <>
                        {onPreview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPreview(file.id)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onDownload && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(file.id)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {onRemove && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(file.id)}
                        title="Remover"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Hook para gerenciar upload de documentos
export function useDocumentUpload() {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [loading, setLoading] = useState(false)

  const uploadFiles = async (newFiles: File[]) => {
    setLoading(true)
    
    // Adicionar arquivos com status "uploading"
    const uploadingFiles: DocumentFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading" as const,
      progress: 0
    }))
    
    setFiles(prev => [...prev, ...uploadingFiles])

    try {
      // Simular upload com progresso
      for (let i = 0; i < uploadingFiles.length; i++) {
        const file = uploadingFiles[i]
        
        // Simular progresso
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ))
        }
        
        // Marcar como concluído
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: "completed" as const,
            url: URL.createObjectURL(newFiles[i])
          } : f
        ))
      }
      
      // Aqui você faria o upload real para o servidor
      // const formData = new FormData()
      // newFiles.forEach(file => formData.append('files', file))
      // const response = await fetch('/api/upload/documents', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()
      
    } catch (error) {
      console.error("Erro no upload:", error)
      // Marcar arquivos como erro
      setFiles(prev => prev.map(f => 
        uploadingFiles.some(uf => uf.id === f.id) 
          ? { ...f, status: "error" as const }
          : f
      ))
    } finally {
      setLoading(false)
    }
  }

  const removeFile = async (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const downloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file?.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    }
  }

  const previewFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file?.url) {
      window.open(file.url, '_blank')
    }
  }

  return {
    files,
    loading,
    uploadFiles,
    removeFile,
    downloadFile,
    previewFile
  }
}
