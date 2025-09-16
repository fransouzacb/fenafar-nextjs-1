import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'

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

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route))
}

function isClientProtectedRoute(pathname: string): boolean {
  return clientProtectedRoutes.some(route => pathname.startsWith(route))
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

  // Para todas as outras rotas, permitir acesso
  // A autenticação será feita no lado do cliente
  return NextResponse.next()
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
