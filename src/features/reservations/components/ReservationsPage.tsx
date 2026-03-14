import { useReservations } from '@/hooks/api/useReservations'
import { useSpaces } from '@/hooks/api/useSpaces'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ReservationsPage() {
  const { data: reservations, isLoading } = useReservations()
  const { data: spaces } = useSpaces()

  const getSpaceName = (id: string) =>
    spaces?.find((s) => s.id === id)?.name ?? id

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reservas</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : reservations?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No tenés reservas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations?.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <span className="font-medium">{getSpaceName(r.space_id)}</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {r.status.toLowerCase()}
                </span>
              </CardHeader>
              <CardContent>
                <p>
                  {new Date(r.start_time).toLocaleString('es-AR')} –{' '}
                  {new Date(r.end_time).toLocaleString('es-AR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
