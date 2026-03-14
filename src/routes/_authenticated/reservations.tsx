import { createFileRoute } from '@tanstack/react-router'
import { ReservationsPage } from '@/features/reservations/components/ReservationsPage'

export const Route = createFileRoute('/_authenticated/reservations')({
  component: ReservationsPage,
})
