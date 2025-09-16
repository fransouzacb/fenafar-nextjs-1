'use client'

import { LoginForm } from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-display text-fenafar-primary">FENAFAR</h1>
          <p className="text-caption mt-2">Sistema de Gestão</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
