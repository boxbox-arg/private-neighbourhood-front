import { usePayments } from '@/hooks/api/usePayments'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function PaymentsPage() {
  const { data: payments, isLoading } = usePayments()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pagos</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : payments?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No hay pagos registrados
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments?.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row justify-between">
                <span className="font-medium">${p.amount.toLocaleString('es-AR')}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(p.date).toLocaleDateString('es-AR')}
                </span>
              </CardHeader>
              {p.description && (
                <CardContent>
                  <p className="text-sm">{p.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
