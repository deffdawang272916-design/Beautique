import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Calendar, 
  ShoppingBag, 
  Copy, 
  Check, 
  ExternalLink,
  Instagram,
  Building2,
  AlertCircle
} from 'lucide-react';
import { CLINIC_INFO, ZAFRA_CLINIC_INFO } from '../data/clinicData';

interface ContactSectionProps {
  onBookAppointment: () => void;
  onExploreShop: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onBookAppointment,
  onExploreShop,
}) => {
  const [copiedBeautique, setCopiedBeautique] = useState(false);
  const [copiedZafra, setCopiedZafra] = useState(false);

  const handleCopyBeautique = () => {
    navigator.clipboard.writeText('Beautique Aesthetics, Santa Rosa, Nueva Ecija, Philippines');
    setCopiedBeautique(true);
    setTimeout(() => setCopiedBeautique(false), 2500);
  };

  const handleCopyZafra = () => {
    navigator.clipboard.writeText(ZAFRA_CLINIC_INFO.address.fullDisplay);
    setCopiedZafra(true);
    setTimeout(() => setCopiedZafra(false), 2500);
  };

  return (
    <section id="contact-section" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Clinic Locations & Contact Directory
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Find & Connect With Us
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto">
            Primary clinic inquiries for <strong>Beautique Aesthetics (Santa Rosa, Nueva Ecija)</strong>, alongside location details for <strong>ZAFRA Skin & Aesthetics Center (Cabanatuan City)</strong>.
          </p>
        </div>

        {/* Two-Column Grid: Distinct Clinic Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Primary Clinic — Beautique Aesthetics Santa Rosa */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Beautique Aesthetics Primary Card */}
            <div className="p-6 bg-[#FAF8F5] rounded-xl border-2 border-stone-300 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs uppercase tracking-widest font-semibold text-amber-900">
                    Primary Business & Location
                  </span>
                </div>
                <span className="bg-stone-900 text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                  Santa Rosa
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Beautique Aesthetics
                </h3>
                <p className="text-xs text-amber-900 font-medium mt-0.5">
                  "Where Beauty Meets Affordability"
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                        Location:
                      </span>
                      <span className="text-sm font-semibold text-stone-900 block">
                        Santa Rosa, Nueva Ecija, Philippines
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyBeautique}
                    className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center gap-1 shrink-0"
                    title="Copy Santa Rosa location"
                  >
                    {copiedBeautique ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedBeautique ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Operating Schedule Notice */}
              <div className="p-3.5 bg-white rounded-lg border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
                <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Appointment Notice:</span>
                  <span className="text-stone-600 font-light">
                    {CLINIC_INFO.operatingHoursNotice}
                  </span>
                </div>
              </div>

              {/* Booking Contacts Grid */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Santa Rosa Inquiries & Appointments
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <a
                    href="tel:09627400487"
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-400 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-2 rounded bg-amber-50 text-amber-800 group-hover:bg-amber-100">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-stone-400 block uppercase">Primary Booking</span>
                      <span className="font-semibold text-stone-800 truncate block">0962 740 0487</span>
                    </div>
                  </a>

                  <a
                    href="tel:09303441943"
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-400 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-2 rounded bg-amber-50 text-amber-800 group-hover:bg-amber-100">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-stone-400 block uppercase">Alternate Inquiry</span>
                      <span className="font-semibold text-stone-800 truncate block">0930 344 1943</span>
                    </div>
                  </a>

                  <a
                    href={CLINIC_INFO.contact.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 sm:col-span-2 p-3 bg-white rounded-lg border border-stone-200 hover:border-blue-400 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-2 rounded bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-stone-400 block uppercase">Official Facebook Page</span>
                      <span className="font-semibold text-stone-800 truncate block">{CLINIC_INFO.contact.facebookPageName}</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onBookAppointment}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-3 px-5 rounded-md shadow-xs transition-colors"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Request Santa Rosa Appointment</span>
                </button>

                <button
                  onClick={onExploreShop}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-medium text-xs sm:text-sm py-3 px-4 rounded-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-800" />
                  <span>Products</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Distinct Entity — ZAFRA Skin & Aesthetics Center Cabanatuan */}
          <div className="lg:col-span-6 space-y-5">
            
            <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-stone-600" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-stone-700">
                    Associated Clinic Entity
                  </span>
                </div>
                <span className="bg-stone-200 text-stone-800 text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                  Cabanatuan City
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {ZAFRA_CLINIC_INFO.name}
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  {ZAFRA_CLINIC_INFO.fullName}
                </p>
              </div>

              {/* Exact Provided Cabanatuan Address Card */}
              <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                        Cabanatuan City Address:
                      </span>
                      <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-snug">
                        {ZAFRA_CLINIC_INFO.address.building}, {ZAFRA_CLINIC_INFO.address.street}
                      </p>
                      <p className="text-xs text-stone-700">
                        {ZAFRA_CLINIC_INFO.address.barangay}, {ZAFRA_CLINIC_INFO.address.city}
                      </p>
                      <p className="text-xs text-stone-700">
                        {ZAFRA_CLINIC_INFO.address.province} {ZAFRA_CLINIC_INFO.address.zipCode}, {ZAFRA_CLINIC_INFO.address.country}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyZafra}
                    className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center gap-1 shrink-0"
                    title="Copy Cabanatuan address"
                  >
                    {copiedZafra ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedZafra ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* ZAFRA Online Presence */}
              <div className="p-3.5 bg-white rounded-lg border border-stone-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <div>
                    <span className="font-semibold text-stone-900 block">Associated Instagram:</span>
                    <span className="text-stone-500">{ZAFRA_CLINIC_INFO.instagramHandle}</span>
                  </div>
                </div>

                <a
                  href={ZAFRA_CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-700 hover:text-pink-900"
                >
                  <span>View Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Strict Critical Separation Notice */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-lg flex items-start gap-2.5 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">
                    Physical Location & Promotional Separation Notice:
                  </p>
                  <p className="leading-relaxed font-light text-[11px] text-amber-900">
                    <strong>Beautique Aesthetics (Santa Rosa, Nueva Ecija)</strong> and <strong>ZAFRA Skin & Aesthetics Center (Cabanatuan City)</strong> are distinct physical locations. Promotional campaigns originating from ZAFRA Cabanatuan City should be confirmed directly with Beautique Aesthetics before assuming availability at the Santa Rosa clinic.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
