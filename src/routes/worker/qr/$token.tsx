import { createFileRoute } from '@tanstack/react-router'
import { WorkerQRPublicPage } from '@/features/workers/components/WorkerQRPublicPage'

export const Route = createFileRoute('/worker/qr/$token')({
  component: WorkerQRPublicPage,
})
