import React, { useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Zap, 
  Activity, 
  Droplets, 
  Syringe, 
  Armchair, 
  Layers,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { MachineItem } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'laser':
        return <Zap className="w-8 h-8 text-amber-700" />;
      case 'hifu-rf':
        return <Activity className="w-8 h-8 text-amber-700" />;
      case 'facial':
        return <Droplets className="w-8 h-8 text-amber-700" />;
      case 'injection':
        return <Syringe className="w-8 h-8 text-amber-700" />;
      case 'equipment':
        return <Armchair className="w-8 h-8 text-amber-700" />;
      case 'supplies':
        return <Layers className="w-8 h-8 text-amber-700" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-700" />;
    }
  };

  const messengerInquiryUrl = `${CLINIC_INFO.contact.messengerUrl}?text=${encodeURIComponent(
    `Hello Beautique Aesthetics, I am inquiring about the ${machine.name} regarding current pricing, availability, and demonstration details.`
  )}`;

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
              · Beautique Aesthetics Machine Supply
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
          
          {/* Visual Presentation Box */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/40 rounded-xl border border-stone-200/90 flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            {machine.image ? (
              <img
                src={encodeURI(machine.image)}
                alt={machine.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center">
                  {getCategoryIcon(machine.category)}
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest font-semibold text-stone-700">
                    Aesthetic Equipment
                  </span>
                  <p className="text-[11px] text-stone-500 max-w-xs">
                    Official equipment photograph pending client catalogue upload. Inquire directly for verified unit visuals.
                  </p>
                </div>
              </div>
            )}

            <div className="absolute top-3 right-3">
              <span className="bg-[#1C1917] text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded shadow-xs">
                {machine.statusBadge}
              </span>
            </div>
          </div>

          {/* Title & Core Overview */}
          <div className="space-y-2">
            <h3 id="machine-title" className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              {machine.name}
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              {machine.shortDescription}
            </p>
          </div>

          {/* Detailed Overview */}
          {machine.overview && (
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Equipment Overview
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                {machine.overview}
              </p>
            </div>
          )}

          {/* Key Features */}
          {machine.keyFeatures && machine.keyFeatures.length > 0 && (
            <div className="space-y-3 pt-1 border-t border-stone-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>Verified Configuration Highlights</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {machine.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusions & Supply Terms */}
          <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-4 sm:p-5 space-y-2.5 text-xs text-stone-700">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/70">
              <span className="text-stone-500 font-medium">Pricing:</span>
              <span className="font-semibold text-amber-900 text-right">{machine.pricingDisplay}</span>
            </div>
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/70">
              <span className="text-stone-500 font-medium">Availability:</span>
              <span className="font-medium text-stone-800 text-right">{machine.availabilityNote}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-500 font-medium">Inclusions / Package:</span>
              <span className="font-medium text-stone-700 text-right italic">
                {machine.inclusionsNote || 'Contact clinic for current package inclusions and specifications.'}
              </span>
            </div>
          </div>

          {/* Factual Disclaimer */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-500 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Inquiry Notice:</strong> Equipment pricing, warranty terms, lead times, demonstration arrangements, and handpiece inclusions are confirmed directly with Beautique Aesthetics. Device operation should comply with applicable local clinic regulatory standards.
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] text-stone-500 block uppercase">Commercial Terms</span>
            <span className="font-serif text-sm sm:text-base font-semibold text-stone-900">
              Inquire for Price & Demo
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
              <span>Inquire About This Machine</span>
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
