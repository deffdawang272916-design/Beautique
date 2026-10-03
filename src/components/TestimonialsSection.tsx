import React from 'react';
import { Heart, MessageSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const TestimonialsSection: React.FC = () => {
  const verifiedFeedback = [
    {
      id: 'f-1',
      title: 'Dedicated Clinic Staff & Care',
      summary: 'Public customer comments and reviews frequently express gratitude to Beautique Aesthetic Clinic Sta.Rosa NE Branch, Amelyn Domingo Zafra, and the clinic staff for their attentive, welcoming, and gentle service.',
      source: 'Public Facebook Page Comments',
    },
    {
      id: 'f-2',
      title: 'Positive Client Experience',
      summary: 'Clients publicly highlighting their pleasant clinic visits and aesthetic sessions, commending the clinic environment and personalized care received at the Sta. Rosa branch.',
      source: 'Verified Customer Feedback',
    },
    {
      id: 'f-3',
      title: 'Aesthetic Training Guidance',
      summary: 'Students and trainees acknowledging the dedicated hands-on guidance and practical instruction provided during aesthetic training programs under Beautique Aesthetic Training Center.',
      source: 'Training Community Feedback',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Community Feedback · Sta. Rosa, Nueva Ecija
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Client Appreciation & Experience
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto">
            Public feedback and community commendations for Beautique Aesthetic Clinic Sta.Rosa NE Branch, Amelyn Domingo Zafra, and clinic staff.
          </p>
        </div>

        {/* Feedback Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {verifiedFeedback.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    {item.source}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/80 text-[11px] text-stone-500">
                Beautique Aesthetic Clinic Sta.Rosa NE Branch
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Context */}
        <div className="mt-12 text-center text-xs text-stone-500 space-y-2">
          <p>
            Visit our official Facebook page to view public posts, recent client interactions, and announcements.
          </p>
          <a
            href={CLINIC_INFO.contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium"
          >
            <span>Visit Beautique Aesthetic Clinic Sta.Rosa NE Branch on Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
