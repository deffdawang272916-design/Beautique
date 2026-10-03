import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { FAQS, CLINIC_INFO } from '../data/clinicData';

interface FaqSectionProps {
  onOpenChat: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenChat }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'Clinic & Hours' },
    { id: 'treatments', label: 'Procedures' },
    { id: 'products', label: 'Shop & Shipping' },
    { id: 'training', label: 'Academy' },
    { id: 'payments', label: 'Payments' },
  ];

  const filteredFaqs = FAQS.filter(
    (f) => selectedCategory === 'all' || f.category === selectedCategory
  );

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs-section" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Frequently Asked Questions
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 tracking-tight text-balance">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-stone-600 font-light max-w-xl mx-auto">
            Find quick answers regarding our Santa Rosa clinic location, appointments, safety protocols, and academy enrollment.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 p-1 bg-stone-200/70 rounded-lg max-w-full sm:max-w-fit mx-auto mb-8 overflow-x-auto scrollbar-none px-2 sm:px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-stone-200/90 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-snug">
                    {faq.question}
                  </span>
                  <div className="p-1 rounded-full text-stone-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Concierge & Direct Contact Prompt Box */}
        <div className="mt-12 p-6 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Have a question not listed here?</span>
            </h4>
            <p className="text-xs text-stone-300 max-w-md">
              Ask our 24/7 Beautique Aesthetics AI Concierge or message our Santa Rosa clinic team directly on Facebook Messenger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold py-2.5 px-4 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Concierge</span>
            </button>

            <a
              href={CLINIC_INFO.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium py-2.5 px-4 rounded-md border border-stone-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Facebook Page</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
