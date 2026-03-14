export const APP_NAME = 'Barrio Privado'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const APP_URL = import.meta.env.VITE_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INVITATIONS: '/invitations',
  RESERVATIONS: '/reservations',
  PAYMENTS: '/payments',
  SCAN: '/scan',
  ADMIN: {
    USERS: '/admin/users',
    SPACES: '/admin/spaces',
    ACCESS_LOGS: '/admin/access-logs',
  },
} as const
