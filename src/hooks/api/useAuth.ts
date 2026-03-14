import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { me, login, logout, type LoginRequest } from '@/api/services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export function useMe() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await me()
      const stored = localStorage.getItem('auth-storage')
      const token = stored ? JSON.parse(stored)?.state?.accessToken : null
      if (token) setAuth(user, token)
      return user
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (res) => {
      setAuth(res.user, res.access_token)
      queryClient.setQueryData(['auth', 'me'], res.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}
