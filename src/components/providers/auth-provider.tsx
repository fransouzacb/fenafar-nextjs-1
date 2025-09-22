'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser, AuthState, AuthContextType, LoginRequest, RegisterRequest, TokenPayload } from '@/types/auth'
import { UserRole } from '@prisma/client'
import jwt from 'jsonwebtoken'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Verificar token no localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window === 'undefined') {
          setState({ user: null, isLoading: false, isAuthenticated: false })
          return
        }
        
            // Verificar token no localStorage ou cookies
            const token = localStorage.getItem('access_token') || 
                         document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1]
            
            if (!token) {
              setState({ user: null, isLoading: false, isAuthenticated: false })
              return
            }

        // Verificar se o token é válido
        const payload = jwt.decode(token) as TokenPayload
        if (!payload || payload.exp < Date.now() / 1000) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setState({ user: null, isLoading: false, isAuthenticated: false })
          return
        }

        // Buscar usuário no banco
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setState({ user: null, isLoading: false, isAuthenticated: false })
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error)
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      if (data.session) {
        const token = data.session.access_token
        const refreshToken = data.session.refresh_token

        // Salvar tokens em cookies para o middleware acessar
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token)
          localStorage.setItem('refresh_token', refreshToken)
          
          // Também salvar em cookies para o middleware
          document.cookie = `access_token=${token}; path=/; max-age=3600; secure; samesite=strict`
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=86400; secure; samesite=strict`
        }

        // Buscar dados do usuário
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
          })
          
          // Retornar o usuário para o componente de login
          return { user: userData }
        } else {
          throw new Error('Erro ao buscar dados do usuário')
        }
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        // Limpar cookies também
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
             cpf: (data as any).cpf,
             cargo: (data as any).cargo,
          }
        }
      })

      if (error) throw error

      setState(prev => ({ ...prev, isLoading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      if (typeof window === 'undefined') throw new Error('Refresh token não encontrado')
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) throw new Error('Refresh token não encontrado')

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error) throw error

      if (data.session) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.session.access_token)
          localStorage.setItem('refresh_token', data.session.refresh_token)
        }
        return data.session.access_token
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      await logout()
      throw error
    }
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (typeof window === 'undefined') throw new Error('Token não encontrado')
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('Token não encontrado')

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Erro ao atualizar perfil')

      const updatedUser = await response.json()
      setState(prev => ({
        ...prev,
        user: updatedUser.user
      }))
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
     login: login as any,
    logout,
    register,
     refreshToken: refreshToken as any,
    updateProfile,
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
