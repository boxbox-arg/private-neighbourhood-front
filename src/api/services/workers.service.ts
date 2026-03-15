import { api } from '../axios'
import { API } from '../endpoints'
import type { Worker, WorkerServiceType, WorkerSchedule } from '@/types'

export interface CreateWorkerRequest {
  name: string
  email: string
  phone?: string
  service_type: WorkerServiceType
  schedule: WorkerSchedule
}

export interface UpdateWorkerRequest extends Partial<CreateWorkerRequest> {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export function getWorkers() {
  return api.get<Worker[]>(API.WORKERS).then((r) => r.data)
}

export function getWorkerById(id: string) {
  return api.get<Worker>(`${API.WORKERS}/${id}`).then((r) => r.data)
}

export function createWorker(data: CreateWorkerRequest) {
  return api.post<Worker>(API.WORKERS, data).then((r) => r.data)
}

export function updateWorker(id: string, data: UpdateWorkerRequest) {
  return api.put<Worker>(`${API.WORKERS}/${id}`, data).then((r) => r.data)
}

export function deleteWorker(id: string) {
  return api.delete(`${API.WORKERS}/${id}`).then((r) => r.data)
}

export function validateWorkerQR(token: string) {
  return api.get<{ valid: boolean; worker?: Worker }>(`${API.WORKERS}/validate/${token}`).then((r) => r.data)
}

export function scanWorker(data: { qr_token: string }) {
  return api.post<{
    success: boolean
    message: string
    validation_result: 'VALID' | 'OUT_OF_HOURS' | 'INVALID_TOKEN'
  }>(`${API.WORKERS}/scan`, data).then((r) => r.data)
}
