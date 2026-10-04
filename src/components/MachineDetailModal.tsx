import React, { useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { MachineItem } from '../types';
import { CLINIC_INFO } from '../data/clinicData';
import { getSafeImageUrl, handleImageFallback } from '../utils/imageUtils';

interface MachineDetailModalProps {
  machine: MachineItem | null;
  onClose: () => void;
  onOpenInquiry: (machine: MachineItem) => void;
}

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({
  machine,
  onClose,
  onOpenInquiry,
}) => {
  // Body scroll lock with safe cleanup
  useEffect(() => {
    if (machine) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [machine]);

  if (!machine) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="machine-title"
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-100/70 border border-amber-200 px-2.5 py-0.5 rounded">
              {machine.categoryLabel}
            </span>
            <span className="text-xs text-stone-500 hidden sm:inline">
              · Beautech Aesthetic Equipment Catalog
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close machine details dialog"
            className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* Large Product Image */}
          <div className="relative w-full aspect-[16/10] bg-[#FAF8F5] rounded-xl border border-stone-200/90 flex flex-col items-center justify-center text-center p-4 sm:p-6 overflow-hidden">
            <img
              src={getSafeImageUrl(machine.image)}
              alt={machine.name}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={handleImageFallback}
            />

            <div className="absolute top-3 right-3">
              <span className="bg-[#1C1917] text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded shadow-xs">
                {machine.statusBadge || 'Equipment Inquiry'}
              </span>
            </div>
          </div>

          {/* Machine Name & Short Overview */}
          <div className="space-y-2">
            <h3 id="machine-title" className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              {machine.name}
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              {machine.overview || machine.shortDescription}
            </p>
          </div>

          {/* FUNCTIONS */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>FUNCTIONS</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              {machine.functions.map((func, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{func}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BENEFITS */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>BENEFITS</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              {machine.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  <span className="leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inclusions & Specifications Notice */}
          {machine.inclusionsNote && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-4 text-xs text-stone-600">
              <span className="font-semibold text-stone-900 block mb-1">Standard Inclusions:</span>
              <p className="leading-relaxed">{machine.inclusionsNote}</p>
            </div>
          )}

          {/* INQUIRY CTA BOX */}
          <div className="bg-amber-50/60 rounded-xl border border-amber-200/80 p-5 space-y-3">
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-900">
                Interested in this machine?
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                Contact Beautech Aesthetic for product availability, pricing, and additional information.
              </p>
            </div>
            
            <button
              onClick={() => {
                onClose();
                onOpenInquiry(machine);
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-sm py-3 px-5 rounded-md transition-colors cursor-pointer text-center shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>Inquire Now</span>
            </button>
          </div>

          {/* Compliance & Consultation Notice */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-500 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Professional Notice:</strong> Device pricing, availability, and demonstration arrangements are subject to direct inquiry with Beautech Aesthetic. Aesthetic equipment operation should follow applicable professional standards.
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] text-stone-500 block uppercase">Commercial Terms</span>
            <span className="font-serif text-sm sm:text-base font-semibold text-stone-900">
              {machine.pricingDisplay || 'Inquire for Price'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenInquiry(machine);
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-2.5 px-4 rounded-md transition-colors cursor-pointer text-center shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>Inquire Now</span>
            </button>

            <a
              href="tel:09627400487"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-medium text-xs sm:text-sm py-2.5 px-3.5 rounded-md transition-colors text-center"
            >
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>Call Clinic</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
