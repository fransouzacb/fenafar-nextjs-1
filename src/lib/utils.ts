import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de dados
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Validações
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validar dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  if (cleanCNPJ.length !== 14) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
  
  // Validar primeiro dígito verificador
  let sum = 0
  let weight = 2
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder
  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) return false
  
  // Validar segundo dígito verificador
  sum = 0
  weight = 2
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder
  if (secondDigit !== parseInt(cleanCNPJ.charAt(13))) return false
  
  return true
}

// Formatação de documentos
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '')
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

// Status helpers
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'ativo':
    case 'active':
    case 'success':
      return 'status-success'
    case 'inativo':
    case 'inactive':
    case 'error':
      return 'status-error'
    case 'pendente':
    case 'pending':
    case 'warning':
      return 'status-warning'
    case 'info':
      return 'status-info'
    default:
      return 'fenafar-secondary'
  }
}

export function getStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'ativo':
    case 'active':
      return 'Ativo'
    case 'inativo':
    case 'inactive':
      return 'Inativo'
    case 'pendente':
    case 'pending':
      return 'Pendente'
    case 'aceito':
    case 'accepted':
      return 'Aceito'
    case 'rejeitado':
    case 'rejected':
      return 'Rejeitado'
    default:
      return status
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// URL helpers
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
