import { createFileRoute } from '@tanstack/react-router'
import { ScanPage } from '@/features/security/components/ScanPage'

export const Route = createFileRoute('/_security/scan')({
  component: ScanPage,
})
