import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export const createInvitationSchema = z.object({
  max_guests: z.coerce.number().min(1).max(50),
  expires_at: z.string().min(1, 'Fecha requerida'),
})

export const scanSchema = z.object({
  qr_token: z.string().min(1, 'Token requerido'),
  guest_name: z.string().min(1, 'Nombre del invitado requerido'),
})
