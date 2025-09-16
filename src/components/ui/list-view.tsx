"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Grid, List, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline"
  }>
  avatar?: string
  metadata?: Array<{
    label: string
    value: string
  }>
}

interface ListViewProps {
  items: ListItem[]
  title: string
  description?: string
  searchable?: boolean
  filterable?: boolean
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, any>) => void
  emptyMessage?: string
  className?: string
}

export function ListView({
  items,
  title,
  description,
  searchable = true,
  filterable = true,
  viewMode = "list",
  onViewModeChange,
  onSearch,
  onFilter,
  emptyMessage = "Nenhum item encontrado",
  className
}: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map(item => item.id))
    }
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onViewModeChange && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          )}
          
          {filterable && (
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {selectedItems.length} selecionado(s)
            </span>
            <Button variant="outline" size="sm">
              Ações em lote
            </Button>
          </div>
        )}
      </div>

      {/* Lista de itens */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {emptyMessage}
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termos de busca
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          "space-y-4",
          viewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        )}>
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {item.avatar && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.avatar}
                          alt={item.title}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        {item.badge && (
                          <Badge variant={item.badge.variant || "default"}>
                            {item.badge.text}
                          </Badge>
                        )}
                      </div>
                      
                      {item.subtitle && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.subtitle}
                        </p>
                      )}
                      
                      {item.description && (
                        <p className="text-sm text-gray-500 mb-3">
                          {item.description}
                        </p>
                      )}
                      
                      {item.metadata && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          {item.metadata.map((meta, index) => (
                            <div key={index}>
                              <span className="font-medium">{meta.label}:</span> {meta.value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.actions && item.actions.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {item.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={action.onClick}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
