import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogout } from '@/hooks/api/useAuth'
import { useScanInvitation } from '@/hooks/api/useInvitations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { scanSchema } from '@/utils/validators'
import type { z } from 'zod'
import { ScanLine, CheckCircle, XCircle, AlertCircle, LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

type ScanForm = z.infer<typeof scanSchema>

type ResultState = 'idle' | 'success' | 'error' | 'expired' | 'no_capacity'

export function ScanPage() {
  const [result, setResult] = useState<ResultState>('idle')
  const [message, setMessage] = useState('')
  const scan = useScanInvitation()
  const logout = useLogout()
  const navigate = useNavigate()

  const form = useForm<ScanForm>({
    resolver: zodResolver(scanSchema),
    defaultValues: { qr_token: '', guest_name: '' },
  })

  const onSubmit = form.handleSubmit((data) => {
    const token = data.qr_token.trim()
    if (!token) return
    setResult('idle')
    scan.mutate(
      { qr_token: token, guest_name: data.guest_name },
      {
        onSuccess: (res) => {
          if (res.validation_result === 'VALID') {
            setResult('success')
            setMessage('Acceso permitido')
            form.reset()
          } else if (res.validation_result === 'EXPIRED') {
            setResult('expired')
            setMessage('Invitación expirada')
          } else if (res.validation_result === 'NO_CAPACITY') {
            setResult('no_capacity')
            setMessage('Sin cupo disponible')
          } else {
            setResult('error')
            setMessage(res.message ?? 'QR inválido')
          }
        },
        onError: (err: Error) => {
          setResult('error')
          setMessage((err as { data?: { message?: string } })?.data?.message ?? err.message)
        },
      }
    )
  })

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => navigate({ to: '/login' }) })
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Validar acceso</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Escanear QR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr_token">Token del QR (o escaneá y pegá)</Label>
              <Input
                id="qr_token"
                placeholder="8a7d91a2-32b1-4e3a-9c8c-0a1b2d3e4f5g"
                autoComplete="off"
                {...form.register('qr_token')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest_name">Nombre del invitado</Label>
              <Input
                id="guest_name"
                placeholder="Juan Pérez"
                {...form.register('guest_name')}
              />
            </div>
            <Button type="submit" className="w-full" disabled={scan.isPending}>
              {scan.isPending ? 'Validando...' : 'Validar'}
            </Button>
          </form>

          {result !== 'idle' && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                result === 'success'
                  ? 'bg-green-500/20 text-green-600'
                  : result === 'expired' || result === 'error'
                    ? 'bg-red-500/20 text-red-600'
                    : 'bg-yellow-500/20 text-yellow-600'
              }`}
            >
              {result === 'success' && <CheckCircle className="h-8 w-8 shrink-0" />}
              {(result === 'expired' || result === 'error') && (
                <XCircle className="h-8 w-8 shrink-0" />
              )}
              {result === 'no_capacity' && (
                <AlertCircle className="h-8 w-8 shrink-0" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
