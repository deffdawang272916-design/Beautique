import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';
import { CLINIC_INFO, ZAFRA_CLINIC_INFO, TREATMENTS, TRAINING_COURSES, FAQS, BER_MONTHS_PROMOTIONS } from './src/data/clinicData.ts';
import { MACHINE_INVENTORY } from './src/data/machineData.ts';
import { FileAppointmentRepository } from './server/repositories/appointmentRepository.ts';
import { SmsService } from './server/sms/smsService.ts';
import { createAppointmentRouter } from './server/routes/appointmentRoutes.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Repository and SMS Service
const appointmentRepository = new FileAppointmentRepository(path.join(__dirname, 'data', 'appointments.json'));
const smsService = new SmsService();

// Mount Production Appointment Lifecycle & SMS Router
app.use('/api', createAppointmentRouter(appointmentRepository, smsService));

// Grounding knowledge for the Beautique Aesthetics digital concierge
const CLINIC_KNOWLEDGE = `
PRIMARY CLINIC: ${CLINIC_INFO.name} (${CLINIC_INFO.fullName})
SLOGAN: "${CLINIC_INFO.slogan}"
LOCATION: ${CLINIC_INFO.displayLocation}
NOTE ON ADDRESS: Primary verified location for Beautique Aesthetics is Santa Rosa, Nueva Ecija, Philippines. (Do not invent unverified street addresses).
PRIMARY CONTACT NUMBERS: ${CLINIC_INFO.contact.primaryPhoneDisplay}
FACEBOOK PAGE: ${CLINIC_INFO.contact.facebookUrl}
OWNER / FOUNDER: ${CLINIC_INFO.owner} (also referenced as ${CLINIC_INFO.ownerAliases.join(', ')})

SEPARATE / ASSOCIATED LOCATION:
NAME: ${ZAFRA_CLINIC_INFO.name} (${ZAFRA_CLINIC_INFO.fullName})
LOCATION: ${ZAFRA_CLINIC_INFO.address.fullDisplay}
INSTAGRAM: ${ZAFRA_CLINIC_INFO.instagramUrl}

OPERATING HOURS: ${CLINIC_INFO.operatingHoursNotice}
PAYMENT METHODS: ${CLINIC_INFO.paymentNotice}
RETAIL PRODUCTS: ${CLINIC_INFO.productNotice}

ACCREDITATION & ACADEMY:
Organization: ${CLINIC_INFO.trainingOrganization}
International Accreditation:
- 7 Star Accredited Academy conferred by the International Education Board (IEB), Dept. of Aesthetics & Cosmetology (Certificate No. PHIL121808, July 2022 – July 2027)
- Founder on Certificate: Amelyn Medina
Training Collaboration:
- In collaboration with Bareface Beautique Wellness and Beauty Clinic, Del Pilar, Santa Rosa, Nueva Ecija.
- TESDA-related training information is associated with the collaboration with Bareface Beautique Wellness and Beauty Clinic.
Course Offering: Master Course in Aesthetics (5-Day Full Aesthetic Course Training including Training on Costing and Pricing)

PROMOTIONAL OFFERS (BER Months Promotional Materials):
Note: Materials display "ZAFRA Skin & Aesthetics Center by Beautech Aesthetic". Availability at Santa Rosa requires confirmation.
${BER_MONTHS_PROMOTIONS.map(p => `- ${p.name}: ${p.package || (p.sessions ? `${p.sessions} sessions` : '') || (p.pricingUnit ? `per ${p.pricingUnit}` : '')} — ₱${p.promoPrice.toLocaleString()}${p.pricingUnit ? ` / ${p.pricingUnit}` : ''}. ${p.wording ? `"${p.wording}".` : ''} ${p.options ? `Options: ${p.options.join(' or ')}.` : ''} ${p.treatmentArea ? `Area: ${p.treatmentArea}.` : ''} ${p.inclusion ? `Inclusion: ${p.inclusion}.` : ''}`).join('\n')}

ALL SERVICES IN CLINIC CATALOG:
${TREATMENTS.map(t => `- ${t.name} (${t.categoryLabel}): ${t.priceFormatted}. ${t.tagline || ''} ${t.packageDetails ? `[Package: ${t.packageDetails}]` : ''}`).join('\n')}

AESTHETIC MACHINES & EQUIPMENT SUPPLY (INQUIRY-BASED):
Note: Equipment is offered on an inquiry basis. Prices, technical specifications, and warranty must be confirmed directly with clinic staff. Dermashine PRO is an automated mesotherapy injection delivery system (never describe as fractional RF).
${MACHINE_INVENTORY.map(m => `- ${m.name} [${m.categoryLabel}]: ${m.shortDescription} (Pricing: Inquire for Price)`).join('\n')}

FREQUENTLY ASKED QUESTIONS:
${FAQS.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}
`;

const SYSTEM_INSTRUCTION = `
You are the Beautique Concierge, the official digital assistant for Beautique Aesthetics (Santa Rosa, Nueva Ecija).
Your role is to assist clients using ONLY verified business facts.

CRITICAL LOCATION & BUSINESS SEPARATION:
1. Primary Business: Beautique Aesthetics — Santa Rosa, Nueva Ecija, Philippines. (Slogan: "${CLINIC_INFO.slogan}").
2. Separate Location: ZAFRA Skin & Aesthetics Center is located in Cabanatuan City (E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe, Cabanatuan City, Nueva Ecija 3100, Philippines).
3. Do NOT merge the two locations or invent a street address for Beautique Santa Rosa.
4. Promotional materials marked "ZAFRA Skin & Aesthetics Center by Beautech Aesthetic" require confirmation for applicability at Santa Rosa.

ACCREDITATION & COLLABORATION:
- Beautique Aesthetic Training Center is accredited by the International Education Board (IEB) as a 7 Star Accredited Academy (Certificate No. PHIL121808). Founder named on certificate: Amelyn Medina.
- Training Collaboration: In collaboration with Bareface Beautique Wellness and Beauty Clinic (Del Pilar, Santa Rosa, Nueva Ecija). TESDA-related training information is associated with this collaboration.

MEDICAL SAFETY:
- Never diagnose or provide medical clearance. Direct client to clinic staff for an in-person assessment.
`;

const DATA_DIR = path.resolve(__dirname, 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications_log.json');

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Failed to write to ${filePath}:`, err);
  }
}

async function dispatchClinicNotification(notification: any) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, ...notification };

  // 1. Console notification logging for real-time staff awareness
  console.log(`\n======================================================`);
  console.log(`[CLINIC NOTIFICATION DISPATCHED]`);
  console.log(`Type: ${entry.type || 'Appointment Request'}`);
  console.log(`Ref: ${entry.ref}`);
  console.log(`Client: ${entry.client} | Phone: ${entry.phone}`);
  console.log(`Item/Service: ${entry.service || entry.equipment}`);
  console.log(`Schedule: ${entry.schedule || 'N/A'}`);
  console.log(`Notes: ${entry.notes || 'None'}`);
  console.log(`Branch: Beautique Aesthetics — Santa Rosa, Nueva Ecija`);
  console.log(`======================================================\n`);

  // 2. Persistent notification log
  const logs = await readJsonFile<any[]>(NOTIFICATIONS_FILE, []);
  logs.unshift(entry);
  await writeJsonFile(NOTIFICATIONS_FILE, logs);

  // 3. Optional Webhook dispatch (if configured in environment)
  const webhookUrl = process.env.CLINIC_NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      console.log(`[CLINIC NOTIFICATION] Webhook dispatched successfully.`);
    } catch (err) {
      console.warn(`[CLINIC NOTIFICATION] Webhook forward error:`, err);
    }
  }
}

// ----------------------------------------------------
// EQUIPMENT INQUIRIES API: Submit Inquiry → Stored → Notified → Confirmed
// ----------------------------------------------------

app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, clinicName, notes, machineName, machineCategory, machineId } = req.body;
    if (!fullName || !phone || !machineName) {
      return res.status(400).json({ error: 'Full name, contact phone, and machine name are required.' });
    }

    const ref = `BT-EQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry = {
      id: ref,
      ref,
      fullName: fullName.trim(),
      phone: phone.trim(),
      clinicName: clinicName ? clinicName.trim() : null,
      notes: notes ? notes.trim() : '',
      machineId: machineId || '',
      machineName: machineName.trim(),
      machineCategory: machineCategory || 'Aesthetic Equipment',
      status: 'inquiry_received',
      submittedAt: new Date().toISOString(),
    };

    const inquiries = await readJsonFile<any[]>(INQUIRIES_FILE, []);
    inquiries.unshift(newInquiry);
    await writeJsonFile(INQUIRIES_FILE, inquiries);

    await dispatchClinicNotification({
      type: 'equipment_inquiry',
      ref,
      client: newInquiry.fullName,
      phone: newInquiry.phone,
      equipment: newInquiry.machineName,
      clinic: newInquiry.clinicName,
      notes: newInquiry.notes,
    });

    const messengerDirectUrl = `https://m.me/61561255528582?text=${encodeURIComponent(
      `*BEAUTIQUE AESTHETICS — MACHINE SUPPLY INQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Reference: ${ref}\n` +
      `• Equipment: ${newInquiry.machineName}\n` +
      `• Inquirer Name: ${newInquiry.fullName}\n` +
      `• Contact Number: ${newInquiry.phone}\n` +
      (newInquiry.clinicName ? `• Clinic / Practice: ${newInquiry.clinicName}\n` : '') +
      (newInquiry.notes ? `• Specific Request: ${newInquiry.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello Beautique Aesthetics Sta. Rosa, I submitted this equipment inquiry via your online catalog. Please confirm current pricing, unit availability, and package inclusions. Thank you!`
    )}`;

    return res.status(201).json({
      success: true,
      ref,
      inquiry: newInquiry,
      notification: {
        dispatched: true,
        channel: 'Meta Business Suite & Clinic Storage Log',
        message: 'Equipment inquiry logged and dispatched to Santa Rosa staff.'
      },
      messengerDirectUrl,
    });
  } catch (error: any) {
    console.error('Error submitting inquiry:', error);
    return res.status(500).json({ error: 'Failed to record equipment inquiry.' });
  }
});

app.get('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const inquiries = await readJsonFile<any[]>(INQUIRIES_FILE, []);
    return res.json({ inquiries, count: inquiries.length });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve inquiries.' });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userMessage } = req.body;
    const promptText = userMessage || (messages && messages[messages.length - 1]?.content) || '';

    if (!promptText.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const reply = generateFallbackResponse(promptText);
      return res.json({ reply });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nClinic Knowledge:\n${CLINIC_KNOWLEDGE}\n\nClient inquiry: ${promptText}` }],
        },
      ],
    });

    const reply = response.text || generateFallbackResponse(promptText);
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    const userMsg = req.body?.userMessage || '';
    const fallback = generateFallbackResponse(userMsg);
    return res.json({ reply: fallback });
  }
});

// Intelligent factual fallback
function generateFallbackResponse(query: string): string {
  const lower = query.toLowerCase();

  // Medical boundary check first
  if (
    lower.includes('pregnancy') ||
    lower.includes('pregnant') ||
    lower.includes('breastfeeding') ||
    lower.includes('safe for me') ||
    lower.includes('side effect') ||
    lower.includes('candidate') ||
    lower.includes('downtime') ||
    lower.includes('contraindication') ||
    lower.includes('allergy') ||
    lower.includes('allergic')
  ) {
    return `Medical candidacy, safety, and specific aftercare must be evaluated directly by qualified clinic personnel during an in-person assessment. Please contact Beautique Aesthetics at 0962 740 0487 or 0930 344 1943.`;
  }

  // HIFU VMAX
  if (lower.includes('hifu vmax') || (lower.includes('hifu') && (lower.includes('vmax') || lower.includes('unlimited') || lower.includes('6 month')))) {
    return `The BER Months Promo material advertises HIFU VMAX with Unlimited sessions for 6 months at ₱15,000. It is advertised to help lift and firm the appearance of the face and jawline. Please contact 0962 740 0487 or 0930 344 1943 to confirm availability.`;
  }

  // Location / Address
  if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('saan') || lower.includes('cabanatuan') || lower.includes('santa rosa')) {
    return `Beautique Aesthetics is located in Santa Rosa, Nueva Ecija, Philippines. (For ZAFRA Skin & Aesthetics Center, the location is E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe, Cabanatuan City, Nueva Ecija 3100). For inquiries, please call or text 0962 740 0487 / 0930 344 1943.`;
  }

  // TESDA Accreditation Inquiry
  if (lower.includes('tesda')) {
    return `TESDA-related training information is associated with the collaboration with Bareface Beautique Wellness and Beauty Clinic in Del Pilar, Santa Rosa, Nueva Ecija. Beautique Aesthetic Training Center holds verified international accreditation as a 7 Star Accredited Academy from the International Education Board (IEB, Certificate No. PHIL121808).`;
  }

  // Training / Academy
  if (lower.includes('train') || lower.includes('course') || lower.includes('academy') || lower.includes('batc') || lower.includes('accredit') || lower.includes('ieb')) {
    return `Beautique Aesthetic Training Center offers the Master Course in Aesthetics (5-Day Full Aesthetic Course Training), including comprehensive practical workflows and Training on Costing and Pricing. The academy is accredited by the International Education Board (IEB) as a 7 Star Accredited Academy (Certificate No. PHIL121808, July 2022 – July 2027) and operates in collaboration with Bareface Beautique Wellness and Beauty Clinic. Please contact 0962 740 0487 for upcoming batch schedules.`;
  }

  // Machine and Equipment Supply
  if (
    lower.includes('machine') ||
    lower.includes('equipment') ||
    lower.includes('suprano') ||
    lower.includes('picodiode') ||
    lower.includes('dermashine') ||
    lower.includes('steamer') ||
    lower.includes('thermalift') ||
    lower.includes('alice bubble') ||
    lower.includes('exilift') ||
    lower.includes('hydra top')
  ) {
    return `Beautique Aesthetics offers professional aesthetic machines and clinic supplies for inquiry, including laser systems (Suprano Diode 2 Handles, Picodiode, ND:YAG, CO2, Pico lasers), HIFU & RF lifting platforms (VMAX, 7D, 5D RF, Exilift), Dermashine PRO (automated mesotherapy delivery system), hydro-facial workstations, treatment beds, and clinic supplies. Please contact our team at 0962 740 0487 or 0930 344 1943 or via Facebook Messenger for pricing and availability.`;
  }

  // Contact / Phone
  if (lower.includes('contact') || lower.includes('number') || lower.includes('phone') || lower.includes('messenger') || lower.includes('facebook')) {
    return `You can reach Beautique Aesthetics — Santa Rosa, Nueva Ecija directly via mobile: 0962 740 0487 or 0930 344 1943, or via our official Facebook page: https://www.facebook.com/p/Beautique-Aesthetic-Clinic-StaRosa-NE-Branch-61561255528582/`;
  }

  return `Welcome to Beautique Aesthetics ("Where Beauty Meets Affordability"). How can I help you today? You can ask about our aesthetic treatments, our location in Santa Rosa, Nueva Ecija, Beautique Aesthetic Training Center accreditations (7 Star IEB Academy), or promotional packages. For bookings, call or text 0962 740 0487 / 0930 344 1943.`;
}

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
