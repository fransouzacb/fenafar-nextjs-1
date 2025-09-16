"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: () => boolean
  isSindicatoAdmin: () => boolean
  isMember: () => boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = () => {
    return user?.user_metadata?.role === 'FENAFAR_ADMIN'
  }

  const isSindicatoAdmin = () => {
    return user?.user_metadata?.role === 'SINDICATO_ADMIN'
  }

  const isMember = () => {
    return user?.user_metadata?.role === 'MEMBER'
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    isAdmin,
    isSindicatoAdmin,
    isMember,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
