import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateInvitation } from '@/hooks/api/useInvitations'
import { createInvitationSchema } from '@/utils/validators'
import { APP_URL } from '@/lib/constants'
import type { z } from 'zod'
import { useState } from 'react'

type FormData = z.infer<typeof createInvitationSchema>

export function CreateInvitationPage() {
  const navigate = useNavigate()
  const createInvitation = useCreateInvitation()
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const form = useForm<FormData>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      max_guests: 6,
      expires_at: '',
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    createInvitation.mutate(data, {
      onSuccess: (inv) => {
        setQrUrl(`${APP_URL}/invite/qr/${inv.qr_token}`)
      },
    })
  })

  if (qrUrl) {
    return (
      <div className="space-y-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold">Invitación creada</h1>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Compartí este QR con tus invitados
            </p>
            <div className="p-4 bg-white rounded-lg">
              <QRCode value={qrUrl} size={200} />
            </div>
            <Button onClick={() => navigate({ to: '/invitations' })}>
              Volver a invitaciones
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-sm">
      <h1 className="text-2xl font-bold">Nueva invitación</h1>
      <Card>
        <CardHeader>
          <CardTitle>Datos de la invitación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max_guests">Cantidad máxima de invitados</Label>
              <Input
                id="max_guests"
                type="number"
                min={1}
                max={50}
                {...form.register('max_guests')}
              />
              {form.formState.errors.max_guests && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.max_guests.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">Fecha de expiración</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                {...form.register('expires_at')}
              />
              {form.formState.errors.expires_at && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.expires_at.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createInvitation.isPending}
            >
              {createInvitation.isPending ? 'Creando...' : 'Generar QR'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
