import React, { useState, useMemo } from 'react';
import { Search, Calendar, Sparkles, Check, ArrowRight, Tag, Phone } from 'lucide-react';
import { TREATMENTS, CLINIC_INFO } from '../data/clinicData';
import { Treatment } from '../types';

interface TreatmentsSectionProps {
  onBookAppointment: (treatmentId?: string) => void;
  onSelectTreatment: (treatment: Treatment) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({
  onBookAppointment,
  onSelectTreatment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('promos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'promos', label: 'BER Months Promo' },
    { id: 'all', label: 'All Services' },
    { id: 'slimming', label: 'Slimming & Contouring' },
    { id: 'enhancement', label: 'Face Enhancement' },
    { id: 'laser', label: 'Laser & Light' },
    { id: 'wellness', label: 'Specialty & Wellness' },
    { id: 'facials', label: 'Facial Treatments' },
    { id: 'prior', label: 'Prior Services' },
  ];

  const filteredTreatments = useMemo(() => {
    return TREATMENTS.filter((t) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'promos' ? t.isPromotion === true : t.category === selectedCategory);

      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.tagline && t.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.targetAreas && t.targetAreas.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (t.packageDetails && t.packageDetails.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="treatments-section" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Beautique Aesthetics — Santa Rosa, Nueva Ecija
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Aesthetic Treatments & Services
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto">
            Explore aesthetic care and treatments offered by Beautique Aesthetics in Santa Rosa, Nueva Ecija, alongside seasonal promotional packages associated with ZAFRA Skin & Aesthetics Center (Cabanatuan City).
          </p>
        </div>

        {/* BER Months Promo Official Banner Card */}
        <div className="mb-10 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex flex-wrap items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded max-w-full">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span className="leading-tight">Associated Campaign · ZAFRA Skin & Aesthetics Center (Cabanatuan City)</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
                ZAFRA Skin & Aesthetics Center <span className="text-stone-300 font-light text-xl">by Beautech Aesthetic</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Featuring advertised promotional packages for HIFU VMAX, Sclero Therapy, Hiko Noselift, Fillers, Diode Laser, Mesofat Dissolving, Hair Regrowth, CO2 Package, Melasma Removal, Gluta Drip, and Slimming Shots.
              </p>
              <p className="text-[11px] text-amber-200/90 pt-1 font-medium">
                * Note: Sourced from ZAFRA Skin & Aesthetics Center in Cabanatuan City. Please confirm with Beautique Aesthetics (Santa Rosa) regarding availability and terms at the Santa Rosa clinic.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setSelectedCategory('promos');
                  setSearchQuery('');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md transition-colors text-center shadow-xs"
              >
                View 14 BER Promo Packages
              </button>
              <a
                href="tel:09627400487"
                className="inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs py-2 px-4 rounded-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Call 0962 740 0487</span>
              </a>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Segmented Control */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg overflow-x-auto w-full md:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-white text-stone-900 shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                  {cat.id === 'promos' && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-800 text-white text-[9px] rounded-full uppercase tracking-tighter">
                      Hot
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments or promos..."
                className="w-full pl-9 pr-4 py-2.5 sm:py-2 bg-white border border-stone-300 rounded-md text-base sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Treatment Cards Grid */}
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8">
            <Sparkles className="w-8 h-8 text-amber-700 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-medium text-stone-900">No treatments matched your search</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">Try clearing your search query or selecting "All Services".</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group justify-between"
              >
                <div>
                  {/* Card Media Preview */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                    <img
                      src={encodeURI(treatment.image)}
                      alt={treatment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />
                    
                    {/* Category Kicker */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-medium text-stone-900 border border-stone-200">
                      {treatment.categoryLabel}
                    </div>

                    {/* BER Months Promo Badge */}
                    {treatment.promotionName && (
                      <div className="absolute top-3 right-3 bg-amber-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                        {treatment.promotionName}
                      </div>
                    )}

                    {/* Target Areas or Package */}
                    {treatment.packageDetails ? (
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium truncate">
                        <span>Package: {treatment.packageDetails}</span>
                      </div>
                    ) : treatment.targetAreas ? (
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
                        <span>Areas: {treatment.targetAreas.join(', ')}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                        {treatment.name}
                      </h3>
                      {treatment.tagline && (
                        <p className="text-xs text-amber-900/90 font-medium mt-0.5 line-clamp-1">
                          {treatment.tagline}
                        </p>
                      )}
                      <p className="text-xs text-stone-500 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {treatment.description}
                      </p>
                    </div>

                    {/* Advertised Claims or Benefits */}
                    {treatment.advertisedClaims && treatment.advertisedClaims.length > 0 ? (
                      <div className="space-y-1 border-t border-stone-100 pt-3">
                        <p className="text-[10px] uppercase tracking-wider text-amber-900 font-semibold">
                          Advertised Promo Highlights
                        </p>
                        {treatment.advertisedClaims.slice(0, 2).map((claim, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                            <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{claim}</span>
                          </div>
                        ))}
                      </div>
                    ) : treatment.benefits && treatment.benefits.length > 0 ? (
                      <div className="space-y-1 border-t border-stone-100 pt-3">
                        {treatment.benefits.slice(0, 2).map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Pricing and Actions */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase">
                        {treatment.promotionName ? 'Promo Rate' : 'Rate / Status'}
                      </span>
                      <span className="font-serif text-sm sm:text-base font-semibold text-stone-900">
                        {treatment.priceFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectTreatment(treatment)}
                        className="text-xs text-stone-600 hover:text-stone-950 font-medium py-1.5 px-2 rounded hover:bg-stone-100 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookAppointment(treatment.id)}
                        className="inline-flex items-center gap-1.5 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs font-medium py-2 px-3 rounded-md transition-colors shadow-xs"
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
        )}

        {/* Factual Availability Guidance */}
        <div className="mt-12 p-5 bg-stone-100/90 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-stone-600">
          <div>
            <p className="font-semibold text-stone-900 text-sm">
              BER Months Promo Terms & Clinical Assessment
            </p>
            <p className="mt-0.5 text-stone-600">
              Promotional availability and terms are subject to confirmation with the clinic. Medical candidacy and evaluation must be conducted in person. Contact: 0962 740 0487 / 0930 344 1943.
            </p>
          </div>
          <button
            onClick={() => onBookAppointment()}
            className="shrink-0 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs font-medium py-2 px-4 rounded-md transition-colors"
          >
            Request Appointment
          </button>
        </div>

      </div>
    </section>
  );
};
