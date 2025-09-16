"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Users, FileText, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SindicatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isSindicatoAdmin, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && !isSindicatoAdmin()) {
      router.push("/admin")
    }
  }, [user, loading, isSindicatoAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  if (!user) return null

  const navigation = [
    { name: "Dashboard", href: "/sindicato/dashboard", icon: Home },
    { name: "Membros", href: "/sindicato/membros", icon: Users },
    { name: "Documentos", href: "/sindicato/documentos", icon: FileText },
    { name: "Perfil", href: "/sindicato/dashboard/perfil", icon: User },
  ]

  const handleLogout = () => {
    signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center px-6 border-b">
                  <Link href="/sindicato" className="text-lg font-semibold">
                    FENAFAR Sindicato
                  </Link>
                </div>
                <nav className="flex flex-col p-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="size-5" />
                      {item.name}
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 transition-colors justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-5" />
                    Sair
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/sindicato" className="text-xl font-bold ml-4 hidden lg:block">
              FENAFAR Sindicato
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_metadata?.name || user.email}`} alt="Avatar" />
                    <AvatarFallback>
                      {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.name || user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 border-r bg-white p-4 hidden lg:block">
          <nav className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="size-5" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 transition-colors justify-start"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              Sair
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
