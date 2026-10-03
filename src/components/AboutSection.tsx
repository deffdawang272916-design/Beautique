import React from 'react';
import { Sparkles, MapPin, GraduationCap, Building2, Phone } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import aboutClinicImage from '../assets/images/regenerated_image_1791031267120.webp';

interface AboutSectionProps {
  onBookAppointment: () => void;
  onExploreAcademy: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onBookAppointment,
  onExploreAcademy,
}) => {
  return (
    <section id="about-section" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-xl border border-stone-300 aspect-[4/5] bg-stone-200">
              <img
                src={aboutClinicImage}
                alt="Beautique Aesthetics Santa Rosa suite"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <p className="font-semibold text-sm">Beautique Aesthetics — Santa Rosa, Nueva Ecija</p>
                <p className="text-stone-300">Santa Rosa, Nueva Ecija, Philippines</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-stone-700">
                <span className="font-semibold text-stone-900 block">Clinic Location</span>
                <span className="text-stone-500">Santa Rosa, Nueva Ecija</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-stone-700">
                <span className="font-semibold text-stone-900 block">Training Academy</span>
                <span className="text-stone-500">Beautique Aesthetic Training Center</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                About The Clinic & Academy
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
                Where Beauty Meets Affordability.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                Operating as <strong>Beautique Aesthetics</strong> (also historically recognized under Beautique Aesthetic Clinic Sta.Rosa NE Branch and Beautech Aesthetic Clinic), our Santa Rosa clinic is dedicated to bringing modern aesthetic care, skin rejuvenation, and contouring services to clients in Santa Rosa, Nueva Ecija.
              </p>
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                Led by owner Amelyn Zafra (Amelyn Domingo Zafra), the organization also operates <strong>Beautique Aesthetic Training Center (BATC)</strong>, offering professional aesthetic programs such as the 5-day Master Course in Aesthetics and specialized Training on Costing and Pricing.
              </p>
            </div>

            {/* Verified Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-amber-100 text-amber-900 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Primary Clinic Location
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Beautique Aesthetics is situated in Santa Rosa, Nueva Ecija, Philippines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-amber-100 text-amber-900 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Aesthetic Academy
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    7 Star Accredited Academy (IEB) · In collaboration with Bareface Beautique Wellness and Beauty Clinic. Offering hands-on mastercourses in aesthetic procedures and clinic pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-amber-100 text-amber-900 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Aesthetic Treatments
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Facial care, HIFU, Exilis, laser treatments, threadlifts, and contouring procedures tailored for local clients.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-amber-100 text-amber-900 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Associated Location
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Associated with <strong>ZAFRA Skin & Aesthetics Center</strong> located at E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe, Cabanatuan City, Nueva Ecija 3100.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookAppointment}
                className="bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md shadow-xs transition-colors"
              >
                Request an Appointment
              </button>
              <button
                onClick={onExploreAcademy}
                className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md transition-colors"
              >
                View Training Course
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
