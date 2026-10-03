import {
  SmsMessageType,
  SMS_MESSAGE_TYPES,
  SmsEvent,
  AppointmentRecord,
} from '../../src/types/appointment.ts';
import { ISmsProvider, SmsSendResult } from './types.ts';
import { MockSmsProvider } from './providers/mockProvider.ts';
import { SemaphoreSmsProvider } from './providers/semaphoreProvider.ts';
import { WebhookSmsProvider } from './providers/webhookProvider.ts';
import { maskPhoneNumber } from '../utils/phone.ts';

export class SmsService {
  private provider: ISmsProvider;
  private idempotencyCache: Set<string> = new Set();

  constructor(customProvider?: ISmsProvider) {
    if (customProvider) {
      this.provider = customProvider;
      return;
    }

    const providerType = (process.env.SMS_PROVIDER || 'mock').toLowerCase().trim();

    if (providerType === 'semaphore') {
      const semaphore = new SemaphoreSmsProvider();
      if (semaphore.isConfigured) {
        this.provider = semaphore;
      } else {
        console.warn('[SMS SERVICE] Semaphore provider requested but credentials missing. Falling back to mock provider for safe development.');
        this.provider = new MockSmsProvider();
      }
    } else if (providerType === 'webhook') {
      const webhook = new WebhookSmsProvider();
      if (webhook.isConfigured) {
        this.provider = webhook;
      } else {
        console.warn('[SMS SERVICE] Webhook provider requested but URL missing. Falling back to mock provider.');
        this.provider = new MockSmsProvider();
      }
    } else {
      this.provider = new MockSmsProvider();
    }
  }

  get activeProviderName(): string {
    return this.provider.name;
  }

  get isMock(): boolean {
    return this.provider.name === 'mock';
  }

  /**
   * Generates exact, privacy-safe SMS templates.
   * Never includes customer skin concerns or internal staff medical evaluations.
   */
  generateSmsText(
    type: SmsMessageType,
    appointment: Pick<
      AppointmentRecord,
      'referenceCode' | 'serviceName' | 'preferredDate' | 'preferredTime' | 'confirmedDate' | 'confirmedTime' | 'proposedDate' | 'proposedTime'
    >
  ): string {
    switch (type) {
      case SMS_MESSAGE_TYPES.REQUEST_RECEIVED:
        return (
          `BEAUTIQUE AESTHETICS\n\n` +
          `We received your appointment request.\n\n` +
          `Ref: ${appointment.referenceCode}\n` +
          `Service: ${appointment.serviceName}\n` +
          `Requested: ${appointment.preferredDate}, ${appointment.preferredTime}\n\n` +
          `Your appointment is NOT confirmed yet. We'll notify you after the clinic reviews your request.`
        );

      case SMS_MESSAGE_TYPES.APPOINTMENT_CONFIRMED:
        return (
          `BEAUTIQUE AESTHETICS\n\n` +
          `Appointment confirmed ✓\n\n` +
          `Ref: ${appointment.referenceCode}\n` +
          `${appointment.serviceName}\n` +
          `${appointment.confirmedDate || appointment.preferredDate}\n` +
          `${appointment.confirmedTime || appointment.preferredTime}\n\n` +
          `Please contact the clinic if you need to make changes.`
        );

      case SMS_MESSAGE_TYPES.RESCHEDULE_PROPOSED:
        return (
          `BEAUTIQUE AESTHETICS\n\n` +
          `A new schedule has been proposed for your appointment.\n\n` +
          `Ref: ${appointment.referenceCode}\n` +
          `Proposed:\n` +
          `${appointment.proposedDate}\n` +
          `${appointment.proposedTime}\n\n` +
          `Please contact the clinic to confirm the new schedule.`
        );

      case SMS_MESSAGE_TYPES.APPOINTMENT_DECLINED:
        return (
          `BEAUTIQUE AESTHETICS\n\n` +
          `Update regarding your appointment request (Ref: ${appointment.referenceCode}).\n\n` +
          `Unfortunately, we are unable to accommodate your requested schedule at this time. Please contact the clinic for alternative options.`
        );

      case SMS_MESSAGE_TYPES.APPOINTMENT_CANCELLED:
        return (
          `BEAUTIQUE AESTHETICS\n\n` +
          `Your appointment (Ref: ${appointment.referenceCode}) has been cancelled.\n\n` +
          `Please contact the clinic if you wish to rebook.`
        );

      default:
        return `BEAUTIQUE AESTHETICS: Update regarding your appointment (Ref: ${appointment.referenceCode}).`;
    }
  }

  /**
   * Dispatches an SMS and returns the audit event record.
   * Handles idempotency and prevents duplicate sends.
   */
  async sendAppointmentSms(
    appointment: AppointmentRecord,
    messageType: SmsMessageType,
    idempotencyKey?: string
  ): Promise<{ result: SmsSendResult; event: SmsEvent }> {
    const key = idempotencyKey || `${appointment.id}-${messageType}-${appointment.updatedAt}`;

    if (this.idempotencyCache.has(key)) {
      console.warn(`[SMS SERVICE] Duplicate SMS send prevented by idempotency key: ${key}`);
      const now = new Date().toISOString();
      const duplicateResult: SmsSendResult = {
        success: true,
        status: 'accepted',
        provider: this.provider.name,
        isMock: this.isMock,
        failureReason: 'Duplicate request suppressed via idempotency protection.',
        timestamp: now,
      };

      const duplicateEvent: SmsEvent = {
        eventId: `evt-idemp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        appointmentId: appointment.id,
        messageType,
        provider: this.provider.name,
        recipientMasked: maskPhoneNumber(appointment.mobileNumber),
        messageBodyPreview: 'Duplicate send suppressed',
        status: 'accepted',
        createdAt: now,
        updatedAt: now,
      };

      return { result: duplicateResult, event: duplicateEvent };
    }

    const text = this.generateSmsText(messageType, appointment);
    const result = await this.provider.sendMessage({
      to: appointment.mobileNumber,
      text,
      messageType,
      appointmentRef: appointment.referenceCode,
      idempotencyKey: key,
    });

    if (result.success) {
      this.idempotencyCache.add(key);
      // Clean cache after 15 minutes
      const timer = setTimeout(() => this.idempotencyCache.delete(key), 15 * 60 * 1000);
      if (timer.unref) timer.unref();
    }

    const now = new Date().toISOString();
    const event: SmsEvent = {
      eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      appointmentId: appointment.id,
      messageType,
      provider: result.provider,
      providerMessageId: result.providerMessageId,
      recipientMasked: maskPhoneNumber(appointment.mobileNumber),
      messageBodyPreview: text.length > 80 ? `${text.slice(0, 77)}...` : text,
      status: result.status,
      createdAt: now,
      updatedAt: now,
      failureReason: result.failureReason || null,
    };

    return { result, event };
  }

  parseDeliveryReceipt(payload: any) {
    if (this.provider.parseDeliveryReceipt) {
      return this.provider.parseDeliveryReceipt(payload);
    }
    return null;
  }
}
