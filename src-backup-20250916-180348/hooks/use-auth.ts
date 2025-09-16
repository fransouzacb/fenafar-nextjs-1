"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  user_metadata: {
    role: string
    name?: string
  }
}

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  })

  useEffect(() => {
    // Verificar se há usuário no localStorage
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('user')
        const token = localStorage.getItem('access_token')
        
        if (userStr && token) {
          const user = JSON.parse(userStr)
          setAuthState({
            user,
            loading: false,
          })
        } else {
          setAuthState({
            user: null,
            loading: false,
          })
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setAuthState({
          user: null,
          loading: false,
        })
      }
    }

    // Verificar imediatamente
    checkAuth()

    // Escutar mudanças no localStorage (incluindo do mesmo tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'access_token') {
        checkAuth()
      }
    }

    // Escutar mudanças customizadas (do mesmo tab)
    const handleCustomStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth-change', handleCustomStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleCustomStorageChange)
    }
  }, [])

  const signOut = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    
    // Remover cookie também
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    
    setAuthState({
      user: null,
      loading: false,
    })
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new CustomEvent('auth-change'))
    
    // Redirecionar para login
    window.location.href = '/login'
  }

  const getUserRole = (): string | null => {
    return authState.user?.user_metadata?.role || null
  }

  const isAdmin = (): boolean => {
    const role = getUserRole()
    return role === "FENAFAR_ADMIN"
  }

  const isSindicatoAdmin = (): boolean => {
    const role = getUserRole()
    return role === "SINDICATO_ADMIN"
  }

  const isMember = (): boolean => {
    const role = getUserRole()
    return role === "MEMBER"
  }

  const redirectBasedOnRole = (): string => {
    const role = getUserRole()
    switch (role) {
      case 'FENAFAR_ADMIN':
        return '/admin'
      case 'SINDICATO_ADMIN':
        return '/sindicato/dashboard'
      case 'MEMBER':
        return '/perfil'
      default:
        return '/perfil'
    }
  }

  return {
    ...authState,
    signOut,
    getUserRole,
    isAdmin,
    isSindicatoAdmin,
    isMember,
    redirectBasedOnRole,
  }
}