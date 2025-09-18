'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Plus, Search, Filter } from 'lucide-react'

export default function ConvitesPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Convites para Membros
        </h1>
        <p className="text-gray-600">
          Envie convites para novos membros se juntarem ao sindicato
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Enviar Convite
        </Button>
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar convites..."
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
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Convites Enviados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum convite encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece enviando convites para novos membros
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Enviar Primeiro Convite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
