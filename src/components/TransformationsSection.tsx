import React from 'react';
import { Camera, ExternalLink, MessageCircle, Info } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const TransformationsSection: React.FC = () => {
  return (
    <section id="gallery-section" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Clinical Documentation · Santa Rosa, Nueva Ecija
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Treatment Gallery & Results
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto">
            Authentic treatment documentation and client progression albums are published directly on our official social media channels and presented during in-clinic consultations.
          </p>
        </div>

        {/* Featured Documentation Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Facebook Portal Card */}
          <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                Official Facebook Photo Albums
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Browse publicly published photos, seasonal announcements, and patient highlights on our verified Santa Rosa Facebook page: <strong>Beautique Aesthetic Clinic Sta.Rosa NE Branch</strong>.
              </p>
            </div>

            <a
              href={CLINIC_INFO.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors pt-2"
            >
              <span>View Facebook Photo Albums</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Consultation Documentation Card */}
          <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                In-Clinic Case Portfolios
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                During your scheduled visit to Beautique Aesthetics in Santa Rosa, our team reviews specific treatment case histories relevant to your unique skin type and aesthetic goals.
              </p>
            </div>

            <div className="text-xs text-stone-500 pt-2 font-medium">
              In-Clinic Consultation · Santa Rosa, Nueva Ecija, Philippines
            </div>
          </div>
        </div>

        {/* Ethical Medical Disclaimer */}
        <div className="mt-12 p-4 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3 text-xs text-stone-600 max-w-4xl mx-auto">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical Notice:</strong> Aesthetic procedure outcomes vary based on individual physiology, age, lifestyle, and adherence to aftercare. The clinic does not guarantee uniform results. A qualified consultation is conducted before any treatment is performed.
          </p>
        </div>

      </div>
    </section>
  );
};
