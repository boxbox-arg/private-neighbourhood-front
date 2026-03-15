import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  validateWorkerQR,
  scanWorker,
  type CreateWorkerRequest,
  type UpdateWorkerRequest,
} from '@/api/services/workers.service'

export function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers,
  })
}

export function useWorker(id: string) {
  return useQuery({
    queryKey: ['workers', id],
    queryFn: () => getWorkerById(id),
    enabled: !!id,
  })
}

export function useCreateWorker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkerRequest) => createWorker(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] })
    },
  })
}

export function useUpdateWorker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkerRequest }) => updateWorker(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workers'] })
      queryClient.invalidateQueries({ queryKey: ['workers', id] })
    },
  })
}

export function useDeleteWorker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] })
    },
  })
}

export function useValidateWorkerQR() {
  return useMutation({
    mutationFn: (token: string) => validateWorkerQR(token),
  })
}

export function useScanWorker() {
  return useMutation({
    mutationFn: (data: { qr_token: string }) => scanWorker(data),
  })
}
