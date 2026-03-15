import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth.store'
import { WorkerQRPage } from '@/features/workers/components/WorkerQRPage'

export const Route = createFileRoute('/worker')({
  component: WorkerDashboard,
})

function WorkerDashboard() {
  const user = useAuthStore(s => s.user)
  
  if (!user || user.role !== 'SERVICES') {
    return <div>Acceso denegado</div>
  }
  
  return <WorkerQRPage />
}
