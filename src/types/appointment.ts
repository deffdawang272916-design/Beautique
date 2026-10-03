/**
 * Appointment Domain Model & Lifecycle Definitions
 * Beautique Aesthetics — Santa Rosa, Nueva Ecija
 */

export const APPOINTMENT_STATUSES = {
  PENDING_CONFIRMATION: 'pending_confirmation',
  CONFIRMED: 'confirmed',
  RESCHEDULE_PROPOSED: 'reschedule_proposed',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];

export const SMS_MESSAGE_TYPES = {
  REQUEST_RECEIVED: 'request_received',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed',
  RESCHEDULE_PROPOSED: 'reschedule_proposed',
  APPOINTMENT_DECLINED: 'appointment_declined',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
} as const;

export type SmsMessageType =
  (typeof SMS_MESSAGE_TYPES)[keyof typeof SMS_MESSAGE_TYPES];

export const SMS_DELIVERY_STATUSES = {
  NONE: 'none',
  QUEUED: 'queued',
  ACCEPTED: 'accepted',
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  UNKNOWN: 'unknown',
  MOCK: 'mock',
} as const;

export type SmsDeliveryStatus =
  (typeof SMS_DELIVERY_STATUSES)[keyof typeof SMS_DELIVERY_STATUSES];

export interface SmsEvent {
  eventId: string;
  appointmentId: string;
  messageType: SmsMessageType;
  provider: string;
  providerMessageId?: string | null;
  recipientMasked: string;
  messageBodyPreview: string;
  status: SmsDeliveryStatus;
  createdAt: string;
  updatedAt: string;
  failureReason?: string | null;
  deliveryReceiptReceivedAt?: string | null;
}

export interface StatusHistoryEntry {
  fromStatus: AppointmentStatus | null;
  toStatus: AppointmentStatus;
  changedAt: string;
  changedBy: 'customer' | 'staff' | 'system';
  staffNote?: string | null;
  reason?: string | null;
}

export interface AppointmentRecord {
  /** Internal collision-resistant UUID (Primary Key) */
  id: string;

  /** Human-facing tracking code (e.g. BT-APT-8275) */
  referenceCode: string;

  /** Cryptographically random secret token required for customer status lookup */
  statusToken: string;

  createdAt: string;
  updatedAt: string;

  // Customer Information
  clientName: string;
  mobileNumber: string; // Normalized E.164-compatible: +639XXXXXXXXX
  rawMobileInput?: string;
  email?: string | null;

  // Requested Treatment
  serviceId: string;
  serviceName: string;

  // Initial Requested Schedule
  preferredDate: string;
  preferredTime: string;

  // Customer Notes (Kept private, never included in SMS)
  skinConcerns?: string;

  // Lifecycle Status
  status: AppointmentStatus;

  // Staff Schedule Confirmation
  confirmedDate?: string | null;
  confirmedTime?: string | null;

  // Staff Schedule Reschedule Proposal
  proposedDate?: string | null;
  proposedTime?: string | null;

  // Internal Staff Notes (Never exposed to customer in status endpoints)
  staffNotes?: string | null;

  // Audit History
  statusHistory: StatusHistoryEntry[];

  // SMS Audit Trail
  smsStatus: SmsDeliveryStatus;
  smsEvents: SmsEvent[];

  // Clinic Location
  clinicLocation: string;
}

/** Public customer-safe appointment representation */
export interface PublicAppointmentStatus {
  referenceCode: string;
  status: AppointmentStatus;
  clientNameMasked: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  confirmedDate?: string | null;
  confirmedTime?: string | null;
  proposedDate?: string | null;
  proposedTime?: string | null;
  createdAt: string;
  updatedAt: string;
  smsStatus: SmsDeliveryStatus;
}

export interface CreateAppointmentDTO {
  fullName: string;
  phone: string;
  email?: string;
  treatmentId: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  skinConcerns?: string;
}

export interface StaffConfirmDTO {
  confirmedDate: string;
  confirmedTime: string;
  staffNotes?: string;
}

export interface StaffProposeScheduleDTO {
  proposedDate: string;
  proposedTime: string;
  staffNotes?: string;
}

export interface StaffDeclineDTO {
  reason?: string;
  staffNotes?: string;
}

export interface StaffCancelDTO {
  reason?: string;
  staffNotes?: string;
}
