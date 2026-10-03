import React, { useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { Product } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenBooking?: (treatmentName?: string) => void;
  onOpenChat?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenBooking,
}) => {
  // Body scroll lock with safe cleanup
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white shadow-sm transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Header */}
        <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden border-b border-stone-100">
          <img
            src={encodeURI(product.image)}
            alt={`${product.name} packaging`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-amber-900 border border-amber-200/80 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>{product.statusBadge || 'Available by inquiry'}</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
              {product.category}
            </span>
            <h3 id="product-title" className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              {product.name}
            </h3>
            <p className="text-sm text-stone-600 font-light mt-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Key Product Details */}
          {product.keyDetails && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-4 sm:p-5 space-y-2.5 text-xs text-stone-700">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/70">
                <span className="text-stone-500 font-medium">Product:</span>
                <span className="font-semibold text-stone-900 text-right">{product.keyDetails.product}</span>
              </div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/70">
                <span className="text-stone-500 font-medium">Type:</span>
                <span className="font-medium text-stone-800 text-right">{product.keyDetails.type}</span>
              </div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/70">
                <span className="text-stone-500 font-medium">Intended Use:</span>
                <span className="font-medium text-stone-800 text-right">{product.keyDetails.intendedUse}</span>
              </div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/70">
                <span className="text-stone-500 font-medium">Availability:</span>
                <span className="font-semibold text-amber-900 text-right">{product.keyDetails.availability}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-500 font-medium">Pricing:</span>
                <span className="font-medium text-stone-700 text-right italic">Subject to clinic confirmation</span>
              </div>
            </div>
          )}

          {/* Displayed Benefits */}
          {product.displayedBenefits && product.displayedBenefits.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Product Highlights</span>
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {product.displayedBenefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-lg text-xs text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-700">
              <Info className="w-3.5 h-3.5 text-amber-800" />
              <span>Inquiry Notice</span>
            </div>
            <p className="leading-relaxed">
              Product availability, treatment suitability, inclusions, and pricing are subject to clinic confirmation. Individual results may vary. Please consult Beautique Aesthetics directly before booking or purchasing any aesthetic treatment or product.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="tel:09627400487"
                className="flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-3 px-4 rounded-md transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Call 0962 740 0487</span>
              </a>

              <a
                href="tel:09303441943"
                className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 font-medium text-xs sm:text-sm py-3 px-4 rounded-md transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-800" />
                <span>Call 0930 344 1943</span>
              </a>
            </div>

            <a
              href={CLINIC_INFO.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-3 px-4 rounded-md transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via Facebook Messenger</span>
            </a>

            {onOpenBooking && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking(`Inquiry: ${product.name}`);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-medium text-xs sm:text-sm py-2.5 px-4 rounded-md transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-800" />
                <span>Book Clinic Consultation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
