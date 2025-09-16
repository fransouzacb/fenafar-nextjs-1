import { redirect } from 'next/navigation'

export default function HomePage() {
  // Por enquanto, redirecionar para login
  // Em produção, isso seria baseado na autenticação
  redirect('/login')
}
