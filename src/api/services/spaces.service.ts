import { api } from '../axios'
import { API } from '../endpoints'
import type { CommonSpace } from '@/types'

export function getSpaces() {
  return api.get<CommonSpace[]>(API.SPACES.BASE).then((r) => r.data)
}

export function getSpaceAvailability(id: string, start: string, end: string) {
  return api
    .get<{ available: boolean }>(`${API.SPACES.AVAILABILITY(id)}?start=${start}&end=${end}`)
    .then((r) => r.data)
}
