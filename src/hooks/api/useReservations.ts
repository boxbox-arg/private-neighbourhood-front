import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getReservations,
  getReservationsCalendar,
  createReservation,
  cancelReservation,
  type CreateReservationRequest,
} from '@/api/services/reservations.service'

export function useReservations(params?: { space_id?: string }) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => getReservations(params),
  })
}

export function useReservationsCalendar(start: string, end: string) {
  return useQuery({
    queryKey: ['reservations', 'calendar', start, end],
    queryFn: () => getReservationsCalendar(start, end),
    enabled: !!start && !!end,
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReservationRequest) => createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export function useCancelReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}
