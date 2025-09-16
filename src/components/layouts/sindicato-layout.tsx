"use client"

import { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar"
import { 
  Users, 
  FileText, 
  Mail, 
  Settings, 
  LogOut,
  Menu,
  Building2
} from "lucide-react"

interface SindicatoLayoutProps {
  children: ReactNode
}

export function SindicatoLayout({ children }: SindicatoLayoutProps) {
  const { user, signOut } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/sindicato", icon: Menu },
    { name: "Membros", href: "/sindicato/membros", icon: Users },
    { name: "Documentos", href: "/sindicato/documentos", icon: FileText },
    { name: "Convites", href: "/sindicato/convites", icon: Mail },
    { name: "Configurações", href: "/sindicato/configuracoes", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Área do Sindicato
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "S"}
                        </span>
                      </div>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5 text-sm text-gray-700">
                    <div className="font-medium">{user?.user_metadata?.name || user?.email}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
            <div className="flex flex-col flex-grow">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
