import { useQuery } from '@tanstack/react-query'
import { getSpaces } from '@/api/services/spaces.service'

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: getSpaces,
  })
}
