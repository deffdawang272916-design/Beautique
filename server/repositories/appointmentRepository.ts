import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  AppointmentRecord,
  AppointmentStatus,
  APPOINTMENT_STATUSES,
  PublicAppointmentStatus,
} from '../../src/types/appointment.ts';
import { maskPhoneNumber, validatePhilippineMobileNumber } from '../utils/phone.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IAppointmentRepository {
  create(
    data: Omit<
      AppointmentRecord,
      'id' | 'referenceCode' | 'statusToken' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'smsEvents' | 'smsStatus'
    > & { smsStatus?: AppointmentRecord['smsStatus'] }
  ): Promise<AppointmentRecord>;
  findById(id: string): Promise<AppointmentRecord | null>;
  findByReference(referenceCode: string): Promise<AppointmentRecord | null>;
  findByReferenceAndToken(referenceCode: string, statusToken: string): Promise<AppointmentRecord | null>;
  findAll(): Promise<AppointmentRecord[]>;
  update(id: string, updates: Partial<AppointmentRecord>): Promise<AppointmentRecord | null>;
}

export class FileAppointmentRepository implements IAppointmentRepository {
  private filePath: string;
  private writeLock = Promise.resolve();

  constructor(customFilePath?: string) {
    if (customFilePath) {
      this.filePath = customFilePath;
    } else {
      this.filePath = path.join(process.cwd(), 'data', 'appointments.json');
    }
  }

  private async readAll(): Promise<AppointmentRecord[]> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const rawRecords = JSON.parse(content) as any[];
      if (!Array.isArray(rawRecords)) return [];

      return rawRecords.map((r) => {
        const phone = r.mobileNumber || r.phone || '';
        const phoneNorm = validatePhilippineMobileNumber(phone);
        return {
          id: r.id || crypto.randomUUID(),
          referenceCode: r.referenceCode || r.ref || `BT-APT-${Math.floor(1000 + Math.random() * 9000)}`,
          statusToken: r.statusToken || crypto.randomBytes(16).toString('hex'),
          createdAt: r.createdAt || r.submittedAt || new Date().toISOString(),
          updatedAt: r.updatedAt || r.submittedAt || new Date().toISOString(),
          clientName: r.clientName || r.fullName || 'Client',
          mobileNumber: phoneNorm.isValid && phoneNorm.normalized ? phoneNorm.normalized : phone,
          rawMobileInput: r.rawMobileInput || r.phone || '',
          email: r.email || null,
          serviceId: r.serviceId || r.treatmentId || 'general',
          serviceName: r.serviceName || r.treatmentName || 'Aesthetic Treatment',
          preferredDate: r.preferredDate || 'Flexible Schedule',
          preferredTime: r.preferredTime || 'Flexible Schedule',
          skinConcerns: r.skinConcerns || '',
          status: r.status || APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
          confirmedDate: r.confirmedDate || null,
          confirmedTime: r.confirmedTime || null,
          proposedDate: r.proposedDate || null,
          proposedTime: r.proposedTime || null,
          staffNotes: r.staffNotes || null,
          statusHistory: Array.isArray(r.statusHistory) ? r.statusHistory : [],
          smsStatus: r.smsStatus || 'none',
          smsEvents: Array.isArray(r.smsEvents) ? r.smsEvents : [],
          clinicLocation: r.clinicLocation || 'Beautique Aesthetics — Santa Rosa, Nueva Ecija, Philippines',
        } as AppointmentRecord;
      });
    } catch (err: any) {
      if (err && err.code !== 'ENOENT') {
        console.error('readAll error:', err);
      }
      return [];
    }
  }

  private async writeAll(records: AppointmentRecord[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    // Safe write
    const tempFile = `${this.filePath}.tmp.${Date.now()}`;
    await fs.writeFile(tempFile, JSON.stringify(records, null, 2), 'utf-8');
    await fs.rename(tempFile, this.filePath);
  }

  /**
   * Generates a collision-resistant human reference code (e.g. BT-APT-8275).
   * Checks for collisions against existing database entries.
   */
  private generateUniqueReference(existing: AppointmentRecord[]): string {
    const existingCodes = new Set(existing.map((r) => r.referenceCode));
    for (let attempts = 0; attempts < 100; attempts++) {
      // 4-digit code first, expand if dense
      const num = Math.floor(1000 + Math.random() * 9000);
      const code = `BT-APT-${num}`;
      if (!existingCodes.has(code)) {
        return code;
      }
    }
    // High-volume fallback
    const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `BT-APT-${suffix}`;
  }

  async create(
    data: Omit<
      AppointmentRecord,
      'id' | 'referenceCode' | 'statusToken' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'smsEvents' | 'smsStatus'
    > & { smsStatus?: AppointmentRecord['smsStatus'] }
  ): Promise<AppointmentRecord> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID(); // Internal primary key
    const statusToken = crypto.randomBytes(16).toString('hex'); // 32-char secure token for customer status check

    let createdRecord!: AppointmentRecord;

    this.writeLock = this.writeLock.then(async () => {
      const all = await this.readAll();
      const referenceCode = this.generateUniqueReference(all);

      createdRecord = {
        ...data,
        id,
        referenceCode,
        statusToken,
        createdAt: now,
        updatedAt: now,
        status: data.status || APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
        smsStatus: data.smsStatus || 'none',
        statusHistory: [
          {
            fromStatus: null,
            toStatus: data.status || APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
            changedAt: now,
            changedBy: 'customer',
            reason: 'Appointment request submitted by customer.',
          },
        ],
        smsEvents: [],
      };

      all.unshift(createdRecord);
      await this.writeAll(all);
    });

    await this.writeLock;
    return createdRecord;
  }

  async findById(id: string): Promise<AppointmentRecord | null> {
    const all = await this.readAll();
    return all.find((r) => r.id === id) || null;
  }

  async findByReference(referenceCode: string): Promise<AppointmentRecord | null> {
    const all = await this.readAll();
    const normalized = referenceCode.trim().toUpperCase();
    return all.find((r) => r.referenceCode.toUpperCase() === normalized) || null;
  }

  async findByReferenceAndToken(
    referenceCode: string,
    statusToken: string
  ): Promise<AppointmentRecord | null> {
    const all = await this.readAll();
    const normalizedRef = referenceCode.trim().toUpperCase();
    const normalizedToken = statusToken.trim();

    return (
      all.find(
        (r) =>
          r.referenceCode.toUpperCase() === normalizedRef &&
          r.statusToken === normalizedToken
      ) || null
    );
  }

  async findAll(): Promise<AppointmentRecord[]> {
    return this.readAll();
  }

  async update(id: string, updates: Partial<AppointmentRecord>): Promise<AppointmentRecord | null> {
    let updatedRecord: AppointmentRecord | null = null;

    this.writeLock = this.writeLock.then(async () => {
      const all = await this.readAll();
      const index = all.findIndex((r) => r.id === id);
      if (index === -1) {
        return;
      }

      const existing = all[index];
      const now = new Date().toISOString();

      updatedRecord = {
        ...existing,
        ...updates,
        id: existing.id, // Primary key immutable
        referenceCode: existing.referenceCode, // Human ref immutable
        statusToken: existing.statusToken, // Token immutable
        createdAt: existing.createdAt, // Created date immutable
        updatedAt: now,
      };

      all[index] = updatedRecord;
      await this.writeAll(all);
    });

    await this.writeLock;
    return updatedRecord;
  }
}

/**
 * Converts a database record into a public-safe customer status view.
 * Strips internal staff notes, complete mobile numbers, and database internal IDs.
 */
export function toPublicAppointmentStatus(record: AppointmentRecord): PublicAppointmentStatus {
  // Mask customer name (e.g. Maria Santos -> M***a S****s)
  const nameParts = record.clientName.trim().split(' ');
  const maskedName = nameParts
    .map((p) => (p.length > 2 ? `${p[0]}${'*'.repeat(p.length - 2)}${p[p.length - 1]}` : p))
    .join(' ');

  return {
    referenceCode: record.referenceCode,
    status: record.status,
    clientNameMasked: maskedName,
    serviceName: record.serviceName,
    preferredDate: record.preferredDate,
    preferredTime: record.preferredTime,
    confirmedDate: record.confirmedDate || null,
    confirmedTime: record.confirmedTime || null,
    proposedDate: record.proposedDate || null,
    proposedTime: record.proposedTime || null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    smsStatus: record.smsStatus,
  };
}
