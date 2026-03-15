import { useAuthStore } from '@/store/auth.store'
import QRCode from 'react-qr-code'
import { LogOut, Clock, User } from 'lucide-react'
import { useLogout } from '@/hooks/api/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SERVICE_LABELS: Record<string, string> = {
  GARDENER: 'Jardinero',
  CLEANER: 'Limpieza',
  ELECTRICIAN: 'Electricista',
  PLUMBER: 'Plomero',
  PAINTER: 'Pintor',
  OTHER: 'Otro',
}

export function WorkerQRPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()

  if (!user || user.role !== 'SERVICES') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No tienes acceso a esta página</p>
      </div>
    )
  }

  const qrUrl =
    typeof window !== 'undefined' && user.email
      ? `${window.location.origin}/worker/qr/${encodeURIComponent(user.email)}`
      : ''

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => navigate({ to: '/login' }) })
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Mi QR de Acceso</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <User className="h-5 w-5" />
              {(user as any).service_type ? SERVICE_LABELS[(user as any).service_type] || 'Worker' : 'Worker'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium">{user.name}</p>
            
            {(user as any).schedule && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Horario: {(user as any).schedule.entry_time} - {(user as any).schedule.exit_time}
                </span>
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center">
              Mostrá este QR en el acceso para ingresar
            </p>

            <div className="p-6 bg-white rounded-xl shadow-lg border">
              <QRCode value={qrUrl} size={200} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
