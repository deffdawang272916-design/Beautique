import React, { useEffect } from 'react';
import { X, ShoppingBag, Phone, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
  onCheckout?: (shippingMethod: 'pickup' | 'local' | 'luzon') => void;
  shippingMethod?: 'pickup' | 'local' | 'luzon';
  setShippingMethod?: (method: 'pickup' | 'local' | 'luzon') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
}) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Skincare Products
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-amber-100/70 text-amber-800">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                Product Catalog Update
              </h3>
              <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                Online product checkout is temporarily paused while verified inventory is updated. Please contact Beautique Aesthetics directly to confirm in-clinic product stock, current pricing, and pickup or courier arrangements.
              </p>
            </div>

            <div className="pt-2 w-full space-y-2">
              <a
                href="tel:09627400487"
                className="w-full flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium py-3 px-4 rounded-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Call {CLINIC_INFO.contact.primaryBookingNumbers[0]}</span>
              </a>

              <a
                href={CLINIC_INFO.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-3 px-4 rounded-md transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message on Facebook Page</span>
              </a>
            </div>
          </div>

          {/* Footer with Safe Area */}
          <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-stone-200 bg-stone-50 text-center">
            <p className="text-[11px] text-stone-500">
              Beautique Aesthetics · Santa Rosa, Nueva Ecija, Philippines
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
