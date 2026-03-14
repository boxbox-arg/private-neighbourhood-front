import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth.store'
import { SecurityLayout } from '@/layouts/SecurityLayout'

export const Route = createFileRoute('/_security')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (!user || user.role !== 'SECURITY') throw redirect({ to: '/login' })
  },
  component: SecurityLayout,
})
