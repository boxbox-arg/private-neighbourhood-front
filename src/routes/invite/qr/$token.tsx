import { createFileRoute } from '@tanstack/react-router'
import { InviteQRPage } from '@/features/invitations/components/InviteQRPage'

export const Route = createFileRoute('/invite/qr/$token')({
  component: InviteQRPage,
})
