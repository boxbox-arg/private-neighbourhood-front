import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Calendar, CreditCard } from 'lucide-react'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const quickActions = [
    { to: '/invitations/new', label: 'Generar invitación', icon: QrCode },
    { to: '/reservations', label: 'Reservar espacio', icon: Calendar },
    { to: '/payments', label: 'Ver pagos', icon: CreditCard },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hola, {user?.name}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <Icon className="h-8 w-8 mb-2" />
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" size="sm">
                  Ir
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
