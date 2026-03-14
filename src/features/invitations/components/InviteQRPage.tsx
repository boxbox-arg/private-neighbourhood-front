import { useParams } from '@tanstack/react-router'
import QRCode from 'react-qr-code'

export function InviteQRPage() {
  const { token } = useParams({ strict: false })
  const url =
    typeof window !== 'undefined' && token
      ? `${window.location.origin}/invite/qr/${token}`
      : ''

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-4">Invitación válida</h1>
      <p className="text-muted-foreground text-center mb-6">
        Mostrá este QR en el acceso para ingresar
      </p>
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <QRCode value={url} size={256} />
      </div>
    </div>
  )
}
