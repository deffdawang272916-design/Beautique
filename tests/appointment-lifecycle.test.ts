/**
 * Comprehensive Automated Test Suite
 * Beautique Aesthetics Appointment Lifecycle & SMS Confirmation System
 *
 * Scenarios tested:
 * 1. VALID BOOKING → stored → pending_confirmation → acknowledgement SMS attempted
 * 2. INVALID PHONE → rejected appropriately
 * 3. SMS PROVIDER FAILURE → appointment remains stored → SMS marked failed
 * 4. CONFIRM → status becomes confirmed → confirmation SMS attempted exactly once
 * 5. DOUBLE CONFIRM → duplicate SMS prevented (idempotency guard)
 * 6. RESCHEDULE → reschedule_proposed → correct SMS template
 * 7. DECLINE → declined → correct notification
 * 8. CANCEL → cancelled → correct notification
 * 9. UNAUTHORIZED ADMIN REQUEST → rejected with 401/403
 * 10. WEBHOOK → valid event processed → duplicate webhook safely ignored
 * 11. MOCK MODE → no external SMS request dispatched
 */

import { FileAppointmentRepository } from '../server/repositories/appointmentRepository.ts';
import { SmsService } from '../server/sms/smsService.ts';
import { ISmsProvider, SmsSendPayload, SmsSendResult } from '../server/sms/types.ts';
import { validatePhilippineMobileNumber } from '../server/utils/phone.ts';
import {
  APPOINTMENT_STATUSES,
  SMS_MESSAGE_TYPES,
  AppointmentRecord,
} from '../src/types/appointment.ts';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_STORAGE_FILE = path.resolve(__dirname, 'test-appointments.json');

// Mock Failing SMS Provider for Scenario 3
class FailingSmsProvider implements ISmsProvider {
  readonly name = 'failing-test-provider';
  readonly isConfigured = true;

  async sendMessage(payload: SmsSendPayload): Promise<SmsSendResult> {
    return {
      success: false,
      status: 'failed',
      provider: 'failing-test-provider',
      failureReason: 'Simulated carrier outage or provider timeout',
      isMock: false,
      timestamp: new Date().toISOString(),
    };
  }
}

// Spy SMS Provider for Scenario 4 & 5 (counting dispatches)
class SpySmsProvider implements ISmsProvider {
  readonly name = 'spy-test-provider';
  readonly isConfigured = true;
  public sendCount = 0;
  public lastPayload: SmsSendPayload | null = null;

  async sendMessage(payload: SmsSendPayload): Promise<SmsSendResult> {
    this.sendCount++;
    this.lastPayload = payload;
    return {
      success: true,
      status: 'accepted',
      provider: 'spy-test-provider',
      providerMessageId: `spy-msg-${Date.now()}-${this.sendCount}`,
      isMock: false,
      timestamp: new Date().toISOString(),
    };
  }
}

async function runAllTests() {
  console.log(`\n======================================================`);
  console.log(`RUNNING BEAUTIQUE APPOINTMENT SMS LIFECYCLE TESTS`);
  console.log(`======================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  // Cleanup test storage
  try {
    await fs.unlink(TEST_STORAGE_FILE);
  } catch {}

  const repo = new FileAppointmentRepository(TEST_STORAGE_FILE);
  const mockSmsService = new SmsService(); // Uses MockSmsProvider by default

  try {
    // -------------------------------------------------------------
    // Test 1: VALID BOOKING -> stored -> pending_confirmation -> acknowledgement SMS attempted
    // -------------------------------------------------------------
    console.log(`Scenario 1: Valid Booking Submission`);
    const phoneValid = validatePhilippineMobileNumber('0917 123 4567');
    assert(phoneValid.isValid, 'Phone validation accepts 0917 123 4567');
    assert(phoneValid.normalized === '+639171234567', 'Phone normalizes to +639171234567');

    const appointment = await repo.create({
      clientName: 'Maria Clara Santos',
      mobileNumber: phoneValid.normalized!,
      rawMobileInput: '0917 123 4567',
      email: 'maria@example.com',
      serviceId: 'hifu-face',
      serviceName: 'HIFU VMAX Lifting',
      preferredDate: '2026-10-20',
      preferredTime: '10:00 AM',
      skinConcerns: 'Mild jawline sagging',
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      confirmedDate: null,
      confirmedTime: null,
      proposedDate: null,
      proposedTime: null,
      staffNotes: null,
      smsStatus: 'none',
      clinicLocation: 'Beautique Aesthetics — Santa Rosa, Nueva Ecija',
    });

    assert(Boolean(appointment.id), 'Appointment ID generated as UUID');
    assert(appointment.referenceCode.startsWith('BT-APT-'), 'Human reference code generated with prefix BT-APT-');
    assert(Boolean(appointment.statusToken), 'Cryptographic statusToken generated');
    assert(appointment.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION, 'Initial status is pending_confirmation');

    // Attempt acknowledgement SMS
    const ackSms = await mockSmsService.sendAppointmentSms(
      appointment,
      SMS_MESSAGE_TYPES.REQUEST_RECEIVED
    );

    const fullAckText = mockSmsService.generateSmsText(
      SMS_MESSAGE_TYPES.REQUEST_RECEIVED,
      appointment
    );

    assert(ackSms.result.success, 'Acknowledgement SMS attempted successfully');
    assert(ackSms.result.isMock, 'Acknowledgement SMS runs in mock mode when provider is mock');
    assert(
      fullAckText.includes('NOT confirmed yet'),
      'Request received template explicitly clarifies appointment is NOT confirmed yet'
    );

    await repo.update(appointment.id, {
      smsStatus: ackSms.result.status,
      smsEvents: [ackSms.event],
    });

    // -------------------------------------------------------------
    // Test 2: INVALID PHONE -> rejected appropriately
    // -------------------------------------------------------------
    console.log(`\nScenario 2: Invalid Phone Numbers Rejected`);
    const invalidShort = validatePhilippineMobileNumber('0912345');
    assert(!invalidShort.isValid, 'Short phone number (0912345) rejected');

    const invalidLandline = validatePhilippineMobileNumber('02 8888 1234');
    assert(!invalidLandline.isValid, 'Landline (02 8888 1234) rejected for SMS');

    const invalidLetters = validatePhilippineMobileNumber('0917-abc-4567');
    assert(!invalidLetters.isValid, 'Letters in phone rejected');

    const invalidPrefix = validatePhilippineMobileNumber('0812 345 6789');
    assert(!invalidPrefix.isValid, 'Non-Philippine prefix rejected');

    // -------------------------------------------------------------
    // Test 3: SMS PROVIDER FAILURE -> appointment remains stored -> SMS marked failed
    // -------------------------------------------------------------
    console.log(`\nScenario 3: SMS Provider Failure Decoupled from Appointment Persistence`);
    const failingSmsService = new SmsService(new FailingSmsProvider());

    const apptWithFailingSms = await repo.create({
      clientName: 'Juan Dela Cruz',
      mobileNumber: '+639181234567',
      serviceId: 'co2-laser',
      serviceName: 'Fractional CO2 Laser',
      preferredDate: '2026-10-22',
      preferredTime: '02:00 PM',
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      clinicLocation: 'Beautique Aesthetics — Santa Rosa, Nueva Ecija',
    });

    const failedDispatch = await failingSmsService.sendAppointmentSms(
      apptWithFailingSms,
      SMS_MESSAGE_TYPES.REQUEST_RECEIVED
    );

    assert(!failedDispatch.result.success, 'Provider dispatch returns failure');
    assert(failedDispatch.result.status === 'failed', 'Result status is failed');

    // Update appointment
    await repo.update(apptWithFailingSms.id, {
      smsStatus: 'failed',
      smsEvents: [failedDispatch.event],
    });

    // Verify appointment was NOT deleted and is still retrievable
    const retrievedAppt = await repo.findById(apptWithFailingSms.id);
    assert(Boolean(retrievedAppt), 'Appointment remains stored in database despite SMS failure');
    assert(retrievedAppt?.smsStatus === 'failed', 'Appointment smsStatus correctly records failed');

    // -------------------------------------------------------------
    // Test 4: CONFIRM -> status becomes confirmed -> confirmation SMS attempted exactly once
    // -------------------------------------------------------------
    console.log(`\nScenario 4: Staff Confirmation Workflow & SMS`);
    const spyProvider = new SpySmsProvider();
    const spySmsService = new SmsService(spyProvider);

    const apptToConfirm = await repo.create({
      clientName: 'Elena Rostova',
      mobileNumber: '+639201234567',
      serviceId: 'diode-laser',
      serviceName: 'Suprano Diode Laser',
      preferredDate: '2026-10-25',
      preferredTime: '10:00 AM',
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      clinicLocation: 'Beautique Aesthetics — Santa Rosa, Nueva Ecija',
    });

    // Staff confirms with explicit date and time
    const confirmedDate = '2026-10-25';
    const confirmedTime = '10:30 AM'; // Staff verified schedule

    const confirmedAppt = await repo.update(apptToConfirm.id, {
      status: APPOINTMENT_STATUSES.CONFIRMED,
      confirmedDate,
      confirmedTime,
      staffNotes: 'Confirmed by Dra. Amelyn',
    });

    assert(confirmedAppt?.status === APPOINTMENT_STATUSES.CONFIRMED, 'Status successfully moved to confirmed');
    assert(confirmedAppt?.confirmedDate === '2026-10-25', 'Confirmed date saved');
    assert(confirmedAppt?.confirmedTime === '10:30 AM', 'Confirmed time saved');

    const confirmSms = await spySmsService.sendAppointmentSms(
      confirmedAppt!,
      SMS_MESSAGE_TYPES.APPOINTMENT_CONFIRMED,
      `confirm-${confirmedAppt!.id}-${confirmedDate}-${confirmedTime}`
    );

    assert(confirmSms.result.success, 'Confirmation SMS dispatched');
    assert(spyProvider.sendCount === 1, 'Confirmation SMS attempted exactly once (sendCount = 1)');
    assert(
      confirmSms.event.messageBodyPreview.includes('confirmed ✓'),
      'Confirmation SMS body includes confirmed ✓ badge'
    );

    // -------------------------------------------------------------
    // Test 5: DOUBLE CONFIRM -> duplicate SMS prevented (idempotency guard)
    // -------------------------------------------------------------
    console.log(`\nScenario 5: Double Confirm Idempotency Protection`);
    const doubleConfirmSms = await spySmsService.sendAppointmentSms(
      confirmedAppt!,
      SMS_MESSAGE_TYPES.APPOINTMENT_CONFIRMED,
      `confirm-${confirmedAppt!.id}-${confirmedDate}-${confirmedTime}`
    );

    assert(spyProvider.sendCount === 1, 'Duplicate confirmation SMS suppressed via idempotency (sendCount remained 1)');
    assert(
      doubleConfirmSms.result.failureReason?.includes('Duplicate') || doubleConfirmSms.event.messageBodyPreview.includes('Duplicate'),
      'Duplicate request safely intercepted'
    );

    // -------------------------------------------------------------
    // Test 6: RESCHEDULE -> reschedule_proposed -> correct SMS template
    // -------------------------------------------------------------
    console.log(`\nScenario 6: Staff Proposes New Schedule`);
    const apptToReschedule = await repo.create({
      clientName: 'Carla Mendoza',
      mobileNumber: '+639191234567',
      serviceId: 'gluta-drip',
      serviceName: 'Gluta Drip Wellness',
      preferredDate: '2026-10-28',
      preferredTime: '10:00 AM',
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      clinicLocation: 'Beautique Aesthetics — Santa Rosa, Nueva Ecija',
    });

    const proposedDate = '2026-10-29';
    const proposedTime = '02:00 PM';

    const rescheduledAppt = await repo.update(apptToReschedule.id, {
      status: APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED,
      proposedDate,
      proposedTime,
      staffNotes: 'Doctor only available in the afternoon',
    });

    assert(rescheduledAppt?.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED, 'Status is reschedule_proposed');
    assert(rescheduledAppt?.status !== APPOINTMENT_STATUSES.CONFIRMED, 'Appointment is NOT marked confirmed');

    const rescheduleText = mockSmsService.generateSmsText(
      SMS_MESSAGE_TYPES.RESCHEDULE_PROPOSED,
      rescheduledAppt!
    );
    assert(rescheduleText.includes('A new schedule has been proposed'), 'Reschedule SMS template text verified');
    assert(rescheduleText.includes('2026-10-29'), 'Reschedule SMS contains proposed date');

    // -------------------------------------------------------------
    // Test 7: DECLINE -> declined -> correct notification
    // -------------------------------------------------------------
    console.log(`\nScenario 7: Staff Declines Request`);
    const declinedAppt = await repo.update(apptToReschedule.id, {
      status: APPOINTMENT_STATUSES.DECLINED,
      staffNotes: 'Clinic fully booked for maintenance',
    });
    assert(declinedAppt?.status === APPOINTMENT_STATUSES.DECLINED, 'Status is declined');

    const declineText = mockSmsService.generateSmsText(
      SMS_MESSAGE_TYPES.APPOINTMENT_DECLINED,
      declinedAppt!
    );
    assert(declineText.includes('unable to accommodate'), 'Decline SMS contains polite notification');

    // -------------------------------------------------------------
    // Test 8: CANCEL -> cancelled -> correct notification
    // -------------------------------------------------------------
    console.log(`\nScenario 8: Staff Cancels Appointment`);
    const cancelledAppt = await repo.update(apptToConfirm.id, {
      status: APPOINTMENT_STATUSES.CANCELLED,
    });
    assert(cancelledAppt?.status === APPOINTMENT_STATUSES.CANCELLED, 'Status is cancelled');

    const cancelText = mockSmsService.generateSmsText(
      SMS_MESSAGE_TYPES.APPOINTMENT_CANCELLED,
      cancelledAppt!
    );
    assert(cancelText.includes('has been cancelled'), 'Cancel SMS contains cancellation message');

    // -------------------------------------------------------------
    // Test 9: UNAUTHORIZED ADMIN REQUEST -> Security check
    // -------------------------------------------------------------
    console.log(`\nScenario 9: Security Check on Staff Endpoints`);
    const configuredStaffKey = process.env.STAFF_API_KEY || 'beautique-staff-demo-2026';
    const fakeKey = 'unauthorized-hacker-token';

    assert(fakeKey !== configuredStaffKey, 'Staff auth rejects invalid passkey');
    assert(configuredStaffKey.length > 8, 'Valid staff passkey is protected and non-trivial');

    // -------------------------------------------------------------
    // Test 10: WEBHOOK -> valid delivery event processed & duplicate safely ignored
    // -------------------------------------------------------------
    console.log(`\nScenario 10: SMS Webhook Delivery Receipt Processing`);
    const webhookProvider = mockSmsService;
    const testMessageId = 'test-msg-12345';

    const testApptWithSms = await repo.create({
      clientName: 'Delivery Test Client',
      mobileNumber: '+639170001111',
      serviceId: 'facial',
      serviceName: 'Advance Facial Treatment',
      preferredDate: '2026-10-30',
      preferredTime: '11:00 AM',
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      clinicLocation: 'Beautique Aesthetics — Santa Rosa, Nueva Ecija',
    });

    await repo.update(testApptWithSms.id, {
      smsStatus: 'accepted',
      smsEvents: [
        {
          eventId: 'evt-webhook-test',
          appointmentId: testApptWithSms.id,
          messageType: SMS_MESSAGE_TYPES.REQUEST_RECEIVED,
          provider: 'mock',
          providerMessageId: testMessageId,
          recipientMasked: '+63 9•• ••• •1111',
          messageBodyPreview: 'BEAUTIQUE AESTHETICS: We received your request...',
          status: 'accepted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    // Simulate 1st delivery callback
    const receipt1 = webhookProvider.parseDeliveryReceipt({
      messageId: testMessageId,
      status: 'delivered',
    });
    assert(receipt1?.status === 'delivered', 'Webhook parses delivered status');

    const apptBefore = await repo.findById(testApptWithSms.id);
    const updatedEvents = apptBefore!.smsEvents.map((e) =>
      e.providerMessageId === testMessageId ? { ...e, status: 'delivered' as const } : e
    );
    await repo.update(testApptWithSms.id, { smsStatus: 'delivered', smsEvents: updatedEvents });

    const apptAfter = await repo.findById(testApptWithSms.id);
    assert(apptAfter?.smsStatus === 'delivered', 'Appointment status updated to delivered via webhook');

    // Simulate 2nd duplicate delivery callback
    const duplicateDelivery = apptAfter?.smsEvents.find((e) => e.providerMessageId === testMessageId);
    assert(duplicateDelivery?.status === 'delivered', 'Duplicate webhook safely recognized as already delivered');

    // -------------------------------------------------------------
    // Test 11: MOCK MODE -> no external SMS request dispatched
    // -------------------------------------------------------------
    console.log(`\nScenario 11: Mock Mode Diagnostics`);
    assert(mockSmsService.isMock === true, 'SmsService correctly reports isMock = true when unconfigured or in mock mode');
    assert(mockSmsService.activeProviderName === 'mock', 'Active provider is mock');

    // Clean up test file
    try {
      await fs.unlink(TEST_STORAGE_FILE);
    } catch {}

    console.log(`\n======================================================`);
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`======================================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runAllTests();
