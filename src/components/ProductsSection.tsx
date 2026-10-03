import React, { useState } from 'react';
import { 
  Sparkles, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { CLINIC_INFO, PRODUCTS } from '../data/clinicData';
import { Product } from '../types';

interface ProductsSectionProps {
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onDirectOrder?: (product: Product) => void;
  onOpenBooking?: (treatmentId?: string) => void;
  onOpenChat?: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onOpenBooking,
  onOpenChat,
}) => {
  const [activeInquiryProduct, setActiveInquiryProduct] = useState<Product | null>(null);

  const handleInquireProduct = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setActiveInquiryProduct(product);
    }
  };

  return (
    <section id="products-section" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Existing Intro Section & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            IN-CLINIC AESTHETIC PRODUCTS
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Product Availability & Inquiries
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Please contact Beautique Aesthetics directly for current product availability and in-clinic skincare lines. Explore selected aesthetic products offered through Beautique Aesthetics. Availability, suitability, and pricing may vary. Please inquire directly with the clinic for confirmation.
          </p>
        </div>

        {/* 2-Column Responsive Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto items-stretch">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Product Cover Image Container (Landscape / Horizontal, Maintains Aspect Ratio) */}
                <div className="relative w-full aspect-[16/10] bg-stone-100 overflow-hidden border-b border-stone-100">
                  <img
                    src={encodeURI(product.image)}
                    alt={`${product.name} packaging and product presentation at Beautique Aesthetics`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient & Status Label */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-amber-900 border border-amber-200/80 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>{product.statusBadge || 'Available by inquiry'}</span>
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center bg-stone-900/85 backdrop-blur-xs text-stone-100 text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-md">
                      Santa Rosa Clinic
                    </span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Category & Product Title */}
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-wider font-semibold text-amber-800">
                      {product.category}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Key Product Details Box */}
                  <div className="bg-[#FAF8F5] rounded-xl border border-stone-200/90 p-4 sm:p-5 space-y-2.5 text-xs text-stone-700">
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

                  {/* Displayed Benefits (Careful, non-guaranteed wording) */}
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider font-semibold text-stone-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                      <span>Product Highlights & Application</span>
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                      {product.displayedBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span className="leading-snug">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Card Footer & Inquiry Actions */}
              <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 bg-white space-y-3">
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Primary Button */}
                  <button
                    onClick={() => handleInquireProduct(product)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-3 px-5 rounded-md transition-colors shadow-xs group/btn cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-300" />
                    <span>Inquire About {product.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Secondary Text Link */}
                  <button
                    onClick={() => handleInquireProduct(product)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 py-2.5 px-3 rounded hover:bg-amber-50 transition-colors cursor-pointer text-center"
                  >
                    <span>Check Availability</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 text-center">
                  Treatment suitability and application confirmed directly with clinic staff.
                </p>
              </div>

            </article>
          ))}
        </div>

        {/* Disclaimer Section Below Cards */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="p-5 sm:p-6 bg-stone-50 rounded-xl border border-stone-200/90 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
              <Info className="w-4 h-4 text-amber-800" />
              <span>Important Product & Treatment Notice</span>
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed max-w-3xl mx-auto">
              Product availability, treatment suitability, inclusions, and pricing are subject to clinic confirmation. Individual results may vary. Please consult Beautique Aesthetics directly before booking or purchasing any aesthetic treatment or product.
            </p>
          </div>
        </div>

        {/* Direct Contact Pillars */}
        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100/80 text-amber-900 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Direct Phone Inquiry</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Speak with clinic reception at <a href="tel:09627400487" className="font-medium text-stone-900 hover:underline">0962 740 0487</a> or <a href="tel:09303441943" className="font-medium text-stone-900 hover:underline">0930 344 1943</a>.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Official Facebook Channel</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Inquire on our verified page: <a href={CLINIC_INFO.contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Beautique Aesthetic Clinic Sta.Rosa</a>.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">In-Clinic Assessment</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Visit our Santa Rosa, Nueva Ecija clinic for personalized body contouring and treatment evaluations.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
