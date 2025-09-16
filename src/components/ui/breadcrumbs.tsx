"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Início
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    item.current
                      ? "text-gray-500"
                      : "text-gray-700 hover:text-blue-600"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Hook para gerar breadcrumbs automaticamente baseado na rota
export function useBreadcrumbs(pathname: string) {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const breadcrumbMap: Record<string, string> = {
    'admin': 'Dashboard Admin',
    'sindicato': 'Área do Sindicato',
    'membro': 'Área do Membro',
    'perfil': 'Perfil',
    'documentos': 'Documentos',
    'configuracoes': 'Configurações',
    'membros': 'Membros',
    'sindicatos': 'Sindicatos',
    'convites': 'Convites',
    'users': 'Usuários'
  }

  const items: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    
    return {
      label: breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : href,
      current: isLast
    }
  })

  return items
}
