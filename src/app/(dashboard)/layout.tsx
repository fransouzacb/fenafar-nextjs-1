import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface DashboardPageLayoutProps {
  children: React.ReactNode
}

export default function DashboardPageLayout({ children }: DashboardPageLayoutProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
