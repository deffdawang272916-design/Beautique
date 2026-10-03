import { SmsMessageType, SmsDeliveryStatus } from '../../src/types/appointment.ts';

export interface SmsSendPayload {
  to: string; // Normalized E.164 (+639XXXXXXXXX)
  text: string;
  messageType: SmsMessageType;
  appointmentRef: string;
  idempotencyKey?: string;
}

export interface SmsSendResult {
  success: boolean;
  status: SmsDeliveryStatus;
  provider: string;
  providerMessageId?: string | null;
  failureReason?: string | null;
  isMock: boolean;
  timestamp: string;
}

export interface SmsDeliveryReport {
  providerMessageId: string;
  status: SmsDeliveryStatus;
  deliveredAt?: string;
  rawPayload?: any;
}

export interface ISmsProvider {
  readonly name: string;
  readonly isConfigured: boolean;
  sendMessage(payload: SmsSendPayload): Promise<SmsSendResult>;
  parseDeliveryReceipt?(payload: any): SmsDeliveryReport | null;
  verifyWebhookSignature?(req: any): boolean;
}
