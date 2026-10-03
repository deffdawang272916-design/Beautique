import express, { Request, Response } from 'express';
import {
  CreateAppointmentDTO,
  StaffConfirmDTO,
  StaffProposeScheduleDTO,
  StaffDeclineDTO,
  StaffCancelDTO,
  APPOINTMENT_STATUSES,
  SMS_MESSAGE_TYPES,
} from '../../src/types/appointment.ts';
import {
  IAppointmentRepository,
  toPublicAppointmentStatus,
} from '../repositories/appointmentRepository.ts';
import { SmsService } from '../sms/smsService.ts';
import { validatePhilippineMobileNumber, maskPhoneNumber } from '../utils/phone.ts';
import { createRateLimiter } from '../middleware/rateLimiter.ts';
import { requireStaffAuth } from '../middleware/staffAuth.ts';

export function createAppointmentRouter(
  repository: IAppointmentRepository,
  smsService: SmsService
) {
  const router = express.Router();

  // Rate limiters
  const bookingRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 mins
    maxRequests: 12,
    message: 'Too many appointment requests submitted from this IP. Please try again in a few minutes.',
  });

  const statusCheckRateLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 mins
    maxRequests: 40,
    message: 'Too many status check attempts. Please try again later.',
  });

  // ------------------------------------------------------------------------
  // 1. Customer: Submit Appointment Request
  // ------------------------------------------------------------------------
  router.post('/appointments', bookingRateLimiter, async (req: Request, res: Response) => {
    try {
      const body = req.body as CreateAppointmentDTO;
      const {
        fullName,
        phone,
        email,
        treatmentId,
        treatmentName,
        preferredDate,
        preferredTime,
        skinConcerns,
      } = body;

      // 1. Required field validation
      if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({ error: 'Client full name is required.' });
      }

      if (!treatmentName || typeof treatmentName !== 'string' || !treatmentName.trim()) {
        return res.status(400).json({ error: 'Service/treatment name is required.' });
      }

      if (!preferredDate || typeof preferredDate !== 'string' || !preferredDate.trim()) {
        return res.status(400).json({ error: 'Preferred appointment date is required.' });
      }

      // 2. Philippine phone number validation and normalization
      const phoneValidation = validatePhilippineMobileNumber(phone);
      if (!phoneValidation.isValid || !phoneValidation.normalized) {
        return res.status(400).json({
          error: phoneValidation.error || 'Please provide a valid 11-digit Philippine mobile number (e.g. 0917 123 4567).',
        });
      }

      // 3. Persist appointment with status PENDING_CONFIRMATION
      const appointment = await repository.create({
        clientName: fullName.trim(),
        mobileNumber: phoneValidation.normalized,
        rawMobileInput: phone.trim(),
        email: email ? email.trim() : null,
        serviceId: treatmentId || 'general',
        serviceName: treatmentName.trim(),
        preferredDate: preferredDate.trim(),
        preferredTime: (preferredTime || 'Flexible Schedule').trim(),
        skinConcerns: skinConcerns ? skinConcerns.trim() : '',
        status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
        confirmedDate: null,
        confirmedTime: null,
        proposedDate: null,
        proposedTime: null,
        staffNotes: null,
        smsStatus: 'none',
        clinicLocation: 'Beautique Aesthetics — Santa Rosa, Nueva Ecija, Philippines',
      });

      console.log(
        `[APPOINTMENT CREATED] ID: ${appointment.id}, Ref: ${appointment.referenceCode}, Client: ${appointment.clientName}, Phone: ${phoneValidation.masked}`
      );

      // 4. Attempt SMS #1 — Request Received
      let smsResult;
      let smsEvent;
      try {
        const dispatch = await smsService.sendAppointmentSms(
          appointment,
          SMS_MESSAGE_TYPES.REQUEST_RECEIVED
        );
        smsResult = dispatch.result;
        smsEvent = dispatch.event;

        // Update appointment with SMS event
        await repository.update(appointment.id, {
          smsStatus: smsResult.status,
          smsEvents: [smsEvent],
        });
      } catch (smsError: any) {
        console.error(`[SMS DISPATCH ERROR] Appointment ${appointment.referenceCode}:`, smsError);
        smsResult = {
          success: false,
          status: 'failed' as const,
          provider: smsService.activeProviderName,
          failureReason: smsError.message || 'SMS service error',
          isMock: smsService.isMock,
          timestamp: new Date().toISOString(),
        };
      }

      // 5. Messenger fallback URL (Optional channel)
      const messengerContinuationUrl = `https://m.me/61561255528582?text=${encodeURIComponent(
        `Hello Beautique Aesthetics Sta. Rosa, I submitted an appointment request (Ref: ${appointment.referenceCode}). Please confirm schedule availability. Thank you!`
      )}`;

      return res.status(201).json({
        success: true,
        referenceCode: appointment.referenceCode,
        status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
        statusToken: appointment.statusToken,
        appointmentStored: true,
        serviceName: appointment.serviceName,
        preferredSchedule: `${appointment.preferredDate} (${appointment.preferredTime})`,
        smsNotification: {
          status: smsResult.status,
          isMock: smsResult.isMock,
          provider: smsResult.provider,
          message: smsResult.isMock
            ? 'SMS simulated — development mode. No real SMS dispatched.'
            : smsResult.success
              ? `SMS acknowledgement dispatched to ${phoneValidation.masked}.`
              : 'Appointment request was saved, but SMS acknowledgement could not be dispatched.',
        },
        messengerContinuationUrl,
      });
    } catch (error: any) {
      console.error('[APPOINTMENT SUBMISSION ERROR]:', error);
      return res.status(500).json({
        error: 'Failed to process appointment request. Please try again or contact the clinic directly.',
      });
    }
  });

  // ------------------------------------------------------------------------
  // 2. Customer: Secure Status Lookup
  // ------------------------------------------------------------------------
  router.post('/appointments/status', statusCheckRateLimiter, async (req: Request, res: Response) => {
    try {
      const { referenceCode, statusToken } = req.body;

      if (!referenceCode || typeof referenceCode !== 'string') {
        return res.status(400).json({ error: 'Reference code is required.' });
      }

      if (!statusToken || typeof statusToken !== 'string') {
        return res.status(400).json({
          error: 'Security status token is required to view appointment details.',
        });
      }

      const appointment = await repository.findByReferenceAndToken(
        referenceCode.trim(),
        statusToken.trim()
      );

      if (!appointment) {
        return res.status(404).json({
          error: 'Appointment not found or invalid verification token.',
        });
      }

      const publicStatus = toPublicAppointmentStatus(appointment);
      return res.json({ success: true, appointment: publicStatus });
    } catch (error) {
      console.error('[APPOINTMENT STATUS LOOKUP ERROR]:', error);
      return res.status(500).json({ error: 'Failed to lookup appointment status.' });
    }
  });

  // ------------------------------------------------------------------------
  // 3. Staff: List All Appointments
  // ------------------------------------------------------------------------
  router.get('/staff/appointments', requireStaffAuth, async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      let appointments = await repository.findAll();

      if (status && typeof status === 'string') {
        appointments = appointments.filter((a) => a.status === status);
      }

      // Return staff-safe view with masked phone in default list, full details on demand
      const list = appointments.map((a) => ({
        ...a,
        maskedMobile: maskPhoneNumber(a.mobileNumber),
      }));

      return res.json({
        success: true,
        count: list.length,
        appointments: list,
        smsProvider: smsService.activeProviderName,
        isMockSms: smsService.isMock,
      });
    } catch (error) {
      console.error('[STAFF LIST APPOINTMENTS ERROR]:', error);
      return res.status(500).json({ error: 'Failed to retrieve appointments.' });
    }
  });

  // ------------------------------------------------------------------------
  // 4. Staff: Get Single Appointment
  // ------------------------------------------------------------------------
  router.get('/staff/appointments/:id', requireStaffAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointment = await repository.findById(id);

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      return res.json({
        success: true,
        appointment,
        smsProvider: smsService.activeProviderName,
        isMockSms: smsService.isMock,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve appointment.' });
    }
  });

  // ------------------------------------------------------------------------
  // 5. Staff: CONFIRM APPOINTMENT
  // ------------------------------------------------------------------------
  router.post('/staff/appointments/:id/confirm', requireStaffAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body as StaffConfirmDTO;
      const { confirmedDate, confirmedTime, staffNotes } = body;

      if (!confirmedDate || !confirmedTime) {
        return res.status(400).json({
          error: 'Confirmed date and confirmed time are explicitly required.',
        });
      }

      const appointment = await repository.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      // Idempotency: If already confirmed for this exact schedule, prevent duplicate SMS
      const alreadyConfirmed =
        appointment.status === APPOINTMENT_STATUSES.CONFIRMED &&
        appointment.confirmedDate === confirmedDate &&
        appointment.confirmedTime === confirmedTime;

      const previousStatus = appointment.status;
      const now = new Date().toISOString();

      const updatedHistory = [
        ...appointment.statusHistory,
        {
          fromStatus: previousStatus,
          toStatus: APPOINTMENT_STATUSES.CONFIRMED,
          changedAt: now,
          changedBy: 'staff' as const,
          staffNote: staffNotes || 'Schedule confirmed by clinic staff.',
        },
      ];

      // Update backend state
      const updated = await repository.update(id, {
        status: APPOINTMENT_STATUSES.CONFIRMED,
        confirmedDate: confirmedDate.trim(),
        confirmedTime: confirmedTime.trim(),
        staffNotes: staffNotes ? staffNotes.trim() : appointment.staffNotes,
        statusHistory: updatedHistory,
      });

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update appointment record.' });
      }

      console.log(
        `[APPOINTMENT CONFIRMED] Ref: ${updated.referenceCode}, Schedule: ${confirmedDate} ${confirmedTime}`
      );

      // Dispatch confirmation SMS (with idempotency guard)
      let smsResult;
      if (!alreadyConfirmed) {
        const dispatch = await smsService.sendAppointmentSms(
          updated,
          SMS_MESSAGE_TYPES.APPOINTMENT_CONFIRMED,
          `confirm-${id}-${confirmedDate}-${confirmedTime}`
        );
        smsResult = dispatch.result;

        await repository.update(id, {
          smsStatus: smsResult.status,
          smsEvents: [...updated.smsEvents, dispatch.event],
        });
      } else {
        smsResult = {
          success: true,
          status: updated.smsStatus,
          provider: smsService.activeProviderName,
          isMock: smsService.isMock,
          failureReason: 'Duplicate confirmation SMS suppressed.',
          timestamp: now,
        };
      }

      return res.json({
        success: true,
        message: 'Appointment confirmed successfully.',
        appointment: await repository.findById(id),
        smsResult,
      });
    } catch (error: any) {
      console.error('[STAFF CONFIRM ERROR]:', error);
      return res.status(500).json({ error: 'Failed to confirm appointment.' });
    }
  });

  // ------------------------------------------------------------------------
  // 6. Staff: PROPOSE NEW SCHEDULE
  // ------------------------------------------------------------------------
  router.post('/staff/appointments/:id/propose-schedule', requireStaffAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body as StaffProposeScheduleDTO;
      const { proposedDate, proposedTime, staffNotes } = body;

      if (!proposedDate || !proposedTime) {
        return res.status(400).json({
          error: 'Proposed date and proposed time are explicitly required.',
        });
      }

      const appointment = await repository.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      const previousStatus = appointment.status;
      const now = new Date().toISOString();

      const updatedHistory = [
        ...appointment.statusHistory,
        {
          fromStatus: previousStatus,
          toStatus: APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED,
          changedAt: now,
          changedBy: 'staff' as const,
          staffNote: staffNotes || `Staff proposed alternate schedule: ${proposedDate} ${proposedTime}`,
        },
      ];

      const updated = await repository.update(id, {
        status: APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED,
        proposedDate: proposedDate.trim(),
        proposedTime: proposedTime.trim(),
        staffNotes: staffNotes ? staffNotes.trim() : appointment.staffNotes,
        statusHistory: updatedHistory,
      });

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update appointment record.' });
      }

      console.log(
        `[APPOINTMENT RESCHEDULE PROPOSED] Ref: ${updated.referenceCode}, Proposed: ${proposedDate} ${proposedTime}`
      );

      // Dispatch reschedule SMS
      const dispatch = await smsService.sendAppointmentSms(
        updated,
        SMS_MESSAGE_TYPES.RESCHEDULE_PROPOSED
      );

      await repository.update(id, {
        smsStatus: dispatch.result.status,
        smsEvents: [...updated.smsEvents, dispatch.event],
      });

      return res.json({
        success: true,
        message: 'New schedule proposed and notification dispatched.',
        appointment: await repository.findById(id),
        smsResult: dispatch.result,
      });
    } catch (error: any) {
      console.error('[STAFF RESCHEDULE ERROR]:', error);
      return res.status(500).json({ error: 'Failed to propose new schedule.' });
    }
  });

  // ------------------------------------------------------------------------
  // 7. Staff: DECLINE REQUEST
  // ------------------------------------------------------------------------
  router.post('/staff/appointments/:id/decline', requireStaffAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body as StaffDeclineDTO;
      const { reason, staffNotes } = body;

      const appointment = await repository.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      const previousStatus = appointment.status;
      const now = new Date().toISOString();

      const updatedHistory = [
        ...appointment.statusHistory,
        {
          fromStatus: previousStatus,
          toStatus: APPOINTMENT_STATUSES.DECLINED,
          changedAt: now,
          changedBy: 'staff' as const,
          reason: reason || 'Clinic unable to accommodate requested slot.',
          staffNote: staffNotes || null,
        },
      ];

      const updated = await repository.update(id, {
        status: APPOINTMENT_STATUSES.DECLINED,
        staffNotes: staffNotes ? staffNotes.trim() : appointment.staffNotes,
        statusHistory: updatedHistory,
      });

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update appointment record.' });
      }

      console.log(`[APPOINTMENT DECLINED] Ref: ${updated.referenceCode}`);

      // Dispatch decline SMS
      const dispatch = await smsService.sendAppointmentSms(
        updated,
        SMS_MESSAGE_TYPES.APPOINTMENT_DECLINED
      );

      await repository.update(id, {
        smsStatus: dispatch.result.status,
        smsEvents: [...updated.smsEvents, dispatch.event],
      });

      return res.json({
        success: true,
        message: 'Appointment request declined.',
        appointment: await repository.findById(id),
        smsResult: dispatch.result,
      });
    } catch (error: any) {
      console.error('[STAFF DECLINE ERROR]:', error);
      return res.status(500).json({ error: 'Failed to decline appointment.' });
    }
  });

  // ------------------------------------------------------------------------
  // 8. Staff: CANCEL APPOINTMENT
  // ------------------------------------------------------------------------
  router.post('/staff/appointments/:id/cancel', requireStaffAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body as StaffCancelDTO;
      const { reason, staffNotes } = body;

      const appointment = await repository.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      const previousStatus = appointment.status;
      const now = new Date().toISOString();

      const updatedHistory = [
        ...appointment.statusHistory,
        {
          fromStatus: previousStatus,
          toStatus: APPOINTMENT_STATUSES.CANCELLED,
          changedAt: now,
          changedBy: 'staff' as const,
          reason: reason || 'Appointment cancelled.',
          staffNote: staffNotes || null,
        },
      ];

      const updated = await repository.update(id, {
        status: APPOINTMENT_STATUSES.CANCELLED,
        staffNotes: staffNotes ? staffNotes.trim() : appointment.staffNotes,
        statusHistory: updatedHistory,
      });

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update appointment record.' });
      }

      console.log(`[APPOINTMENT CANCELLED] Ref: ${updated.referenceCode}`);

      // Dispatch cancellation SMS
      const dispatch = await smsService.sendAppointmentSms(
        updated,
        SMS_MESSAGE_TYPES.APPOINTMENT_CANCELLED
      );

      await repository.update(id, {
        smsStatus: dispatch.result.status,
        smsEvents: [...updated.smsEvents, dispatch.event],
      });

      return res.json({
        success: true,
        message: 'Appointment cancelled.',
        appointment: await repository.findById(id),
        smsResult: dispatch.result,
      });
    } catch (error: any) {
      console.error('[STAFF CANCEL ERROR]:', error);
      return res.status(500).json({ error: 'Failed to cancel appointment.' });
    }
  });

  // ------------------------------------------------------------------------
  // 9. SMS Delivery Webhook Callback (Server-to-Server)
  // ------------------------------------------------------------------------
  router.post('/webhooks/sms', async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const report = smsService.parseDeliveryReceipt(payload);

      if (!report || !report.providerMessageId) {
        return res.status(200).json({ received: true, note: 'Ignored: No message ID found' });
      }

      // Find appointment associated with providerMessageId
      const appointments = await repository.findAll();
      const matched = appointments.find((a) =>
        a.smsEvents.some((e) => e.providerMessageId === report.providerMessageId)
      );

      if (matched) {
        // Idempotent update: check if already delivered
        let eventModified = false;
        const updatedEvents = matched.smsEvents.map((evt) => {
          if (evt.providerMessageId === report.providerMessageId) {
            if (evt.status !== report.status) {
              eventModified = true;
              return {
                ...evt,
                status: report.status,
                updatedAt: new Date().toISOString(),
                deliveryReceiptReceivedAt: report.deliveredAt || new Date().toISOString(),
              };
            }
          }
          return evt;
        });

        if (eventModified) {
          await repository.update(matched.id, {
            smsStatus: report.status,
            smsEvents: updatedEvents,
          });
          console.log(
            `[SMS WEBHOOK PROCESSED] Appointment ${matched.referenceCode} message ${report.providerMessageId} status -> ${report.status}`
          );
        } else {
          console.log(
            `[SMS WEBHOOK IDEMPOTENT] Duplicate or unchanged delivery receipt for ${report.providerMessageId}`
          );
        }
      }

      return res.status(200).json({ received: true, processed: Boolean(matched) });
    } catch (error) {
      console.error('[SMS WEBHOOK ERROR]:', error);
      return res.status(200).json({ received: true, error: 'Internal processing error logged' });
    }
  });

  return router;
}
