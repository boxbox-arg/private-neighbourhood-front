import { createFileRoute } from '@tanstack/react-router'
import { CreateInvitationPage } from '@/features/invitations/components/CreateInvitationPage'

export const Route = createFileRoute('/_authenticated/invitations/new')({
  component: CreateInvitationPage,
})
