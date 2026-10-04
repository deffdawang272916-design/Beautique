import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Minimize2,
  Maximize2
} from 'lucide-react';
import { CLINIC_INFO, TREATMENTS, TRAINING_COURSES } from '../data/clinicData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface AiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Welcome to Beautique Aesthetics. How can I help you today? I am your digital concierge for Beautique Aesthetics — Santa Rosa, Nueva Ecija ("Where Beauty Meets Affordability"). I can answer questions regarding our aesthetic services, clinic location in Santa Rosa, contact numbers, Beautique Aesthetic Training Center accreditations, and associated promotional packages from ZAFRA Skin & Aesthetics Center (Cabanatuan City).`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What are the BER Months Promos?',
    'What aesthetic machines do you supply?',
    'How much is HIFU VMAX?',
    'Where is your clinic located?',
    'How do I request an appointment?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Client-side intelligent fallback response generator strictly grounded on verified facts
  const getLocalClinicResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Medical safety boundary
    if (
      q.includes('pregnancy') ||
      q.includes('pregnant') ||
      q.includes('breastfeeding') ||
      q.includes('safe for me') ||
      q.includes('side effect') ||
      q.includes('candidate') ||
      q.includes('downtime') ||
      q.includes('contraindication') ||
      q.includes('allergy') ||
      q.includes('allergic')
    ) {
      return `Medical candidacy, safety, and specific aftercare must be evaluated directly by qualified clinic personnel during an in-person assessment. Please contact our Santa Rosa clinic at 0962 740 0487 or 0930 344 1943 to speak with clinic staff.`;
    }

    // HIFU VMAX
    if (q.includes('hifu vmax') || (q.includes('hifu') && (q.includes('vmax') || q.includes('unlimited') || q.includes('6 month')))) {
      return `Under the BER Months Promo, HIFU VMAX is advertised as Unlimited for 6 months at ₱15,000. It is advertised to help lift and firm the appearance of the face and jawline for sculpted contours. This is an advertised promotional price; please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm current availability.`;
    }

    // HIFU + JawTox combo
    if (q.includes('jawtox') || (q.includes('hifu') && q.includes('jaw'))) {
      return `The BER Months Promo features the HIFU + JawTox Combo Treatment at ₱4,999. It combines focused ultrasound lifting with JawTox for enhanced facial contouring. This is an advertised promotional price; please contact the clinic at 0962 740 0487 / 0930 344 1943 to confirm availability.`;
    }

    // Sclero Therapy
    if (q.includes('sclero') || q.includes('vein') || q.includes('spider')) {
      return `Under the BER Months Promo, Sclero Therapy is advertised at ₱999 per ml. It is advertised to help reduce the appearance of spider and small varicose veins for smoother legs. The exact ml needed is evaluated during in-person consultation. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm availability.`;
    }

    // Hiko Noselift
    if (q.includes('hiko') || q.includes('nose lift') || q.includes('noselift') || q.includes('alartox')) {
      return `The BER Months promotional price for Hiko Noselift (PCL Threads with Free Alartox) is ₱7,999. It is advertised as a minimally invasive enhancement to create a more lifted, defined-looking nose profile. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm current availability.`;
    }

    // Fillers (Chin, Lip, Under Eye Threads)
    if (q.includes('filler') || q.includes('chin') || q.includes('lip') || q.includes('under eye') || q.includes('undereye')) {
      return `Under the BER Months Fillers Promo Treatment, the advertised options are: Chin Fillers at ₱6,999; Lip Fillers at ₱6,999; and Under Eye Threads at ₱6,999. These are advertised promotional prices. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm current availability.`;
    }

    // Diode Laser
    if (q.includes('diode') || q.includes('hair removal') || q.includes('brazilian') || q.includes('underarm')) {
      return `Yes! The BER Months Promo advertises Diode Laser with an Unlimited for 6 months package at ₱10,000 for selectable areas (Underarm, Lip Area, Face, or Brazilian Area). It is advertised to help reduce unwanted hair and slow regrowth. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm current promo terms.`;
    }

    // Mesofat / Aqualyx / Lemon Bottle
    if (q.includes('mesofat') || q.includes('aqualyx') || q.includes('lemon bottle') || q.includes('fat dissolv')) {
      return `The BER Months Promo features Mesofat Dissolving Treatment with 10 sessions on any parts of face or body for ₱10,000. Clients can choose either Aqualyx or Lemon Bottle as advertised. This is an advertised promotional price; please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm availability.`;
    }

    // Hair Regrowth
    if (q.includes('hair regrowth') || q.includes('hair loss') || q.includes('scalp') || q.includes('buhok')) {
      return `Yes! The clinic advertises a Hair Regrowth — Intradermal and Microneedling Treatment package of 4 sessions for ₱10,000 under the BER Months Promo. It is designed to nourish the scalp and support healthier, fuller-looking hair. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm availability.`;
    }

    // CO2 Package
    if (q.includes('co2') || q.includes('carbon')) {
      return `Under the BER Months Promo, the CO2 Package (Face & Neck with Facial) is advertised as 4 sessions for ₱15,000. It is advertised to help improve skin texture and brightness on the face and neck. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm current promo availability.`;
    }

    // Melasma Removal
    if (q.includes('melasma') || q.includes('dark spot') || q.includes('pigmentation') || q.includes('peklat')) {
      return `The clinic advertises a treatment named "Melasma Removal" under the BER Months Promo: a 10-session package for ₱10,000 designed to help fade dark spots and support an even skin tone. This is an advertised promotional rate (individual results vary and are not medically guaranteed). Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm availability.`;
    }

    // Gluta Drip with Vitamin C
    if (q.includes('gluta') || q.includes('drip') || q.includes('vitamin c') || q.includes('iv')) {
      return `Yes! The supplied BER Months promotional material advertises "Gluta Drip with Vitamin C Treatment" with a 10-session package for ₱8,000. It is advertised to support a brighter, refreshed glow. This is an advertised promotional price; please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm availability.`;
    }

    // Slimming Shots
    if (q.includes('slimming shot') || q.includes('slimming') || q.includes('weight') || q.includes('turok')) {
      return `Under the BER Months Promo, Slimming Shots are advertised as a 10-session package for ₱10,000. It is designed to support body-contouring goals alongside an active lifestyle. Please contact the clinic at 0962 740 0487 or 0930 344 1943 to confirm current availability.`;
    }

    // Location & Landmarks
    if (q.includes('where') || q.includes('location') || q.includes('address') || q.includes('saan') || q.includes('landmark') || q.includes('map') || q.includes('cabanatuan') || q.includes('santa rosa')) {
      return `• Beautique Aesthetics (Primary Clinic): Located in Santa Rosa, Nueva Ecija, Philippines. Inquiries/Booking: 0962 740 0487 / 0930 344 1943.
• ZAFRA Skin & Aesthetics Center (Associated Clinic): Located at E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe, Cabanatuan City, Nueva Ecija 3100, Philippines (Instagram: @zafraskincenter).
Please note these are two distinct physical clinic locations.`;
    }

    // Operating hours
    if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('oras') || q.includes('monday') || q.includes('sunday') || q.includes('schedule')) {
      return `Please contact Beautique Aesthetics directly at 0962 740 0487 or 0930 344 1943, or message our Facebook page (Beautique Aesthetic Clinic Sta.Rosa NE Branch) to confirm current operating hours and appointment availability for our Santa Rosa clinic.`;
    }

    // Appointments & booking
    if (q.includes('book') || q.includes('appointment') || q.includes('sched') || q.includes('consultation') || q.includes('walk-in') || q.includes('reserve')) {
      return `You can submit an appointment request using our website's booking form, call/text 0962 740 0487 / 0930 344 1943, or message our Facebook page (Beautique Aesthetic Clinic Sta.Rosa NE Branch). Please note that all appointment requests are subject to clinic confirmation.`;
    }

    // TESDA Accreditation Inquiry
    if (q.includes('tesda')) {
      return `TESDA-related training information is associated with the collaboration with Bareface Beautique Wellness and Beauty Clinic (Del Pilar, Santa Rosa, Nueva Ecija). Beautique Aesthetic Training Center holds verified international accreditation as a 7 Star Accredited Academy from the International Education Board (IEB), Certificate No. PHIL121808.`;
    }

    // Founder Inquiry
    if (q.includes('founder') || q.includes('owner')) {
      return `Beautique Aesthetics is owned and founded by Amelyn Zafra. On the official IEB international accreditation certificate, the founder is named as Amelyn Medina.`;
    }

    // Collaboration Inquiry
    if (q.includes('collaborat') || q.includes('bareface') || q.includes('partner')) {
      return `Beautique Aesthetic Training Center operates in collaboration with Bareface Beautique Wellness and Beauty Clinic in Del Pilar, Santa Rosa, Nueva Ecija.`;
    }

    // Training Academy & Accreditation (BATC)
    if (q.includes('train') || q.includes('course') || q.includes('academy') || q.includes('aral') || q.includes('certificate') || q.includes('batc') || q.includes('accredit') || q.includes('ieb')) {
      return `Beautique Aesthetic Training Center (BATC) is accredited by the International Education Board (IEB), Department of Aesthetics and Cosmetology, as a 7 Star Accredited Academy (Certificate No. PHIL121808, valid July 2022 – July 2027), and operates in collaboration with Bareface Beautique Wellness and Beauty Clinic. The academy offers hands-on mastercourses in aesthetic procedures and dedicated Training on Costing and Pricing. Please contact us at 0962 740 0487 for upcoming batch schedules.`;
    }

    // Skincare Products & Delivery
    if (q.includes('product') || q.includes('sunscreen') || q.includes('serum') || q.includes('rejuvenat') || q.includes('bili') || q.includes('shop') || q.includes('deliver') || q.includes('shipping') || q.includes('cream')) {
      return `Product catalog updates are currently in progress. Please contact Beautique Aesthetics directly at 0962 740 0487 or 0930 344 1943 to inquire about current in-clinic skincare lines, availability, and pickup/delivery arrangements.`;
    }

    // Aesthetic Machines & Equipment Supply
    if (q.includes('machine') || q.includes('equipment') || q.includes('hydrafacial') || q.includes('bio light') || q.includes('5d rf') || q.includes('omega light') || q.includes('cryolipolysis') || q.includes('7d hifu') || q.includes('co2 fractional') || q.includes('pico diode') || q.includes('power sculpt') || q.includes('thermagen') || q.includes('mpt hifu') || q.includes('exilift') || q.includes('classic hifu') || q.includes('pico laser') || q.includes('rf microneedling')) {
      return `Beautech Aesthetic offers 18 verified professional aesthetic machines:
1. 6 in 1 Hydrafacial with PDT
2. Bio Light
3. 5D RF
4. 6 in 1 Hydrafacial
5. PDT Omega Light
6. Cryolipolysis 360
7. HIFU Portable
8. RF Microneedling
9. 2 in 1 Pico Laser
10. 7D HIFU
11. CO2 Fractional Laser
12. Pico Diode
13. Power Sculpt
14. Thermagen
15. MPT HIFU
16. Exilift
17. Classic HIFU
18. 4 in 1 Pico Laser

All machines are available for clinic order and inquiry. Please contact Beautech Aesthetic at 0962 740 0487 or 0930 344 1943 or message us directly on Facebook to confirm current pricing, availability, and demonstration details!`;
    }

    // Brand name / historical naming inquiry
    if (q.includes('brand') || q.includes('name') || q.includes('beautech') || q.includes('zafra')) {
      return `Our primary clinic is Beautique Aesthetics located in Santa Rosa, Nueva Ecija. ZAFRA Skin & Aesthetics Center by Beautech Aesthetic is a separate associated clinic located in Cabanatuan City (E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe). How can I assist you with your aesthetic inquiry today?`;
    }

    // Treatments / General Promo summary
    if (q.includes('treatment') || q.includes('facial') || q.includes('laser') || q.includes('fillers') || q.includes('botox') || q.includes('hiko') || q.includes('exilis') || q.includes('meso') || q.includes('thread') || q.includes('promo') || q.includes('ber month')) {
      return `The supplied BER Months promotional packages originate from ZAFRA Skin & Aesthetics Center (Cabanatuan City):
• HIFU VMAX (Unlimited for 6 months — ₱15,000)
• Sclero Therapy (₱999 / ml)
• Hiko Noselift PCL Threads + Free Alartox (₱7,999)
• Chin Fillers, Lip Fillers, Under Eye Threads (₱6,999 each)
• Diode Laser (Unlimited for 6 months — ₱10,000 on underarm, lip area, face, or Brazilian)
• Mesofat Dissolving Treatment: Aqualyx or Lemon Bottle (10 sessions — ₱10,000)
• Hair Regrowth Intradermal & Microneedling (4 sessions — ₱10,000)
• CO2 Package Face & Neck with Facial (4 sessions — ₱15,000)
• Melasma Removal (10 sessions — ₱10,000)
• HIFU + JawTox Combo Treatment (₱4,999)
• Gluta Drip with Vitamin C Treatment (10 sessions — ₱8,000)
• Slimming Shots (10 sessions — ₱10,000)
• Advanced Multi-Function Facial (1 session — ₱1,700 | 3 sessions — ₱4,080)
Please note: These packages originate from ZAFRA Cabanatuan City. Please contact Beautique Aesthetics (Santa Rosa) at 0962 740 0487 or 0930 344 1943 to confirm availability at our Santa Rosa clinic.`;
    }

    // Payments
    if (q.includes('pay') || q.includes('gcash') || q.includes('card') || q.includes('bdo') || q.includes('cod')) {
      return `Please contact Beautique Aesthetics directly at 0962 740 0487 or 0930 344 1943 to confirm current payment options accepted for services in Santa Rosa.`;
    }

    // Contact info
    if (q.includes('contact') || q.includes('number') || q.includes('phone') || q.includes('messenger') || q.includes('facebook')) {
      return `You can reach Beautique Aesthetics — Santa Rosa, Nueva Ecija at:\n• Booking/Inquiries: 0962 740 0487 / 0930 344 1943\n• Facebook Page: ${CLINIC_INFO.contact.facebookUrl}\n• Location: Santa Rosa, Nueva Ecija, Philippines.`;
    }

    // General fallback strictly avoiding fabrication
    return `For current information regarding Beautique Aesthetics in Santa Rosa, Nueva Ecija, appointment slots, training academy enrollment, or promotional terms, please contact our clinic team directly at 0962 740 0487 or 0930 344 1943, or via our official Facebook page. How else may I assist you with verified clinic facts?`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: messageText }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      const botReply = data.reply || getLocalClinicResponse(messageText);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      const localReply = getLocalClinicResponse(messageText);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: localReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] right-2.5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end animate-in fade-in duration-200">
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col transition-all duration-300 ${
          isMinimized 
            ? 'w-[calc(100vw-1.25rem)] max-w-72 h-14' 
            : 'w-[calc(100vw-1.25rem)] sm:w-96 h-[540px] max-h-[82dvh]'
        }`}
      >
        {/* Header Bar */}
        <div className="p-3.5 bg-[#1C1917] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-sm font-semibold text-white">
                  Beautique Concierge
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-stone-300">
                Sta. Rosa, Nueva Ecija Clinic AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-stone-300">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 sm:p-1 hover:text-white rounded hover:bg-stone-800 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
              aria-label={isMinimized ? 'Expand chatbot' : 'Minimize chatbot'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Minimize2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-1 hover:text-white rounded hover:bg-stone-800 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Body & Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/60 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#1C1917] text-white rounded-tr-none'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-none font-light'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-stone-400' : 'text-stone-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs pl-8">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                  <span>Checking verified clinic data...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-stone-100/90 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-full whitespace-nowrap text-stone-700 hover:text-stone-900 transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Action Links Bar */}
            <div className="px-3 py-1.5 bg-white border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="flex items-center gap-1 text-amber-900 hover:underline font-medium"
              >
                <Calendar className="w-3 h-3" />
                <span>Request Visit</span>
              </button>
              <span>·</span>
              <a
                href={CLINIC_INFO.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Facebook Page</span>
              </a>
              <span>·</span>
              <a
                href="tel:09627400487"
                className="flex items-center gap-1 text-stone-700 hover:underline"
              >
                <Phone className="w-3 h-3" />
                <span>0962 740 0487</span>
              </a>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about verified treatments, BATC, location..."
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 sm:p-2 bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-200 text-stone-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
