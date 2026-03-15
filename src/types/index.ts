export type Role = 'ADMIN' | 'RESIDENT' | 'SECURITY' | 'SERVICES'

export type WorkerServiceType = 'GARDENER' | 'CLEANER' | 'ELECTRICIAN' | 'PLUMBER' | 'PAINTER' | 'OTHER'

export type WorkerSchedule = {
  entry_time: string
  exit_time: string
}

export interface Worker extends User {
  role: 'SERVICES'
  service_type: WorkerServiceType
  schedule: WorkerSchedule
  qr_token?: string
}
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
export type InvitationStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED'
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type ValidationResult = 'VALID' | 'EXPIRED' | 'NO_CAPACITY' | 'INVALID_TOKEN'

export interface User {
  id: string
  name?: string
  fullName?: string | null
  email: string
  phone?: string
  house_number?: string
  role?: string
  status?: UserStatus
  isActive?: boolean | null
  created_at?: string
  updated_at?: string
}

export interface Invitation {
  id: string
  resident_id: string
  max_guests: number
  used_guests: number
  expires_at: string
  qr_token: string
  status: InvitationStatus
  created_at: string
  updated_at?: string
}

export interface AccessLog {
  id: string
  invitation_id: string
  guest_name: string
  scanned_by_security_id: string
  timestamp: string
  validation_result?: ValidationResult
}

export interface CommonSpace {
  id: string
  name: string
  description?: string
  max_hours: number
}

export interface Reservation {
  id: string
  resident_id: string
  space_id: string
  start_time: string
  end_time: string
  status: ReservationStatus
  created_at: string
  updated_at?: string
  space?: CommonSpace
}

export interface Payment {
  id: string
  resident_id: string
  amount: number
  date: string
  description?: string
  receipt_url?: string
  created_by?: string
  created_at: string
  updated_at?: string
}
