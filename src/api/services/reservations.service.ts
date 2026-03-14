import { api } from '../axios'
import { API } from '../endpoints'
import type { Reservation } from '@/types'

export interface CreateReservationRequest {
  space_id: string
  start_time: string
  end_time: string
}

export function getReservations(params?: { space_id?: string }) {
  const search = params ? new URLSearchParams(params).toString() : ''
  return api
    .get<Reservation[]>(`${API.RESERVATIONS.BASE}${search ? `?${search}` : ''}`)
    .then((r) => r.data)
}

export function getReservationsCalendar(start: string, end: string) {
  return api
    .get<Reservation[]>(`${API.RESERVATIONS.CALENDAR}?start=${start}&end=${end}`)
    .then((r) => r.data)
}

export function createReservation(data: CreateReservationRequest) {
  return api.post<Reservation>(API.RESERVATIONS.BASE, data).then((r) => r.data)
}

export function cancelReservation(id: string) {
  return api.delete(`${API.RESERVATIONS.BASE}/${id}`).then(() => undefined)
}
