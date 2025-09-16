import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/login',
  '/register', 
  '/recuperar-senha',
  '/redefinir-senha',
  '/convites/aceitar'
]

// Rotas protegidas por role
const roleBasedRoutes = {
  '/admin': ['FENAFAR_ADMIN'],
  '/dashboard': ['FENAFAR_ADMIN'],
  '/sindicatos': ['FENAFAR_ADMIN'],
  '/membros': ['FENAFAR_ADMIN'],
  '/documentos': ['FENAFAR_ADMIN'],
  '/convites': ['FENAFAR_ADMIN'],
  '/configuracoes': ['FENAFAR_ADMIN'],
  '/sindicato': ['SINDICATO_ADMIN', 'MEMBER'],
  '/perfil': ['SINDICATO_ADMIN', 'MEMBER']
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se é rota pública
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Verificar token de autenticação (cookies primeiro, depois Authorization header)
  let token = request.cookies.get('access_token')?.value
  
  if (!token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }
  
  if (!token) {
    // Redirecionar para login se não autenticado
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verificar se o token é válido (JWT do Supabase)
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Token inválido')
    }
    
    // Decodificar payload do JWT
    const payload = JSON.parse(atob(parts[1]))
    
    // Verificar se o token não expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expirado')
    }
    
    // Obter role do user_metadata (Supabase)
    const userRole = payload.user_metadata?.role || 'MEMBER'
    
    // Verificar permissões baseadas em role
    for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirecionar baseado na role do usuário
          const redirectUrl = getRedirectUrlForRole(userRole, request.url)
          return NextResponse.redirect(redirectUrl)
        }
        break
      }
    }
    
    // Adicionar headers com informações do usuário para as páginas
    const response = NextResponse.next()
    response.headers.set('x-user-role', userRole)
    response.headers.set('x-user-id', payload.sub || payload.user_id)
    
    return response
    
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Token inválido, redirecionar para login
    const loginUrl = new URL('/login', request.url)
    // Remover cookie inválido
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('access_token')
    return response
  }
}

function getRedirectUrlForRole(role: string, requestUrl: string): URL {
  switch (role) {
    case 'FENAFAR_ADMIN':
      return new URL('/admin', requestUrl)
    case 'SINDICATO_ADMIN':
      return new URL('/sindicato/dashboard', requestUrl)
    case 'MEMBER':
      return new URL('/perfil', requestUrl)
    default:
      return new URL('/login', requestUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (e.g. /public/images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}