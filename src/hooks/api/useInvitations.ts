import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getInvitations,
  getInvitationsAdmin,
  createInvitation,
  validateInvitation,
  scanInvitation,
  type CreateInvitationRequest,
  type ScanRequest,
} from '@/api/services/invitations.service'

export function useInvitations(admin = false) {
  return useQuery({
    queryKey: ['invitations', admin],
    queryFn: () => (admin ? getInvitationsAdmin() : getInvitations()),
  })
}

export function useCreateInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInvitationRequest) => createInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
    },
  })
}

export function useValidateInvitation(token: string | null) {
  return useQuery({
    queryKey: ['invitations', 'validate', token],
    queryFn: () => validateInvitation(token!),
    enabled: !!token,
  })
}

export function useScanInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ScanRequest) => scanInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      queryClient.invalidateQueries({ queryKey: ['access-logs'] })
    },
  })
}
