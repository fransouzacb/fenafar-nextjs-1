import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/register',
  '/recuperar-senha',
  '/redefinir-senha',
  '/api/auth/login',
  '/api/auth/register',
  '/api/convites/accept',
]

// Rotas que são protegidas pelo cliente (não pelo middleware)
const clientProtectedRoutes = [
  '/admin',
  '/dashboard',
  '/sindicato',
]

// Rotas que precisam de roles específicas
const roleRoutes = {
  '/admin': [UserRole.FENAFAR_ADMIN],
  '/dashboard': [UserRole.FENAFAR_ADMIN, UserRole.SINDICATO_ADMIN],
  '/sindicato': [UserRole.SINDICATO_ADMIN, UserRole.MEMBER],
  '/api/sindicatos': [UserRole.FENAFAR_ADMIN],
  '/api/convites': [UserRole.FENAFAR_ADMIN],
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

function verifyToken(token: string): { userId: string; role: UserRole } | null {
  try {
    const payload = jwt.decode(token) as any
    if (!payload || payload.exp < Date.now() / 1000) {
      return null
    }
    return {
      userId: payload.sub,
      role: payload.role as UserRole
    }
  } catch (error) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Permitir rotas protegidas pelo cliente (deixar o cliente fazer a verificação)
  if (isClientProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Verificar token de autenticação
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('access_token')?.value ||
                request.headers.get('x-access-token')

  if (!token) {
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

  // Verificar se o token é válido
  const tokenData = verifyToken(token)
  if (!tokenData) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar permissões por role
  const requiredRoles = getRequiredRole(pathname)
  if (requiredRoles && !requiredRoles.includes(tokenData.role)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Acesso negado. Permissões insuficientes.' },
        { status: 403 }
      )
    }
    
    // Redirecionar para página de acesso negado ou dashboard apropriado
    const redirectUrl = tokenData.role === UserRole.MEMBER ? '/sindicato' : '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Adicionar dados do usuário aos headers para uso nas API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', tokenData.userId)
  requestHeaders.set('x-user-role', tokenData.role)

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
