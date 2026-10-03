import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Activity, 
  Droplets, 
  Syringe, 
  Armchair, 
  Layers, 
  Search, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  Info,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { MACHINE_INVENTORY, MACHINE_CATEGORIES } from '../data/machineData';
import { MachineItem, MachineCategory } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface MachinesSectionProps {
  onSelectMachine: (machine: MachineItem) => void;
  onOpenInquiry: (machine: MachineItem) => void;
}

export const MachinesSection: React.FC<MachinesSectionProps> = ({
  onSelectMachine,
  onOpenInquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MachineCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMachines = useMemo(() => {
    return MACHINE_INVENTORY.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = 
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'laser':
        return <Zap className="w-6 h-6 text-amber-800" />;
      case 'hifu-rf':
        return <Activity className="w-6 h-6 text-amber-800" />;
      case 'facial':
        return <Droplets className="w-6 h-6 text-amber-800" />;
      case 'injection':
        return <Syringe className="w-6 h-6 text-amber-800" />;
      case 'equipment':
        return <Armchair className="w-6 h-6 text-amber-800" />;
      case 'supplies':
        return <Layers className="w-6 h-6 text-amber-800" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-800" />;
    }
  };

  return (
    <section id="machines-section" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            AESTHETIC MACHINES & EQUIPMENT
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Professional Aesthetic Systems & Clinic Supply
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Explore professional aesthetic machines, facial systems, clinic equipment and supplies available for inquiry. Contact Beautique Aesthetics directly for current availability, unit specifications, demonstrations, and pricing.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Segmented Control with Horizontal Scroll on Mobile */}
            <div className="flex items-center justify-start gap-1.5 p-1 bg-stone-200/70 rounded-lg overflow-x-auto w-full lg:w-auto scrollbar-none px-2 sm:px-1">
              {MACHINE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as MachineCategory)}
                  className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors min-h-[36px] flex items-center shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-white text-stone-900 shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machines, lasers, HIFU, beds..."
                className="w-full pl-9 pr-9 py-2.5 sm:py-2 bg-white border border-stone-300 rounded-md text-base sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear machine search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 p-1"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Results Count Metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>
              Showing <strong>{filteredMachines.length}</strong> of {MACHINE_INVENTORY.length} aesthetic equipment items
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-amber-800 hover:text-amber-950 font-medium underline"
              >
                Reset to all equipment
              </button>
            )}
          </div>
        </div>

        {/* Machine Cards Grid */}
        {filteredMachines.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-700 mx-auto" />
            <h3 className="font-serif text-xl font-semibold text-stone-900">
              No matching equipment found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              We couldn't find any machines matching your filter. Try adjusting your search query or selecting "All Equipment".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 text-xs font-medium bg-[#1C1917] text-white rounded-md hover:bg-stone-800"
            >
              View All Equipment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredMachines.map((machine) => (
              <article
                key={machine.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Header / Tasteful Silhouette Placeholder */}
                  <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30 overflow-hidden border-b border-stone-100 flex items-center justify-center p-4">
                    {machine.image ? (
                      <img
                        src={encodeURI(machine.image)}
                        alt={machine.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center space-y-1.5 p-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center group-hover:border-amber-300 transition-colors">
                          {getCategoryIcon(machine.category)}
                        </div>
                        <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-600">
                          {machine.categoryLabel}
                        </span>
                      </div>
                    )}

                    {/* Unboxed status badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-stone-900/90 text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow-2xs">
                        {machine.statusBadge}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 block">
                        {machine.categoryLabel}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 mt-0.5 group-hover:text-amber-900 transition-colors line-clamp-1">
                        {machine.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-light mt-1 line-clamp-2 leading-relaxed">
                        {machine.shortDescription}
                      </p>
                    </div>

                    {/* Key Feature Bullets (Factual 1-2 points) */}
                    {machine.keyFeatures && machine.keyFeatures.length > 0 && (
                      <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600 space-y-1">
                        <p className="line-clamp-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                          <span>{machine.keyFeatures[0]}</span>
                        </p>
                        {machine.keyFeatures[1] && (
                          <p className="line-clamp-1 flex items-center gap-1.5 text-stone-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                            <span>{machine.keyFeatures[1]}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions & Pricing */}
                <div className="p-4 sm:p-5 pt-0">
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase block">Pricing</span>
                      <span className="font-serif text-xs sm:text-sm font-semibold text-stone-900">
                        {machine.pricingDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectMachine(machine)}
                        className="text-xs text-stone-600 hover:text-stone-950 font-medium py-1.5 px-2.5 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        title={`View details for ${machine.name}`}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onOpenInquiry(machine)}
                        className="inline-flex items-center gap-1.5 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs font-medium py-2 px-3 rounded-md transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>Inquire</span>
                        <ArrowRight className="w-3 h-3 text-amber-300" />
                      </button>
                    </div>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

        {/* Factual Supply Guidance & Consultation Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Aesthetic Machine & Supply Inquiries</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Need Equipment Guidance or Custom Clinic Quotes?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Whether establishing a new treatment room, upgrading your aesthetic console, or sourcing replacement handpieces and supplies, contact Beautique Aesthetics to verify current availability, technical demonstrations, and pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={CLINIC_INFO.contact.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0084FF] hover:bg-blue-600 text-white font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on Facebook Messenger</span>
            </a>

            <a
              href="tel:09627400487"
              className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md transition-colors border border-stone-200"
            >
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>Call 0962 740 0487</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
