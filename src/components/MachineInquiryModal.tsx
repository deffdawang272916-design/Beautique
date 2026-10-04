import React, { useState, useEffect } from 'react';
import { X, CheckCircle, MessageCircle, Phone, Copy, Check, Zap, AlertCircle } from 'lucide-react';
import { MachineItem } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface MachineInquiryModalProps {
  machine: MachineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MachineInquiryModal: React.FC<MachineInquiryModalProps> = ({
  machine,
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryRef, setInquiryRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [formattedMessage, setFormattedMessage] = useState('');
  const [directMessengerUrl, setDirectMessengerUrl] = useState('');

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

  // Reset form when machine changes or opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setCopied(false);
      setFormattedMessage('');
      setDirectMessengerUrl('');
      if (machine) {
        setNotes(machine.inquiryMessage || `I'm interested in the ${machine.name} machine. Please send me its current price and availability.`);
      }
    }
  }, [isOpen, machine]);

  if (!isOpen || !machine) return null;

  const buildInquiryText = (ref: string) => {
    return (
      `*BEAUTIQUE AESTHETICS — MACHINE SUPPLY INQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Reference: ${ref}\n` +
      `• Equipment: ${machine.name} (${machine.categoryLabel})\n` +
      `• Inquirer Name: ${fullName}\n` +
      `• Contact Number: ${phone}\n` +
      (clinicName ? `• Clinic / Practice: ${clinicName}\n` : '') +
      (notes ? `• Specific Request: ${notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello Beautique Aesthetics Sta. Rosa, I submitted this equipment inquiry via your online catalog. Please confirm current pricing, unit availability, and package inclusions. Thank you!`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          clinicName,
          notes,
          machineId: machine.id,
          machineName: machine.name,
          machineCategory: machine.categoryLabel,
        }),
      });

      const data = await res.json();
      const ref = data.ref || `BT-EQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const msg = buildInquiryText(ref);
      const mUrl = data.messengerDirectUrl || `https://m.me/61561255528582?text=${encodeURIComponent(msg)}`;

      setInquiryRef(ref);
      setFormattedMessage(msg);
      setDirectMessengerUrl(mUrl);

      // Auto-copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(msg).catch(() => {});
      }

      // Direct Meta Business Suite / Messenger Handshake
      try {
        window.open(mUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Popup blocked, available via continuation button', err);
      }

      setIsSuccess(true);
    } catch (err) {
      // Fallback local flow if network issue
      const ref = `BT-EQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const msg = buildInquiryText(ref);
      const mUrl = `https://m.me/61561255528582?text=${encodeURIComponent(msg)}`;
      setInquiryRef(ref);
      setFormattedMessage(msg);
      setDirectMessengerUrl(mUrl);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = () => {
    if (formattedMessage) {
      navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-dialog-title"
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Aesthetic Machine & Equipment Inquiry</span>
            </div>
            <h3 id="inquiry-dialog-title" className="font-serif text-lg sm:text-xl font-semibold text-stone-900 mt-0.5">
              {isSuccess ? 'Inquiry Submitted' : `Inquire: ${machine.name}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close machine inquiry modal"
            className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Equipment Badge Summary */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-900 block">{machine.name}</span>
                <span className="text-stone-500">{machine.categoryLabel} · {machine.pricingDisplay}</span>
              </div>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                {machine.statusBadge}
              </span>
            </div>

            {/* Input 1: Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. / Practitioner Maria Santos"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Input 2: Contact Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 09xx xxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Input 3: Clinic / Practice Name (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Clinic, Salon, or Practice Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Aesthetics Suite, Santa Rosa"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Input 4: Notes / Specific Inquiry */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Specific Inquiries or Request (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Pricing, unit demo schedule, warranty details, inclusions, or delivery to our area."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Notice:</strong> Machine orders and equipment supplies are processed on an inquiry basis. A representative will contact you directly to confirm pricing, technical configurations, and delivery schedules.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-stone-200">
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
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 text-stone-50 text-xs sm:text-sm font-medium py-3 sm:py-2.5 px-6 rounded-md transition-colors text-center cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Logging Inquiry...</span>
                  </>
                ) : (
                  <span>Submit Machine Inquiry</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen: Direct Meta Business Suite / Messenger Handshake */
          <div className="p-5 sm:p-7 space-y-5 text-center flex-1 overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Messenger Handshake Ready</span>
              </div>
              <h4 className="font-serif text-2xl font-semibold text-stone-900">
                Inquiry Logged & Messenger Opened
              </h4>
              <p className="text-xs text-stone-500">
                Reference Code: <strong className="font-mono text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">{inquiryRef}</strong>
              </p>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. A direct chat with <strong>Beautique Aesthetic Clinic Sta.Rosa NE Branch</strong> has been opened. Your inquiry details for the <strong>{machine.name}</strong> have been pre-filled and copied to your clipboard.
              </p>
            </div>

            {/* Formatted Message Preview Box */}
            <div className="text-left bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-500 border-b border-stone-200/80 pb-1.5">
                <span className="font-semibold uppercase tracking-wider text-stone-700">Pre-Filled Inquiry Text</span>
                <span className="text-emerald-700 font-medium">Copied to Clipboard</span>
              </div>
              <pre className="font-mono text-[11px] text-stone-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                {formattedMessage}
              </pre>
            </div>

            {/* Quick Actions */}
            <div className="pt-1 flex flex-col gap-2.5 max-w-md mx-auto">
              <a
                href={directMessengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0084FF] hover:bg-blue-600 text-white font-medium text-xs sm:text-sm py-3 px-4 rounded-md transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue in Facebook Messenger</span>
              </a>

              <button
                type="button"
                onClick={handleCopyText}
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm py-2.5 px-4 rounded-md transition-colors border border-stone-300"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Inquiry Copied to Clipboard!' : 'Re-Copy Inquiry Details'}</span>
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
            </div>

            <div className="pt-2 text-[11px] text-stone-500 max-w-sm mx-auto leading-normal">
              Staff and the clinic owner monitor Facebook Messenger via Meta Business Suite for prompt response.
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
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
