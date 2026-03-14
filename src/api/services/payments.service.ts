import { api } from '../axios'
import { API } from '../endpoints'
import type { Payment } from '@/types'

export interface CreatePaymentRequest {
  resident_id: string
  amount: number
  date: string
  description?: string
  receipt?: File
}

export function getPayments(params?: { resident_id?: string }) {
  const search = params ? new URLSearchParams(params).toString() : ''
  return api
    .get<Payment[]>(`${API.PAYMENTS.BASE}${search ? `?${search}` : ''}`)
    .then((r) => r.data)
}

export function createPayment(data: CreatePaymentRequest) {
  const formData = new FormData()
  formData.append('resident_id', data.resident_id)
  formData.append('amount', String(data.amount))
  formData.append('date', data.date)
  if (data.description) formData.append('description', data.description)
  if (data.receipt) formData.append('receipt', data.receipt)
  return api.post<Payment>(API.PAYMENTS.BASE, formData).then((r) => r.data)
}
