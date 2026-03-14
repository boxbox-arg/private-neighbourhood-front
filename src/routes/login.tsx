import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/features/auth/components/LoginPage'

export const Route = createFileRoute('/login')({
  component: () => (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  ),
})
