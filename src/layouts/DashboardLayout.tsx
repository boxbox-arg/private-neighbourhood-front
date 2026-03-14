import { Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/hooks/api/useAuth'
import { Button } from '@/components/ui/button'
import {
  Home,
  QrCode,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Inicio', icon: Home },
  { to: '/invitations', label: 'Invitaciones', icon: QrCode },
  { to: '/reservations', label: 'Reservas', icon: Calendar },
  { to: '/payments', label: 'Pagos', icon: CreditCard },
]

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate({ to: '/login' }),
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">{user?.name ?? 'Barrio Privado'}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        {menuOpen && (
          <nav className="md:hidden border-t p-4 flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <div className="flex flex-1">
        <aside className={cn(
          'hidden md:flex md:w-48 md:flex-col md:fixed md:inset-y-0 md:pt-14 border-r',
          menuOpen && 'md:flex'
        )}>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                activeProps={{ className: 'bg-accent' }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:pl-52">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
