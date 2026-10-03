import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Calendar, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  MessageCircle,
  GraduationCap
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  openBooking: (treatmentId?: string) => void;
  openChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openBooking,
  openChat,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'treatments', label: 'Treatments' },
    { id: 'products', label: 'Shop' },
    { id: 'machines', label: 'Machines' },
    { id: 'training', label: 'Academy' },
    { id: 'gallery', label: 'Results' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Location' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcement Bar - Streamlined on mobile to save vertical viewport space */}
      <div className="bg-[#1C1917] text-stone-300 text-xs py-2 px-3 sm:px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-medium text-stone-200 truncate">Beautique Aesthetics</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-300 hidden sm:inline">Santa Rosa, Nueva Ecija, Philippines</span>
            <span className="text-stone-300 sm:hidden">Santa Rosa, NE</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-stone-300 shrink-0">
            {/* Desktop-only secondary links (already in mobile menu & page buttons) */}
            <button 
              onClick={openChat} 
              className="hidden sm:flex items-center gap-1.5 text-stone-300 hover:text-amber-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Concierge</span>
            </button>
            <span className="hidden sm:inline text-stone-700">|</span>
            
            {/* Direct Phone Link (always visible) */}
            <a 
              href="tel:09627400487" 
              className="flex items-center gap-1.5 hover:text-amber-200 transition-colors py-0.5"
              aria-label="Call clinic at 0962 740 0487"
            >
              <Phone className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">{CLINIC_INFO.contact.primaryPhoneDisplay}</span>
              <span className="sm:hidden font-medium text-amber-200">0962 740 0487</span>
            </a>
            
            <span className="hidden md:inline text-stone-700">|</span>
            <a 
              href={CLINIC_INFO.contact.facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 hover:text-blue-300 transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-blue-400" />
              <span>Facebook Page</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3' 
            : 'bg-[#FAF8F5] border-b border-stone-200/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <button 
              onClick={() => handleNavClick('home')} 
              className="text-left group focus:outline-none min-w-0"
            >
              <div className="flex items-baseline gap-1.5 flex-wrap min-[360px]:flex-nowrap">
                <span className="font-serif text-[1.35rem] min-[360px]:text-2xl sm:text-3xl font-semibold tracking-wider text-stone-900 group-hover:text-amber-900 transition-colors">
                  BEAUTIQUE
                </span>
                <span className="text-xs uppercase tracking-widest font-sans font-medium text-amber-700">
                  Aesthetics
                </span>
              </div>
              <p className="text-[9px] min-[360px]:text-[10px] tracking-wider sm:tracking-widest uppercase text-stone-500 font-sans -mt-0.5 truncate max-w-[175px] min-[360px]:max-w-none">
                Where Beauty Meets Affordability · Santa Rosa, NE
              </p>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium transition-all relative whitespace-nowrap ${
                    activeTab === link.id
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {activeTab === link.id && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-700 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              {/* Cart Button */}
              <button
                onClick={openCart}
                aria-label="View shopping bag"
                className="relative p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Primary Book Appointment CTA */}
              <button
                onClick={() => openBooking()}
                className="hidden sm:inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium py-2.5 px-4 rounded-md transition-all shadow-sm hover:shadow"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Request Appointment</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-md text-stone-700 hover:text-stone-950 hover:bg-stone-100 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === link.id
                      ? 'bg-amber-100/70 text-amber-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#1C1917] text-stone-50 text-sm font-medium py-3 px-4 rounded-md"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Book Clinic Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openChat();
                }}
                className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 hover:bg-stone-200 text-sm font-medium py-2.5 px-4 rounded-md"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Ask AI Concierge (Treatments & Hours)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
