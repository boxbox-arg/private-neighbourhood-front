import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth.store'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (!user || user.role === 'SECURITY') throw redirect({ to: '/login' })
  },
  component: DashboardLayout,
})
