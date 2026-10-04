import React, { useEffect } from 'react';
import { X, Calendar, CheckCircle2, AlertCircle, Sparkles, Tag } from 'lucide-react';
import { Treatment } from '../types';
import { getSafeImageUrl, handleImageFallback } from '../utils/imageUtils';

interface TreatmentDetailModalProps {
  treatment: Treatment | null;
  onClose: () => void;
  onBook: (treatmentId: string) => void;
}

export const TreatmentDetailModal: React.FC<TreatmentDetailModalProps> = ({
  treatment,
  onClose,
  onBook,
}) => {
  // Body scroll lock with safe cleanup
  useEffect(() => {
    if (treatment) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [treatment]);

  if (!treatment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="treatment-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-sm border border-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100 overflow-hidden">
          <img
            src={getSafeImageUrl(treatment.image)}
            alt={treatment.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            onError={handleImageFallback}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-300">
                {treatment.categoryLabel}
              </span>
              {treatment.promotionName && (
                <span className="inline-flex items-center gap-1 bg-amber-800/90 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                  <Tag className="w-3 h-3" />
                  <span>{treatment.promotionName}</span>
                </span>
              )}
            </div>
            <h3 id="treatment-title" className="font-serif text-2xl sm:text-3xl font-semibold mt-1">
              {treatment.name}
            </h3>
            {treatment.tagline && (
              <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-1">
                {treatment.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Quick Specifications Metadata (Unboxed) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-y border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block">Rate / Status</span>
              <span className="font-semibold text-stone-900 text-sm">{treatment.priceFormatted}</span>
              {treatment.promotionName && (
                <span className="text-[10px] text-amber-800 block">Promotional price</span>
              )}
            </div>
            {treatment.packageDetails ? (
              <div>
                <span className="text-stone-500 block">Package Details</span>
                <span className="font-semibold text-stone-900 text-sm">{treatment.packageDetails}</span>
              </div>
            ) : treatment.targetAreas ? (
              <div>
                <span className="text-stone-500 block">Target Areas</span>
                <span className="font-semibold text-stone-900 text-sm">{treatment.targetAreas.join(', ')}</span>
              </div>
            ) : (
              <div>
                <span className="text-stone-500 block">Terms</span>
                <span className="font-semibold text-stone-900 text-sm">Subject to clinic confirmation</span>
              </div>
            )}
            <div>
              <span className="text-stone-500 block">Consultation</span>
              <span className="font-semibold text-stone-900 text-sm">Required prior to treatment</span>
            </div>
          </div>

          {treatment.statusNote && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded text-xs text-amber-900 font-medium">
              Notice: {treatment.statusNote}
            </div>
          )}

          {/* Description */}
          {treatment.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Treatment Information
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                {treatment.description}
              </p>
            </div>
          )}

          {/* Advertised Claims */}
          {treatment.advertisedClaims && treatment.advertisedClaims.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                Advertised Promotional Features
              </h4>
              <p className="text-[11px] text-stone-500 italic mb-2">
                Presented as wording from the clinic's promotional material, not as guaranteed medical outcomes:
              </p>
              <div className="space-y-1.5">
                {treatment.advertisedClaims.map((claim, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{claim}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Consultation Note */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Assessment & Terms:</strong> Promotional availability and terms are subject to confirmation with the clinic. Medical suitability, candidate evaluation, and personalized treatment plans must be evaluated in person by qualified clinic personnel. Contact our Santa Rosa clinic at 0962 740 0487 / 0930 344 1943.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-stone-500 block">Rate Status</span>
            <span className="font-serif text-sm sm:text-base font-semibold text-stone-900">
              {treatment.priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 text-center rounded hover:bg-stone-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(treatment.id);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md shadow-sm transition-all text-center"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Request Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
