import { Link } from '@tanstack/react-router'
import { useInvitations } from '@/hooks/api/useInvitations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export function InvitationsPage() {
  const { data: invitations, isLoading } = useInvitations()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invitaciones</h1>
        <Link to="/invitations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva invitación
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : invitations?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No tenés invitaciones. Creá una para compartir con tus invitados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations?.map((inv) => (
            <Card key={inv.id}>
              <CardHeader className="pb-2">
                <span className="text-sm text-muted-foreground">
                  {inv.used_guests}/{inv.max_guests} invitados usados
                </span>
              </CardHeader>
              <CardContent>
                <p>
                  Expira: {new Date(inv.expires_at).toLocaleDateString('es-AR')}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {inv.status.toLowerCase()}
                </p>
                <Link to="/invite/qr/$token" params={{ token: inv.qr_token }}>
                  <Button variant="outline" size="sm" className="mt-2">
                    Ver QR
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
