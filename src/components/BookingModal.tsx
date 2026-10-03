import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { TREATMENTS, CLINIC_INFO } from '../data/clinicData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTreatmentId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialTreatmentId,
}) => {
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(
    initialTreatmentId || TREATMENTS[0].id
  );
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Morning (10:00 AM – 12:00 PM)');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [skinConcerns, setSkinConcerns] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [statusToken, setStatusToken] = useState<string>('');
  const [directMessengerUrl, setDirectMessengerUrl] = useState<string>('');
  const [smsNotificationState, setSmsNotificationState] = useState<{
    status: string;
    isMock: boolean;
    message: string;
  } | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Body scroll lock with safe cleanup
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTreatmentId) {
      setSelectedTreatmentId(initialTreatmentId);
    }
  }, [initialTreatmentId]);

  // Reset form status when opening
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setSubmitError(null);
      setCopiedVoucher(false);
      setCopiedToken(false);
      setStatusToken('');
      setSmsNotificationState(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedTreatment = TREATMENTS.find((t) => t.id === selectedTreatmentId) || TREATMENTS[0];

  const timeOptions = [
    'Morning (10:00 AM – 12:00 PM)',
    'Early Afternoon (01:00 PM – 03:00 PM)',
    'Late Afternoon (03:00 PM – 05:00 PM)',
    'Flexible / Clinic Available Time',
  ];

  const getVoucherText = (refCode = bookingRef) => {
    return (
      `*BEAUTIQUE AESTHETICS APPOINTMENT REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Reference: ${refCode}\n` +
      `• Client Name: ${fullName}\n` +
      `• Contact Phone: ${phone}\n` +
      `• Treatment: ${selectedTreatment.name}\n` +
      `• Preferred Schedule: ${preferredDate} (${preferredTime})\n` +
      `• Location: Santa Rosa, Nueva Ecija, Philippines\n` +
      (skinConcerns ? `• Notes / Concerns: ${skinConcerns}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Status: PENDING CONFIRMATION (awaiting clinic staff review)*`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !preferredDate) return;

    // Client-side Philippine phone preliminary format check
    const cleanDigits = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!cleanDigits.startsWith('09') && !cleanDigits.startsWith('+639') && !cleanDigits.startsWith('639') && !cleanDigits.startsWith('9')) {
      setSubmitError('Please provide a valid Philippine mobile number (e.g. 0917 123 4567 or +63 9xx xxx xxxx).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          treatmentId: selectedTreatment.id,
          treatmentName: selectedTreatment.name,
          preferredDate,
          preferredTime,
          skinConcerns,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      setBookingRef(data.referenceCode);
      setStatusToken(data.statusToken || '');
      setSmsNotificationState(data.smsNotification || null);
      setDirectMessengerUrl(data.messengerContinuationUrl || `https://m.me/61561255528582`);

      // Auto-copy voucher text to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(getVoucherText(data.referenceCode)).catch(() => {});
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Unable to submit request. Please check your connection or contact the clinic.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(getVoucherText());
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  const handleCopyToken = () => {
    if (statusToken) {
      navigator.clipboard.writeText(statusToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" />
              <span>Sta. Rosa, Nueva Ecija Clinic</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 mt-0.5">
              {isSuccess ? 'Appointment Request Submitted' : 'Request an Aesthetic Appointment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75dvh] overflow-y-auto">
            
            {/* Step 1: Treatment Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                1. Select Treatment / Service *
              </label>
              <select
                value={selectedTreatmentId}
                onChange={(e) => setSelectedTreatmentId(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                {TREATMENTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.priceFormatted}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Preferred Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  2. Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  3. Preferred Time Window *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                >
                  {timeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Client Details */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                4. Client Contact Information
              </label>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  required
                  placeholder="Contact Mobile Number (09xx xxx xxxx) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />

                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              {/* Skin Concerns */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Specific Skin Concerns or Inquiries (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Skin rejuvenation, contouring, or consultation inquiry"
                  value={skinConcerns}
                  onChange={(e) => setSkinConcerns(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
            </div>

            {/* Confirmation policy note */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Notice:</strong> Promotional packages and appointment requests are subject to clinic confirmation. A clinic representative will contact you at {phone || 'your number'} to verify current operating schedule and slot availability.
              </p>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Actions: Stacks vertically on mobile (<640px) and horizontally on sm: */}
            <div className="pt-3 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-medium text-stone-600 hover:text-stone-900 text-center rounded hover:bg-stone-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 text-stone-50 text-xs sm:text-sm font-medium py-3 sm:py-2.5 px-6 rounded-md shadow-xs transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Saving & Notifying Clinic...</span>
                  </>
                ) : (
                  <span>Submit Appointment Request</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State: Request Received -> Pending Confirmation */
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-7 h-7 text-amber-700" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Status: PENDING CONFIRMATION</span>
              </div>
              <h4 className="font-serif text-2xl font-semibold text-stone-900 pt-1">
                APPOINTMENT REQUEST RECEIVED
              </h4>
              <p className="text-xs text-stone-500">
                Reference Code: <strong className="font-mono text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">{bookingRef}</strong>
              </p>
              <p className="text-xs sm:text-sm text-stone-700 mt-2 max-w-md mx-auto leading-relaxed">
                Your appointment request has been received and is awaiting confirmation from our clinic.
              </p>
            </div>

            {/* Accurate SMS Notification Status Banner */}
            {smsNotificationState?.isMock ? (
              <div className="p-3 bg-stone-100 border border-stone-300 rounded-lg text-left text-xs text-stone-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">SMS Notification (Development Mode):</span>
                  <span className="text-[11px] text-stone-600 leading-relaxed">
                    SMS simulated — development mode. In production with an approved provider, an SMS acknowledgement will be delivered to your phone.
                  </span>
                </div>
              </div>
            ) : smsNotificationState?.status === 'accepted' || smsNotificationState?.status === 'sent' || smsNotificationState?.status === 'queued' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-left text-xs text-emerald-950 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-emerald-900">SMS Acknowledgement:</span>
                  <span className="text-[11px] text-emerald-800 leading-relaxed">
                    We've sent an SMS acknowledgement to your mobile number.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left text-xs text-amber-950 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-amber-900">SMS Notice:</span>
                  <span className="text-[11px] text-amber-800 leading-relaxed">
                    We received your appointment request, but couldn't send the SMS notification. Please save your reference number.
                  </span>
                </div>
              </div>
            )}

            {/* Request Summary Card */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-left text-xs text-stone-700 space-y-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-stone-900 block">{selectedTreatment.name}</span>
                  <span className="text-stone-500">Requested for: {preferredDate} ({preferredTime})</span>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                  Pending Review
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-500 space-y-0.5">
                <p>Location: Beautique Aesthetics — Santa Rosa, Nueva Ecija, Philippines</p>
                <p>Hotlines: {CLINIC_INFO.contact.primaryPhoneDisplay}</p>
              </div>
            </div>

            {/* Secure Status Verification Code */}
            {statusToken && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold uppercase tracking-wider text-stone-700">Status Verification Key</span>
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className="text-amber-800 hover:text-amber-900 font-medium underline flex items-center gap-1"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-stone-800 break-all bg-white p-1.5 rounded border border-stone-200">
                  {statusToken}
                </p>
                <p className="text-[10px] text-stone-500">
                  Keep this verification key alongside your reference code ({bookingRef}) to check your appointment status online.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-1 flex flex-col gap-2.5">
              <a
                href={directMessengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0084FF] hover:bg-blue-600 text-white font-medium text-xs sm:text-sm py-3 px-4 rounded-md transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CONTINUE ON MESSENGER (OPTIONAL)</span>
              </a>

              <button
                type="button"
                onClick={handleCopyVoucher}
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm py-2 px-4 rounded-md transition-colors border border-stone-200"
              >
                {copiedVoucher ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedVoucher ? 'Summary Copied to Clipboard!' : 'Copy Request Summary'}</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 text-xs">
                <a
                  href="tel:09627400487"
                  className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 font-medium py-2 px-3 rounded-md border border-stone-200"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call 0962 740 0487</span>
                </a>
                <a
                  href="tel:09303441943"
                  className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 font-medium py-2 px-3 rounded-md border border-stone-200"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call 0930 344 1943</span>
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 pt-1 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
