import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/use-auth'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema FENAFAR',
  description: 'Sistema de gestão para sindicatos e membros da FENAFAR',
  keywords: ['FENAFAR', 'Sindicatos', 'Farmacêuticos', 'Gestão'],
  authors: [{ name: 'FENAFAR' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--fenafar-card))',
                color: 'hsl(var(--fenafar-card-foreground))',
                border: '1px solid hsl(var(--fenafar-border))',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
