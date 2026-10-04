import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Building2, 
  Instagram, 
  Calendar,
  Sparkles,
  Navigation
} from 'lucide-react';
import { CLINIC_INFO, ZAFRA_CLINIC_INFO } from '../data/clinicData';
import { getSafeImageUrl, handleImageFallback } from '../utils/imageUtils';

interface LocationsSectionProps {
  onBookAppointment: () => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  onBookAppointment,
}) => {
  const [copiedSantaRosa, setCopiedSantaRosa] = useState(false);
  const [copiedKapitanPepe, setCopiedKapitanPepe] = useState(false);

  const handleCopySantaRosa = () => {
    navigator.clipboard.writeText('Beautique Aesthetic Clinic, Del Pilar, Santa Rosa, Nueva Ecija, Philippines');
    setCopiedSantaRosa(true);
    setTimeout(() => setCopiedSantaRosa(false), 2500);
  };

  const handleCopyKapitanPepe = () => {
    navigator.clipboard.writeText(ZAFRA_CLINIC_INFO.address.fullDisplay);
    setCopiedKapitanPepe(true);
    setTimeout(() => setCopiedKapitanPepe(false), 2500);
  };

  const santaRosaMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Bareface+Beautique+Wellness+and+Beauty+Clinic+Del+Pilar+Santa+Rosa+Nueva+Ecija';
  const kapitanPepeMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Zafra+Skin+Aesthetics+Center+E+Sarmiento+Bldg+M+De+Leon+St+Kapitan+Pepe+Cabanatuan+City+Nueva+Ecija';

  return (
    <section id="locations-section" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-900 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span>Our Clinic Locations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Two Verified Clinic Locations
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Visit our clinics in Nueva Ecija for certified skin treatments, facial rejuvenation, contouring procedures, and professional training.
          </p>
        </div>

        {/* Two Equal Location Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* ================= BRANCH 1: SANTA ROSA ================= */}
          <article className="bg-[#FAF8F5] rounded-2xl border-2 border-stone-300/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Branch Image */}
              <div className="relative aspect-[16/10] w-full bg-stone-200 overflow-hidden border-b border-stone-200">
                <img
                  src="/locations/santa-rosa-branch.svg"
                  alt="Beautique Aesthetic Clinic Santa Rosa storefront"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={handleImageFallback}
                />
                
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1C1917] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
                    Santa Rosa Branch
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Primary Clinic
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-5">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                    Beautique Aesthetic Clinic – Santa Rosa
                  </h3>
                  <p className="text-xs text-amber-900 font-medium mt-1">
                    "Where Beauty Meets Affordability" · In collaboration with Bareface Beautique
                  </p>
                </div>

                {/* Location Address Details */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                          Confirmed Location
                        </span>
                        <p className="text-sm font-semibold text-stone-900 leading-snug">
                          Santa Rosa, Nueva Ecija
                        </p>
                        <p className="text-xs text-stone-600 font-light mt-0.5">
                          Central Luzon, Philippines
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopySantaRosa}
                      className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      title="Copy Santa Rosa address"
                    >
                      {copiedSantaRosa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px] font-medium">{copiedSantaRosa ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Key Information & Contact */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                    <Phone className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-medium text-stone-900">
                      {CLINIC_INFO.contact.primaryPhoneDisplay}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-stone-600 bg-white p-3 rounded-lg border border-stone-200">
                    <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span className="leading-snug font-light text-[11px]">
                      {CLINIC_INFO.operatingHoursNotice}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-6 sm:p-7 pt-0 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* View on Google Maps Button */}
                <a
                  href={santaRosaMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-medium text-xs sm:text-sm py-3 px-4 rounded-lg transition-colors shadow-xs group"
                >
                  <Navigation className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                {/* Book Appointment CTA */}
                <button
                  onClick={onBookAppointment}
                  className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-3 px-4 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Book at Santa Rosa</span>
                </button>
              </div>

              <a
                href={CLINIC_INFO.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs text-blue-700 hover:text-blue-900 font-medium bg-blue-50/60 hover:bg-blue-50 border border-blue-100 rounded-md transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message Facebook: {CLINIC_INFO.contact.facebookPageName}</span>
              </a>
            </div>
          </article>


          {/* ================= BRANCH 2: KAPITAN PEPE ================= */}
          <article className="bg-[#FAF8F5] rounded-2xl border border-stone-300/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Branch Image */}
              <div className="relative aspect-[16/10] w-full bg-stone-200 overflow-hidden border-b border-stone-200">
                <img
                  src="/locations/kapitan-pepe-branch.svg"
                  alt="Zafra Skin & Aesthetics Center Kapitan Pepe building"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={handleImageFallback}
                />
                
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1C1917] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
                    Kapitan Pepe Branch
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-amber-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    Cabanatuan City
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-5">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                    Zafra Skin & Aesthetics Center – Kapitan Pepe
                  </h3>
                  <p className="text-xs text-stone-600 font-medium mt-1">
                    By Beautech Aesthetic · Aesthetic & Wellness Facility
                  </p>
                </div>

                {/* Location Address Details */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <Building2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                          Building & Street Address
                        </span>
                        <p className="text-sm font-semibold text-stone-900 leading-snug">
                          {ZAFRA_CLINIC_INFO.address.building}, {ZAFRA_CLINIC_INFO.address.street}
                        </p>
                        <p className="text-xs text-stone-600 font-light mt-0.5">
                          {ZAFRA_CLINIC_INFO.address.barangay}, {ZAFRA_CLINIC_INFO.address.city}, {ZAFRA_CLINIC_INFO.address.province}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyKapitanPepe}
                      className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      title="Copy Kapitan Pepe address"
                    >
                      {copiedKapitanPepe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px] font-medium">{copiedKapitanPepe ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Instagram Presence & Notice */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                      <span className="font-semibold text-stone-900">
                        {ZAFRA_CLINIC_INFO.instagramHandle}
                      </span>
                    </div>
                    <a
                      href={ZAFRA_CLINIC_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-pink-700 hover:text-pink-900 flex items-center gap-1"
                    >
                      <span>Follow</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-start gap-2.5 text-stone-600 bg-white p-3 rounded-lg border border-stone-200">
                    <Sparkles className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span className="leading-snug font-light text-[11px]">
                      Supplied BER Months promotional services & specialty skincare treatments.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-6 sm:p-7 pt-0 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* View on Google Maps Button */}
                <a
                  href={kapitanPepeMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-medium text-xs sm:text-sm py-3 px-4 rounded-lg transition-colors shadow-xs group"
                >
                  <Navigation className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                {/* Inquire CTA */}
                <a
                  href={CLINIC_INFO.contact.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-3 px-4 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-amber-300" />
                  <span>Inquire via Messenger</span>
                </a>
              </div>

              <a
                href={ZAFRA_CLINIC_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs text-pink-700 hover:text-pink-900 font-medium bg-pink-50/60 hover:bg-pink-50 border border-pink-100 rounded-md transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Visit Instagram @zafraskincenter</span>
              </a>
            </div>
          </article>

        </div>

      </div>
    </section>
  );
};
