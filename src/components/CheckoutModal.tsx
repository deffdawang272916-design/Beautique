import React, { useState, useEffect } from 'react';
import { X, CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: any[];
  shippingMethod?: string;
  onClearCart?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900">
              {isSubmitted ? 'Product Inquiry Received' : 'Skincare Product Inquiry'}
            </h3>
            <p className="text-xs text-stone-500">
              Beautique Aesthetics — Santa Rosa, Nueva Ecija
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close product inquiry dialog"
            className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75dvh] overflow-y-auto">
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
              <p className="font-semibold">Notice on Skincare Products & Payment:</p>
              <p className="mt-0.5">
                Product catalog updates are currently in progress. Please submit your inquiry below or call our clinic directly to confirm in-clinic skincare lines, availability, payment options, and collection/delivery.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maria Santos"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Contact Number *
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Product Inquiry Details (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="What skincare products or concerns would you like to inquire about?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Actions: Stacks vertically on mobile (<640px) and horizontally on sm: */}
            <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-medium text-stone-600 hover:text-stone-900 text-center rounded hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium py-3 sm:py-2.5 px-6 rounded-md transition-colors text-center"
              >
                Send Product Inquiry
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-semibold text-stone-900">
                Thank you, {fullName}!
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
                Your product inquiry has been received. Our clinic staff will contact you at <strong>{phone}</strong> to confirm product availability and payment/delivery details.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={CLINIC_INFO.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on Facebook Page</span>
              </a>

              <button
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 pt-1"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
