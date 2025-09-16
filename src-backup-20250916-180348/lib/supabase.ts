import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente singleton para o frontend
let supabaseClient: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Desabilitar persistência para evitar problemas
        autoRefreshToken: false, // Desabilitar refresh automático
        detectSessionInUrl: false // Desabilitar detecção de URL
      }
    })
  }
  return supabaseClient
})()

// Cliente admin (apenas servidor)
export const supabaseAdmin = typeof window !== 'undefined' 
  ? supabase 
  : createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey)

// Função de login direta com fetch (fallback)
export const loginWithFetch = async (email: string, password: string) => {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Login failed: ${response.status} - ${error}`)
  }

  return response.json()
}
