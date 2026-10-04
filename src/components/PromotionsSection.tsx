import React, { useState, useMemo } from 'react';
import { Calendar, Tag, Check, ArrowRight, Phone, Sparkles, AlertCircle } from 'lucide-react';
import { PROMOTIONS, CLINIC_INFO, TREATMENTS } from '../data/clinicData';
import { Promotion, Treatment } from '../types';
import { getSafeImageUrl, handleImageFallback } from '../utils/imageUtils';

interface PromotionsSectionProps {
  onBookAppointment: (treatmentId?: string) => void;
  onSelectTreatment?: (treatment: Treatment) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  onBookAppointment,
  onSelectTreatment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Promos' },
    { id: 'slimming', label: 'Slimming & Contouring' },
    { id: 'laser', label: 'Laser & Light' },
    { id: 'enhancement', label: 'Face Enhancement' },
    { id: 'wellness', label: 'Wellness & Glow' },
    { id: 'facials', label: 'Facial Care' },
  ];

  const filteredPromos = useMemo(() => {
    if (selectedCategory === 'all') return PROMOTIONS;
    return PROMOTIONS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleCardClick = (treatmentId: string) => {
    if (onSelectTreatment) {
      const treatment = TREATMENTS.find((t) => t.id === treatmentId);
      if (treatment) {
        onSelectTreatment(treatment);
        return;
      }
    }
    onBookAppointment(treatmentId);
  };

  return (
    <section id="promotions-section" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>Associated Campaign · ZAFRA Skin & Aesthetics Center (Cabanatuan City)</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            BER Months Promotional Campaigns
          </h2>
          
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            These promotional packages originate from <strong>ZAFRA Skin & Aesthetics Center</strong> in Cabanatuan City (E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe). Please confirm with <strong>Beautique Aesthetics (Santa Rosa)</strong> regarding availability and terms for the Santa Rosa clinic.
          </p>
        </div>

        {/* Category Segmented Filter - justify-start on mobile prevents left-side scroll cropping on iOS Safari */}
        <div className="flex items-center justify-start sm:justify-center mb-8 sm:mb-10 overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg max-w-full border border-stone-200 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors min-h-[36px] flex items-center cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1C1917] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Promotions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPromos.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#FAF8F5] rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Preview */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-200">
                  <img
                    src={getSafeImageUrl(promo.image)}
                    alt={promo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={handleImageFallback}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded text-[11px] font-semibold text-stone-900 border border-stone-200">
                      {promo.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-amber-800 text-white text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded shadow-xs">
                      {promo.priceLabel}
                    </span>
                  </div>

                  {/* Package Specification Ribbon */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium truncate flex items-center justify-between">
                    <span className="bg-stone-900/80 px-2 py-0.5 rounded backdrop-blur-xs">
                      {promo.packageDetails}
                    </span>
                    {promo.sessionCount && (
                      <span className="text-[11px] text-amber-300 font-semibold">
                        {promo.sessionCount} Sessions
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                      {promo.name}
                    </h3>
                    
                    {promo.wording && (
                      <p className="text-xs text-amber-900 font-medium italic mt-0.5">
                        "{promo.wording}"
                      </p>
                    )}
                  </div>

                  {/* Inclusions or Options */}
                  {promo.inclusions && (
                    <div className="p-2 bg-amber-100/60 border border-amber-200 rounded text-xs text-amber-950 font-semibold">
                      Inclusion: {promo.inclusions}
                    </div>
                  )}

                  {promo.options && (
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-800">Options: </span>
                      <span>{promo.options.join(' or ')} (Choose Any)</span>
                    </div>
                  )}

                  {promo.targetAreas && (
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-800">Areas: </span>
                      <span>{promo.targetAreas.join(', ')}</span>
                    </div>
                  )}

                  {/* Advertised Claims List */}
                  {promo.advertisedClaims && promo.advertisedClaims.length > 0 && (
                    <div className="space-y-1.5 border-t border-stone-200/70 pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                        Advertised Promo Highlights:
                      </p>
                      {promo.advertisedClaims.slice(0, 2).map((claim, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-600 font-light">
                          <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{claim}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-amber-800 uppercase tracking-wider font-semibold block">
                      {promo.priceLabel}
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      {promo.priceFormatted}
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      Confirm availability
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCardClick(promo.treatmentId)}
                      className="text-xs text-stone-700 hover:text-stone-950 font-medium py-2 px-2.5 rounded hover:bg-stone-200/70 transition-colors"
                      title="View procedure details"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onBookAppointment(promo.treatmentId)}
                      className="inline-flex items-center gap-1.5 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs font-medium py-2 px-3.5 rounded-md transition-colors shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>Inquire</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Factual Disclaimer Banner */}
        <div className="mt-12 p-4 sm:p-5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">
                Promotional Terms & Booking Notice
              </p>
              <p className="mt-0.5 text-stone-600 leading-relaxed font-light">
                Prices and package details listed above reflect advertised promotional materials for the BER Months campaign. All rates are promotional prices subject to confirmation with the clinic. Medical candidacy and evaluation must be conducted in person.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:09627400487"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-medium text-xs py-2 px-3 rounded-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>0962 740 0487</span>
            </a>
            <button
              onClick={() => onBookAppointment()}
              className="bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs py-2 px-3.5 rounded-md transition-colors shadow-xs"
            >
              Request Appointment
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
