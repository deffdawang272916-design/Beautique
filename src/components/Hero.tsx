import React from 'react';
import { 
  Calendar, 
  ShoppingBag, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  MapPin, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeroProps {
  onBookAppointment: () => void;
  onExploreShop: () => void;
  onExploreAcademy: () => void;
  onExploreTreatments: () => void;
  onExploreMachines?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookAppointment,
  onExploreShop,
  onExploreAcademy,
  onExploreTreatments,
  onExploreMachines,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 sm:pt-10 pb-16 lg:pb-24 border-b border-stone-200">
      {/* Subtle Warm Aesthetic Glow */}
      <div 
        className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 rounded-full bg-stone-200/50 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Trust Kicker (Zero-pill unboxed text) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium tracking-wide">
              <span className="text-amber-800 uppercase tracking-widest font-semibold">
                Beautique Aesthetics
              </span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="flex items-center gap-1 text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                Santa Rosa, Nueva Ecija, Philippines
              </span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="text-amber-900 font-semibold bg-amber-100/80 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                BER Months Promo Available
              </span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.15] text-balance">
                Where Beauty <span className="italic font-serif text-amber-900">Meets Affordability</span> in Santa Rosa.
              </h1>
              <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl">
                Beautique Aesthetics — Santa Rosa, Nueva Ecija offers advanced facial therapies, non-invasive slimming and contouring, laser treatments, and professional aesthetic courses through Beautique Aesthetic Training Center. Featuring seasonal BER Months Promo campaigns associated with ZAFRA Skin & Aesthetics Center (Cabanatuan City) — confirm availability for Santa Rosa.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onBookAppointment}
                className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-sm sm:text-base py-3 px-6 rounded-md shadow-sm transition-all hover:translate-y-[-1px]"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Request Appointment</span>
              </button>

              <button
                onClick={onExploreShop}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-sm sm:text-base py-3 px-5 rounded-md transition-all hover:border-stone-400"
              >
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <span>Product Inquiries</span>
              </button>

              <button
                onClick={onExploreAcademy}
                className="inline-flex items-center justify-center gap-2 text-stone-700 hover:text-stone-950 font-medium text-sm py-3 px-3 transition-colors group"
              >
                <GraduationCap className="w-4 h-4 text-stone-500 group-hover:text-amber-800" />
                <span>Training Academy</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick Unboxed Highlights */}
            <div className="pt-4 border-t border-stone-200/80">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-600">
                <div>
                  <p className="font-semibold text-stone-900">Direct Inquiries</p>
                  <p className="text-stone-500">0962 740 0487 / 0930 344 1943</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Training Center</p>
                  <p className="text-stone-500">Beautique Aesthetic Training Center</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Machine Supply</p>
                  {onExploreMachines ? (
                    <button
                      onClick={onExploreMachines}
                      className="text-amber-800 hover:text-amber-950 font-medium hover:underline text-left"
                    >
                      Aesthetic Systems & Gear
                    </button>
                  ) : (
                    <p className="text-stone-500">Aesthetic Systems & Gear</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Clinic Location</p>
                  <p className="text-stone-500">Santa Rosa, Nueva Ecija, Philippines</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High Aesthetic Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="overflow-hidden rounded-xl bg-stone-200 shadow-xl border border-stone-300/60 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
                  alt="Clinical facial aesthetic treatment at Beautique Aesthetics"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating Ambient Info Box: Operating Hours Notice - Mobile-safe offset */}
              <div className="absolute -bottom-6 left-2 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-lg shadow-lg border border-stone-200 max-w-[calc(100%-1rem)] sm:max-w-xs">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-md bg-amber-50 text-amber-800 shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                      Appointment Notice
                    </h4>
                    <p className="text-xs font-medium text-stone-700 mt-0.5 leading-snug">
                      Please contact clinic to confirm current operating hours and availability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Ambient Badge: Verified Slogan - Mobile-safe offset */}
              <div className="absolute -top-4 right-2 sm:-right-6 bg-stone-900 text-stone-100 p-3 sm:p-3.5 rounded-lg shadow-lg border border-stone-800 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Beautique Aesthetics</span>
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5 italic">
                  "Where Beauty Meets Affordability"
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Verified Feature Pillars Bar */}
        <div className="mt-14 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div>
              <p className="font-serif text-lg sm:text-xl font-semibold text-stone-900">Facial Treatments</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">Advanced Multi-Function & Peels</p>
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl font-semibold text-stone-900">Slimming & Contouring</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">HIFU, Exilis, Mesofat & Meso</p>
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl font-semibold text-stone-900">Face Enhancement</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">Hiko Nose Lift, Threads & Fillers</p>
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl font-semibold text-stone-900">Aesthetic Academy</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">BATC Master Course in Aesthetics</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
