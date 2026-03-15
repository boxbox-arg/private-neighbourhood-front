import { api } from '../axios'
import { API } from '../endpoints'
import type { User } from '@/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export function login(data: LoginRequest) {
  return api.post<LoginResponse>(API.AUTH.LOGIN, data).then((r) => r.data)
}

export function logout() {
  return api.post(API.AUTH.LOGOUT).then(() => undefined)
}

export function me() {
  return api.get<User>(API.AUTH.ME).then((r) => r.data)
}
