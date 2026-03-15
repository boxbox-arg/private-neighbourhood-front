export const API = {
  AUTH: {
    LOGIN: '/account/signin',
    LOGOUT: '/auth/logout',
    ME: '/account/me',
    REFRESH: '/auth/refresh',
  },
  INVITATIONS: {
    BASE: '/invitations',
    ALL: '/invitations/all',
    VALIDATE: (token: string) => `/invitations/validate/${token}`,
    SCAN: '/invitations/scan',
  },
  SPACES: {
    BASE: '/spaces',
    BY_ID: (id: string) => `/spaces/${id}`,
    AVAILABILITY: (id: string) => `/spaces/${id}/availability`,
  },
  RESERVATIONS: {
    BASE: '/reservations',
    CALENDAR: '/reservations/calendar',
  },
  PAYMENTS: {
    BASE: '/payments',
    RECEIPT: (id: string) => `/payments/${id}/receipt`,
  },
  ACCESS_LOGS: '/access-logs',
  USERS: '/users',
  WORKERS: '/workers',
  UPLOAD: '/upload',
} as const
