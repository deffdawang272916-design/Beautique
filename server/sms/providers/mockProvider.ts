import { ISmsProvider, SmsSendPayload, SmsSendResult, SmsDeliveryReport } from '../types.ts';
import { maskPhoneNumber } from '../../utils/phone.ts';
import { SmsDeliveryStatus } from '../../../src/types/appointment.ts';

export class MockSmsProvider implements ISmsProvider {
  readonly name = 'mock';
  readonly isConfigured = true;

  async sendMessage(payload: SmsSendPayload): Promise<SmsSendResult> {
    const timestamp = new Date().toISOString();
    const maskedTo = maskPhoneNumber(payload.to);
    const mockMessageId = `mock-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    console.log(`\n======================================================`);
    console.log(`[DEVELOPMENT / MOCK SMS SIMULATED — NO REAL SMS SENT]`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Provider: mock`);
    console.log(`Mock Message ID: ${mockMessageId}`);
    console.log(`Type: ${payload.messageType}`);
    console.log(`Reference: ${payload.appointmentRef}`);
    console.log(`Recipient: ${maskedTo}`);
    console.log(`Message Body:\n${payload.text}`);
    console.log(`======================================================\n`);

    return {
      success: true,
      status: 'mock',
      provider: 'mock',
      providerMessageId: mockMessageId,
      isMock: true,
      timestamp,
    };
  }

  parseDeliveryReceipt(payload: any): SmsDeliveryReport | null {
    if (payload && payload.messageId) {
      const status: SmsDeliveryStatus = payload.status === 'delivered' ? 'delivered' : 'mock';
      return {
        providerMessageId: String(payload.messageId),
        status,
        deliveredAt: new Date().toISOString(),
      };
    }
    return null;
  }
}
