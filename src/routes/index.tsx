import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth.store'

export const Route = createFileRoute('/')({
  component: () => null, // Redirect happens in beforeLoad
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (!user) throw redirect({ to: '/login' })
    if (user.role === 'SECURITY') throw redirect({ to: '/scan' })
    throw redirect({ to: '/dashboard' })
  },
})
