import { api } from '../axios'
import { API } from '../endpoints'
import type { Invitation } from '@/types'

export interface CreateInvitationRequest {
  max_guests: number
  expires_at: string
}

export interface ScanRequest {
  qr_token: string
  guest_name: string
}

export interface ScanResponse {
  success: boolean
  message: string
  validation_result: 'VALID' | 'EXPIRED' | 'NO_CAPACITY' | 'INVALID_TOKEN'
}

export function getInvitations() {
  return api.get<Invitation[]>(API.INVITATIONS.BASE).then((r) => r.data)
}

export function getInvitationsAdmin() {
  return api.get<Invitation[]>(API.INVITATIONS.ALL).then((r) => r.data)
}

export function createInvitation(data: CreateInvitationRequest) {
  return api.post<Invitation>(API.INVITATIONS.BASE, data).then((r) => r.data)
}

export function validateInvitation(token: string) {
  return api.get<{ valid: boolean }>(API.INVITATIONS.VALIDATE(token)).then((r) => r.data)
}

export function scanInvitation(data: ScanRequest) {
  return api.post<ScanResponse>(API.INVITATIONS.SCAN, data).then((r) => r.data)
}
