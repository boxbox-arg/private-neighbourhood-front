import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getPayments,
  createPayment,
  type CreatePaymentRequest,
} from '@/api/services/payments.service'

export function usePayments(params?: { resident_id?: string }) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => getPayments(params),
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
