'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Users, 
  FileText, 
  Mail, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react'

interface SindicatoLayoutProps {
  children: React.ReactNode
}

export function SindicatoLayout({ children }: SindicatoLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const getNavigation = () => {
    const baseNavigation = [
      { name: 'Dashboard', href: '/sindicato', icon: Building2, roles: ['SINDICATO_ADMIN', 'MEMBER'] },
      { name: 'Documentos', href: '/sindicato/documentos', icon: FileText, roles: ['SINDICATO_ADMIN', 'MEMBER'] },
      { name: 'Perfil', href: '/sindicato/perfil', icon: User, roles: ['SINDICATO_ADMIN', 'MEMBER'] },
    ]

    // Apenas SINDICATO_ADMIN pode ver estas funcionalidades
    if (user?.role === 'SINDICATO_ADMIN') {
      baseNavigation.push(
        { name: 'Membros', href: '/sindicato/membros', icon: Users, roles: ['SINDICATO_ADMIN'] },
        { name: 'Convites', href: '/sindicato/convites', icon: Mail, roles: ['SINDICATO_ADMIN'] },
        { name: 'Configurações', href: '/sindicato/configuracoes', icon: Settings, roles: ['SINDICATO_ADMIN'] }
      )
    }

    return baseNavigation
  }

  const navigation = getNavigation()

  const isActive = (href: string) => {
    if (href === '/sindicato') {
      return pathname === '/sindicato'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Sindicato</h1>
                <p className="text-xs text-gray-500">
                  {user?.role === 'SINDICATO_ADMIN' ? 'Painel Administrativo' : 'Painel do Membro'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
