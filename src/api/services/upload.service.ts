import { api } from '../axios'
import { API } from '../endpoints'

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<{ url: string }>(API.UPLOAD, formData).then((r) => r.data)
}
