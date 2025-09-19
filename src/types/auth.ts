import { UserRole } from '@prisma/client'

export interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: UserRole
  emailConfirmed: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
  sindicato?: {
    id: string
    name: string
    cnpj: string
    state: string
  } | null
  membro?: {
    id: string
    nome: string
    cpf: string
    cargo: string | null
    ativo: boolean
    sindicato: {
      id: string
      name: string
      cnpj: string
      state: string
    }
  } | null
}

export interface AuthUser extends User {}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

// Token payload interface
export interface TokenPayload {
  sub: string
  email: string
  role: UserRole
  iat: number
  exp: number
}

// Permission types
export type Permission = 
  | 'dashboard:read'
  | 'dashboard:write'
  | 'sindicatos:read'
  | 'sindicatos:write'
  | 'sindicatos:delete'
  | 'membros:read'
  | 'membros:write'
  | 'membros:delete'
  | 'documentos:read'
  | 'documentos:write'
  | 'documentos:delete'
  | 'convites:read'
  | 'convites:write'
  | 'convites:delete'
  | 'configuracoes:read'
  | 'configuracoes:write'

export interface RolePermissions {
  [UserRole.FENAFAR_ADMIN]: Permission[]
  [UserRole.SINDICATO_ADMIN]: Permission[]
  [UserRole.MEMBER]: Permission[]
}

export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.FENAFAR_ADMIN]: [
    'dashboard:read',
    'dashboard:write',
    'sindicatos:read',
    'sindicatos:write',
    'sindicatos:delete',
    'membros:read',
    'membros:write',
    'membros:delete',
    'documentos:read',
    'documentos:write',
    'documentos:delete',
    'convites:read',
    'convites:write',
    'convites:delete',
    'configuracoes:read',
    'configuracoes:write',
  ],
  [UserRole.SINDICATO_ADMIN]: [
    'dashboard:read',
    'sindicatos:read',
    'membros:read',
    'membros:write',
    'documentos:read',
    'documentos:write',
    'convites:read',
    'configuracoes:read',
  ],
  [UserRole.MEMBER]: [
    'dashboard:read',
    'membros:read',
    'documentos:read',
    'documentos:write',
  ],
}
