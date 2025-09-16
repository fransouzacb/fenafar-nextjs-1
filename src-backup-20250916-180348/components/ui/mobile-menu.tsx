"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    current?: boolean
  }>
  onLogout: () => void
  user?: {
    name?: string
    email?: string
  }
  className?: string
}

export function MobileMenu({ 
  navigation, 
  onLogout, 
  user, 
  className 
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("lg:hidden", className)}
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.current
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          
          <div className="border-t pt-4 mt-4">
            {user && (
              <div className="px-3 py-2 mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || "Usuário"}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onLogout()
                setOpen(false)
              }}
            >
              Sair
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

// Componente de menu mobile específico para cada área
export function AdminMobileMenu({ onLogout, user }: { onLogout: () => void; user?: any }) {
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Menu },
    { name: "Usuários", href: "/admin/users", icon: Menu },
    { name: "Sindicatos", href: "/admin/sindicatos", icon: Menu },
    { name: "Documentos", href: "/admin/documentos", icon: Menu },
  ]

  return <MobileMenu navigation={navigation} onLogout={onLogout} user={user} />
}

export function SindicatoMobileMenu({ onLogout, user }: { onLogout: () => void; user?: any }) {
  const navigation = [
    { name: "Dashboard", href: "/sindicato", icon: Menu },
    { name: "Membros", href: "/sindicato/membros", icon: Menu },
    { name: "Documentos", href: "/sindicato/documentos", icon: Menu },
  ]

  return <MobileMenu navigation={navigation} onLogout={onLogout} user={user} />
}

export function MembroMobileMenu({ onLogout, user }: { onLogout: () => void; user?: any }) {
  const navigation = [
    { name: "Dashboard", href: "/membro", icon: Menu },
    { name: "Perfil", href: "/membro/perfil", icon: Menu },
    { name: "Documentos", href: "/membro/documentos", icon: Menu },
    { name: "Configurações", href: "/membro/configuracoes", icon: Menu },
  ]

  return <MobileMenu navigation={navigation} onLogout={onLogout} user={user} />
}
