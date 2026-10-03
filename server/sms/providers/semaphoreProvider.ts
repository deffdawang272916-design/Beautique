import { ISmsProvider, SmsSendPayload, SmsSendResult } from '../types.ts';
import { maskPhoneNumber } from '../../utils/phone.ts';

export class SemaphoreSmsProvider implements ISmsProvider {
  readonly name = 'semaphore';
  private apiKey: string;
  private senderName?: string;

  constructor(apiKey?: string, senderName?: string) {
    this.apiKey = apiKey || process.env.SEMAPHORE_API_KEY || '';
    this.senderName = senderName || process.env.SEMAPHORE_SENDER_NAME || undefined;
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0 && this.apiKey !== 'MY_SEMAPHORE_API_KEY');
  }

  async sendMessage(payload: SmsSendPayload): Promise<SmsSendResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured) {
      return {
        success: false,
        status: 'failed',
        provider: 'semaphore',
        failureReason: 'Semaphore API key is not configured in environment.',
        isMock: false,
        timestamp,
      };
    }

    try {
      // Semaphore API endpoint
      const endpoint = 'https://api.semaphore.co/api/v4/messages';
      const bodyParams: Record<string, string> = {
        apikey: this.apiKey,
        number: payload.to,
        message: payload.text,
      };

      if (this.senderName) {
        bodyParams.sendername = this.senderName;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyParams),
      });

      const responseData = (await response.json()) as any;

      if (!response.ok) {
        const errorMsg = Array.isArray(responseData)
          ? responseData.map((d: any) => d.message || d).join(', ')
          : responseData.message || `HTTP ${response.status} from Semaphore`;

        console.error(`[SEMAPHORE SMS ERROR] Recipient: ${maskPhoneNumber(payload.to)}, Error: ${errorMsg}`);

        return {
          success: false,
          status: 'failed',
          provider: 'semaphore',
          failureReason: errorMsg,
          isMock: false,
          timestamp,
        };
      }

      // Semaphore returns an array of message records: [{ message_id: 12345, status: "Queued" }]
      const firstResult = Array.isArray(responseData) ? responseData[0] : responseData;
      const providerMessageId = firstResult?.message_id ? String(firstResult.message_id) : null;
      const rawStatus = (firstResult?.status || 'accepted').toLowerCase();

      let mappedStatus: any = 'accepted';
      if (rawStatus === 'queued') mappedStatus = 'queued';
      if (rawStatus === 'sent') mappedStatus = 'sent';
      if (rawStatus === 'failed') mappedStatus = 'failed';

      return {
        success: true,
        status: mappedStatus,
        provider: 'semaphore',
        providerMessageId,
        isMock: false,
        timestamp,
      };
    } catch (err: any) {
      console.error(`[SEMAPHORE SMS EXCEPTION] Error:`, err);
      return {
        success: false,
        status: 'failed',
        provider: 'semaphore',
        failureReason: err.message || 'Network error communicating with Semaphore SMS gateway',
        isMock: false,
        timestamp,
      };
    }
  }

  parseDeliveryReceipt(payload: any) {
    if (!payload) return null;
    const messageId = payload.message_id || payload.messageId;
    if (!messageId) return null;

    const rawStatus = (payload.status || '').toLowerCase();
    let status: any = 'sent';
    if (rawStatus.includes('deliver') || rawStatus === 'success') {
      status = 'delivered';
    } else if (rawStatus.includes('fail') || rawStatus === 'undelivered') {
      status = 'failed';
    }

    return {
      providerMessageId: String(messageId),
      status,
      deliveredAt: payload.timestamp || new Date().toISOString(),
      rawPayload: payload,
    };
  }
}
