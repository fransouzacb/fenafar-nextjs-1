'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Search, Filter } from 'lucide-react'

export default function DocumentosPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Documentos do Sindicato
        </h1>
        <p className="text-gray-600">
          Gerencie documentos, CCT, ACT e outros arquivos
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Button className="flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload de Documento
        </Button>
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece fazendo upload de documentos
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Fazer Primeiro Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
