'use client'

import { useAuthSimple } from '@/hooks/use-auth-simple'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SindicatoLayout } from '@/components/layouts/sindicato-layout'

export default function SindicatoPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, authLoading } = useAuthSimple()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role !== 'SINDICATO_ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || user.role !== 'SINDICATO_ADMIN') {
    return null
  }

  return <SindicatoLayout>{children}</SindicatoLayout>
}
