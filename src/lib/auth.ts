import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    const token = request.cookies.get('access_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.headers.get('x-access-token')

    if (!token) return null

    const payload = jwt.decode(token) as any
    if (!payload) return null

    // Verificar se o token expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null
    }

    const userId = payload.sub || payload.user_id
    if (!userId) return null

    // Debug temporário para membros
    if (payload.email === 'membro1@teste.com') {
      console.log('🔍 DEBUG MEMBRO - Token payload:', JSON.stringify(payload, null, 2))
      console.log('🔍 DEBUG MEMBRO - User ID extraído:', userId)
    }

    return {
      id: userId,
      email: payload.email || '',
      name: payload.user_metadata?.name || payload.name || '',
      role: payload.user_metadata?.role || payload.role || UserRole.MEMBER,
      active: payload.active !== false
    }
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return null
  }
}

export function hasRole(user: AuthUser | null, requiredRoles: UserRole[]): boolean {
  if (!user || !user.active) return false
  return requiredRoles.includes(user.role)
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user || !user.active) return false

  const permissions = {
    [UserRole.FENAFAR_ADMIN]: [
      'sindicatos:read',
      'sindicatos:write',
      'sindicatos:delete',
      'sindicatos:approve',
      'membros:read',
      'membros:write',
      'membros:delete',
      'documentos:read',
      'documentos:write',
      'documentos:delete',
      'convites:read',
      'convites:write',
      'convites:delete',
      'stats:read'
    ],
    [UserRole.SINDICATO_ADMIN]: [
      'sindicatos:read:own',
      'membros:read',
      'membros:write',
      'documentos:read',
      'documentos:write',
      'convites:read',
      'convites:write'
    ],
    [UserRole.MEMBER]: [
      'documentos:read',
      'profile:read',
      'profile:write'
    ]
  }

  return permissions[user.role]?.includes(permission) || false
}
