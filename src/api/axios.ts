import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.accessToken ?? null
    }
  } catch {
    // ignore
  }
  return null
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message
    const status = error.response?.status
    const err = new Error(message) as Error & { status?: number; data?: unknown }
    err.status = status
    err.data = error.response?.data
    return Promise.reject(err)
  }
)

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
