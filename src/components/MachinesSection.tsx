import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Eye,
  CheckCircle2
} from 'lucide-react';
import { MACHINE_INVENTORY, MACHINE_CATEGORIES } from '../data/machineData';
import { MachineItem, MachineCategory } from '../types';
import { CLINIC_INFO } from '../data/clinicData';
import { getSafeImageUrl, handleImageFallback } from '../utils/imageUtils';

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
      const matchesCategory = selectedCategory === 'all' || item.category.includes(selectedCategory);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        item.functions.some((f) => f.toLowerCase().includes(query)) ||
        item.benefits.some((b) => b.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="machines-section" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            AESTHETIC MACHINES & EQUIPMENT
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Professional Aesthetic Machines Catalog
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Explore Beautech Aesthetic's current selection of professional aesthetic machines and treatment workstations. Contact us directly for product availability, pricing, and demonstration details.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Segmented Control */}
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
                placeholder="Search machines, lasers, HIFU..."
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
              Showing <strong>{filteredMachines.length}</strong> of {MACHINE_INVENTORY.length} machines
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-amber-800 hover:text-amber-950 font-medium underline cursor-pointer"
              >
                Reset to all machines
              </button>
            )}
          </div>
        </div>

        {/* Machine Cards Grid */}
        {filteredMachines.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-700 mx-auto" />
            <h3 className="font-serif text-xl font-semibold text-stone-900">
              No matching machines found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              We couldn't find any machines matching your filter. Try adjusting your search query or selecting "All Machines".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 text-xs font-medium bg-[#1C1917] text-white rounded-md hover:bg-stone-800 cursor-pointer"
            >
              View All Machines
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredMachines.map((machine) => (
              <article
                key={machine.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Clean Machine Image Presentation */}
                  <div className="relative aspect-[4/3] w-full bg-[#FBF9F6] overflow-hidden border-b border-stone-100 flex items-center justify-center p-3">
                    <img
                      src={getSafeImageUrl(machine.image)}
                      alt={machine.name}
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                      onError={handleImageFallback}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-stone-900/90 text-white text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded shadow-2xs">
                        {machine.statusBadge}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 block">
                        {machine.categoryLabel}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 mt-1 group-hover:text-amber-900 transition-colors">
                        {machine.name}
                      </h3>
                      <p className="text-xs text-stone-600 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {machine.shortDescription}
                      </p>
                    </div>

                    {/* 3-4 Key Functions */}
                    <div className="pt-3 border-t border-stone-100 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-700 block">
                        Key Functions:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {machine.functions.slice(0, 3).map((func, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0 mt-1.5" />
                            <span className="line-clamp-1 leading-snug">{func}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectMachine(machine)}
                      className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-medium text-xs py-2.5 px-3 rounded-md transition-colors cursor-pointer text-center"
                      title={`View details for ${machine.name}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>View Machine</span>
                    </button>

                    <button
                      onClick={() => onOpenInquiry(machine)}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#1C1917] hover:bg-stone-800 text-white font-medium text-xs py-2.5 px-3 rounded-md transition-colors cursor-pointer text-center shadow-xs"
                      title={`Inquire about ${machine.name}`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-amber-300" />
                      <span>Inquire Now</span>
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
