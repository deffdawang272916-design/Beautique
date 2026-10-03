import { ISmsProvider, SmsSendPayload, SmsSendResult, SmsDeliveryReport } from '../types.ts';
import { maskPhoneNumber } from '../../utils/phone.ts';
import { SmsDeliveryStatus } from '../../../src/types/appointment.ts';

export class WebhookSmsProvider implements ISmsProvider {
  readonly name = 'webhook';
  private webhookUrl: string;
  private webhookSecret?: string;

  constructor(url?: string, secret?: string) {
    this.webhookUrl = url || process.env.SMS_WEBHOOK_URL || '';
    this.webhookSecret = secret || process.env.SMS_WEBHOOK_SECRET || undefined;
  }

  get isConfigured(): boolean {
    return Boolean(this.webhookUrl && this.webhookUrl.startsWith('http'));
  }

  async sendMessage(payload: SmsSendPayload): Promise<SmsSendResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured) {
      return {
        success: false,
        status: 'failed',
        provider: 'webhook',
        failureReason: 'SMS_WEBHOOK_URL is not configured.',
        isMock: false,
        timestamp,
      };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.webhookSecret) {
        headers['X-SMS-Signature'] = this.webhookSecret;
      }

      const res = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          recipient: payload.to,
          message: payload.text,
          messageType: payload.messageType,
          reference: payload.appointmentRef,
          timestamp,
        }),
      });

      if (!res.ok) {
        return {
          success: false,
          status: 'failed',
          provider: 'webhook',
          failureReason: `Webhook returned status ${res.status}`,
          isMock: false,
          timestamp,
        };
      }

      const resData = (await res.json().catch(() => ({}))) as any;

      return {
        success: true,
        status: 'accepted',
        provider: 'webhook',
        providerMessageId: resData.messageId || `wh-${Date.now()}`,
        isMock: false,
        timestamp,
      };
    } catch (err: any) {
      console.error(`[WEBHOOK SMS ERROR] Recipient: ${maskPhoneNumber(payload.to)}, Error:`, err);
      return {
        success: false,
        status: 'failed',
        provider: 'webhook',
        failureReason: err.message || 'Error dispatching to SMS webhook',
        isMock: false,
        timestamp,
      };
    }
  }

  parseDeliveryReceipt(payload: any): SmsDeliveryReport | null {
    if (!payload || !payload.messageId) return null;
    const status: SmsDeliveryStatus = payload.status === 'delivered' ? 'delivered' : 'failed';
    return {
      providerMessageId: String(payload.messageId),
      status,
      deliveredAt: new Date().toISOString(),
      rawPayload: payload,
    };
  }
}
