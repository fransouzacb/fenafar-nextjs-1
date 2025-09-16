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

  // Verificar token de autenticação
  const token = request.cookies.get('access_token')?.value
  
  if (!token) {
    // Redirecionar para login se não autenticado
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Decodificar token (implementação básica - em produção usar JWT verify)
    const userData = JSON.parse(atob(token.split('.')[1]))
    const userRole = userData.user_metadata?.role || 'MEMBER'
    
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
    response.headers.set('x-user-id', userData.sub)
    
    return response
    
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Token inválido, redirecionar para login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
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