'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SindicatoLayout } from '@/components/layouts/sindicato-layout'

export default function SindicatoPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    // Permitir acesso para SINDICATO_ADMIN e MEMBER
    if (user && !['SINDICATO_ADMIN', 'MEMBER'].includes(user.role)) {
      router.push('/admin')
      return
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || !['SINDICATO_ADMIN', 'MEMBER'].includes(user.role)) {
    return null
  }

  return <SindicatoLayout>{children}</SindicatoLayout>
}
