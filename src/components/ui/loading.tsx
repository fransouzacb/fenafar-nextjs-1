'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-gray-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = 'Carregando...',
  className,
  disabled,
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {isLoading ? loadingText : children}
    </button>
  )
}

interface LoadingCardProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export function LoadingCard({
  isLoading,
  children,
  loadingText = 'Carregando...',
  className,
}: LoadingCardProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

interface LoadingTableProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  rows?: number
  className?: string
}

export function LoadingTable({
  isLoading,
  children,
  loadingText = 'Carregando dados...',
  rows = 5,
  className,
}: LoadingTableProps) {
  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{loadingText}</p>
          </div>
        </div>
        {/* Skeleton rows */}
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4 p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <>{children}</>
}

interface LoadingPageProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export function LoadingPage({
  isLoading,
  children,
  loadingText = 'Carregando página...',
  className,
}: LoadingPageProps) {
  if (isLoading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
