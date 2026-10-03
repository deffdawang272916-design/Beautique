import React from 'react';
import { Sparkles, Phone, MapPin, MessageCircle, Instagram, Facebook, Search, Shield } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onBookAppointment: () => void;
  onOpenChat: () => void;
  onOpenStatusLookup?: () => void;
  onOpenStaffPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onBookAppointment,
  onOpenChat,
  onOpenStatusLookup,
  onOpenStaffPortal,
}) => {
  return (
    <footer className="bg-[#141211] text-stone-300 pt-16 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                BEAUTIQUE
              </span>
              <span className="text-xs uppercase tracking-widest font-sans font-medium text-amber-400">
                Aesthetics
              </span>
            </div>
            
            <p className="text-xs text-amber-300/90 font-serif italic">
              "{CLINIC_INFO.slogan}"
            </p>

            <p className="text-xs text-stone-400 leading-relaxed font-light max-w-sm">
              Beautique Aesthetics — Santa Rosa, Nueva Ecija provides advanced facial therapies, non-invasive contouring, and aesthetic education through Beautique Aesthetic Training Center.
            </p>

            <div className="text-xs text-stone-400 space-y-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Santa Rosa, Nueva Ecija, Philippines</span>
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{CLINIC_INFO.contact.primaryPhoneDisplay}</span>
              </p>
              <p className="text-[11px] text-stone-400 pt-2 border-t border-stone-800">
                <strong className="text-stone-300 block">Associated Clinic:</strong>
                ZAFRA Skin & Aesthetics Center · E. Sarmiento Bldg., M. De Leon St., Brgy. Kapt. Pepe, Cabanatuan City, Nueva Ecija 3100
              </p>
            </div>

            {/* Verified Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CLINIC_INFO.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-blue-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                title="Beautique Aesthetics on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={CLINIC_INFO.contact.relatedInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Page"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-pink-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                title="@zafraskincenter Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors">
                  Aesthetic Treatments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-300 transition-colors">
                  Product Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('machines')} className="hover:text-amber-300 transition-colors">
                  Machines & Equipment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('training')} className="hover:text-amber-300 transition-colors">
                  Training Academy (BATC)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-amber-300 transition-colors">
                  Results & Documentation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors">
                  About Clinic & Owner
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Services Menu */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Verified Services & Promos
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors text-left">
                  HIFU VMAX (BER Months Promo)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors text-left">
                  Hiko Nose Lift + Free Alartox
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors text-left">
                  Diode Laser Unlimited 6 Mos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors text-left">
                  CO2 Package & Melasma Removal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors text-left">
                  Fillers & Under Eye Threads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-amber-300 transition-colors text-left">
                  Sclero Therapy & Gluta Drip
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Schedule Notice & Booking */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Appointments & Hours
            </h4>
            <div className="text-xs text-stone-400 space-y-1">
              <p className="text-stone-300 leading-relaxed font-light">
                {CLINIC_INFO.operatingHoursNotice}
              </p>
              <p className="text-[11px] text-amber-300/80 pt-1">
                Booking: 0962 740 0487 / 0930 344 1943
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onBookAppointment}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs py-2 px-3 rounded transition-colors text-center cursor-pointer"
              >
                Request Appointment
              </button>
              {onOpenStatusLookup && (
                <button
                  onClick={onOpenStatusLookup}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs py-2 px-3 rounded border border-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check Appointment Status</span>
                </button>
              )}
              <button
                onClick={onOpenChat}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs py-2 px-3 rounded border border-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Ask AI Concierge</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Professional Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-4 flex-wrap">
            <p>
              © {new Date().getFullYear()} Beautique Aesthetics — Santa Rosa, Nueva Ecija. All rights reserved.
            </p>
            {onOpenStaffPortal && (
              <button
                onClick={onOpenStaffPortal}
                className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-amber-500/80" />
                <span>Staff Portal</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-stone-500 text-center sm:text-right">
            Primary: Santa Rosa, Nueva Ecija · Associated: ZAFRA Skin & Aesthetics Center, Cabanatuan City
          </p>
        </div>

      </div>
    </footer>
  );
};
