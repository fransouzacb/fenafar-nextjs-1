import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'
import { getAuthUser, hasRole } from '@/lib/auth'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/recuperar-senha',
  '/redefinir-senha',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/convites/accept',
]

// Rotas que são protegidas pelo cliente (não pelo middleware)
const clientProtectedRoutes = [
  '/api/auth/me', // Permitir que o cliente gerencie a autenticação
  '/api/auth/logout', // Permitir logout
]

// Rotas que precisam de roles específicas
const roleRoutes = {
  '/admin': [UserRole.FENAFAR_ADMIN],
  '/dashboard': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN],
  '/sindicato': [UserRole.SINDICATO_ADMIN, UserRole.MEMBER],
  '/sindicatos': [UserRole.FENAFAR_ADMIN],
  '/membros': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN],
  '/documentos': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN, UserRole.MEMBER],
  '/convites': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN],
  '/api/sindicatos': [UserRole.FENAFAR_ADMIN],
  '/api/membros': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN],
  '/api/documentos': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN, UserRole.MEMBER],
  '/api/convites': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN],
  '/api/stats': [UserRole.FENAFAR_ADMIN],
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route))
}

function isClientProtectedRoute(pathname: string): boolean {
  return clientProtectedRoutes.some(route => pathname.startsWith(route))
}

function getRequiredRole(pathname: string): UserRole[] | null {
  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      return roles
    }
  }
  return null
}


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Permitir rotas protegidas pelo cliente
  if (isClientProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Obter usuário autenticado
  const user = getAuthUser(request)

  if (!user) {
    // Redirecionar para login se não estiver autenticado
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar permissões por role
  const requiredRoles = getRequiredRole(pathname)
  if (requiredRoles && !hasRole(user, requiredRoles)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Acesso negado. Permissões insuficientes.' },
        { status: 403 }
      )
    }
    
    // Redirecionar para dashboard apropriado baseado na role
    const redirectUrl = user.role === UserRole.MEMBER ? '/sindicato' : '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Adicionar dados do usuário aos headers para uso nas API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', user.id)
  requestHeaders.set('x-user-role', user.role)
  requestHeaders.set('x-user-email', user.email)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
