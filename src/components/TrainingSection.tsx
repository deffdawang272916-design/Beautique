import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Clock, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  X, 
  MapPin, 
  Calendar, 
  FileText,
  UserCheck,
  Tag,
  Flame,
  MessageCircle
} from 'lucide-react';
import { TRAINING_COURSES, CLINIC_INFO, TRAINING_ACCREDITATION } from '../data/clinicData';
import { TrainingCourse } from '../types';

interface TrainingSectionProps {
  onSelectCourse: (course: TrainingCourse) => void;
  onEnroll: (course: TrainingCourse) => void;
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({
  onSelectCourse,
  onEnroll,
}) => {
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [cardPosters, setCardPosters] = useState<Record<string, string>>({});

  // Dynamic sorting: Pinned entries always appear first, ordered by priority (1 = newest)
  const sortedCourses = [...TRAINING_COURSES].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (a.priority || 99) - (b.priority || 99);
  });

  const pinnedCourses = sortedCourses.filter((c) => c.pinned);
  const standardCourses = sortedCourses.filter((c) => !c.pinned);

  // Handle ESC key press to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCertModalOpen) setIsCertModalOpen(false);
        if (activeLightboxImage) setActiveLightboxImage(null);
      }
    };
    if (isCertModalOpen || activeLightboxImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCertModalOpen, activeLightboxImage]);

  return (
    <section id="training-section" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-amber-800">
            <GraduationCap className="w-4 h-4" />
            <span>{CLINIC_INFO.trainingOrganization}</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight text-balance">
            Aesthetic Courses & Professional Training
          </h2>
          
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Professional aesthetic education publicly promoted under Beautique Aesthetic Training Center, featuring comprehensive technique modules and practical training on costing and pricing.
          </p>

          {/* Client-Provided Collaboration Notice */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-amber-50/80 text-amber-950 border border-amber-200/80 px-4 py-2 rounded-lg text-xs font-medium max-w-2xl text-balance">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                In collaboration with <strong>Bareface Beautique Wellness and Beauty Clinic</strong>, Del Pilar, Santa Rosa, Nueva Ecija.
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            1. PINNED / LATEST TRAINING ANNOUNCEMENTS (FEATURED FIRST AT TOP)
        ========================================================================= */}
        {pinnedCourses.length > 0 && (
          <div className="mb-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-md bg-amber-500 text-stone-950">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                    Latest Training Announcements
                  </h3>
                  <p className="text-xs text-stone-600 font-light">
                    Pinned upcoming aesthetic workshops & VIP modules at Santa Rosa, Nueva Ecija
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto bg-[#1C1917] text-amber-300 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded shadow-2xs">
                Pinned Announcements
              </span>
            </div>

            {/* Pinned Courses Side-by-Side Grid (Stacked on Mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {pinnedCourses.map((course) => {
                const activePoster = cardPosters[course.id] || course.image;
                const isVip = course.id.includes('vip');

                return (
                  <article
                    key={course.id}
                    className="bg-white rounded-2xl border-2 border-stone-300/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Poster Image Container with Zoomable Lightbox */}
                      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-stone-950 overflow-hidden border-b border-stone-200">
                        <img
                          src={activePoster}
                          alt={course.title}
                          className="w-full h-full object-contain object-center group-hover:scale-[1.01] transition-transform duration-300"
                          loading="lazy"
                        />
                        
                        {/* Dark gradient base */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="bg-[#1C1917]/95 backdrop-blur-xs text-amber-300 border border-amber-400/30 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{course.badge || 'LATEST TRAINING'}</span>
                          </span>
                        </div>

                        {/* Lightbox / Click to Enlarge Button */}
                        <button
                          onClick={() => setActiveLightboxImage({ url: activePoster, title: course.title, subtitle: course.subtitle })}
                          className="absolute top-3 right-3 bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md backdrop-blur-xs flex items-center gap-1.5 shadow-md border border-stone-700 transition-colors cursor-pointer"
                          aria-label={`Enlarge poster for ${course.title}`}
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-300" />
                          <span className="text-[11px]">Enlarge Poster</span>
                        </button>

                        {/* Poster switcher if course has secondaryImage */}
                        {course.secondaryImage && (
                          <div className="absolute bottom-11 left-3 z-10 flex items-center gap-1 bg-stone-900/90 backdrop-blur-xs p-1 rounded-md border border-stone-700/80">
                            <button
                              type="button"
                              onClick={() => setCardPosters(prev => ({ ...prev, [course.id]: course.image }))}
                              className={`text-[9px] min-[360px]:text-[10px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                                activePoster === course.image ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                              }`}
                            >
                              Latest Poster
                            </button>
                            <button
                              type="button"
                              onClick={() => setCardPosters(prev => ({ ...prev, [course.id]: course.secondaryImage! }))}
                              className={`text-[9px] min-[360px]:text-[10px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                                activePoster === course.secondaryImage ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                              }`}
                            >
                              Previous Artwork
                            </button>
                          </div>
                        )}

                        {/* Bottom Image Overlay Strip */}
                        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-xs truncate drop-shadow-xs">
                            {course.organization}
                          </span>
                          {course.date && (
                            <span className="bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 uppercase tracking-wider">
                              {course.date}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 sm:p-7 space-y-5">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-2xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-xs text-amber-900 font-medium mt-1">
                            {course.subtitle}
                          </p>
                          <p className="text-xs text-stone-600 font-light mt-2.5 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {/* Event Key Highlights Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-3 border-y border-stone-200/80 bg-[#FAF8F5] p-3 rounded-xl text-xs">
                          {course.date && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                                Date
                              </span>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                                {course.date}
                              </span>
                            </div>
                          )}

                          {course.location && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                                Location
                              </span>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                                {course.location}
                              </span>
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                              Tuition
                            </span>
                            <span className="font-bold text-amber-950 text-xs sm:text-sm">
                              {course.priceFormatted}
                            </span>
                          </div>

                          {course.slotsInfo && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                                Capacity
                              </span>
                              <span className="font-semibold text-stone-900 text-xs">
                                {course.slotsInfo}
                              </span>
                            </div>
                          )}

                          {course.registrationDeadline && (
                            <div className="sm:col-span-2">
                              <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
                                Registration Deadline
                              </span>
                              <span className="font-semibold text-amber-950 text-xs">
                                Register Until {course.registrationDeadline}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Specific Poster Topic Highlights */}
                        {course.topics && course.topics.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                              Training Topics & Coverage:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                              {course.topics.map((topic, i) => (
                                <div key={i} className="flex items-start gap-2 bg-stone-50 p-2 rounded border border-stone-200/60">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="leading-snug">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pricing Note */}
                        {course.pricingNote && (
                          <p className="text-[11px] text-stone-500 font-light italic bg-amber-50/50 p-2.5 rounded border border-amber-100">
                            {course.pricingNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Action CTAs */}
                    <div className="p-6 sm:p-7 pt-0 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-200">
                        <button
                          onClick={() => onSelectCourse(course)}
                          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-medium text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          <span>View Training Details</span>
                        </button>

                        <button
                          onClick={() => onEnroll(course)}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-amber-300" />
                          <span>{isVip ? 'Inquire About Training' : 'Register / Inquire'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Academy Highlights Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-white rounded-lg border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded bg-amber-50 text-amber-800 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                5-Day Full Aesthetic Training
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Intensive program format publicly promoted for aspiring clinic practitioners and beauty entrepreneurs.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded bg-amber-50 text-amber-800 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Costing & Pricing Training
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Dedicated business modules covering service pricing strategy, operational costing, and client management.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded bg-amber-50 text-amber-800 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                7 Star Accredited Academy
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Accredited by the International Education Board (IEB), Dept. of Aesthetics & Cosmetology (Valid to July 2027).
              </p>
            </div>
          </div>
        </div>

        {/* ACCREDITATION & CREDENTIALS SUBSECTION */}
        <div id="accreditation-credentials" className="mb-14 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Subsection Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-amber-800 mb-1">
                <Award className="w-4 h-4" />
                <span>Accreditation & Credentials</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                Accredited Academy & Credentials
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 bg-amber-100/80 text-amber-900 border border-amber-300/80 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-800" />
                <span>7 Star Accredited Academy (IEB)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-800 border border-stone-200 text-xs font-medium tracking-wide px-3 py-1.5 rounded">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Training Collaboration</span>
              </span>
            </div>
          </div>

          {/* Desktop Two-Column Layout / Mobile Stacked Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-6">
            
            {/* Left Column: Accreditation Information & Training Collaboration */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* AREA A: INTERNATIONAL ACCREDITATION */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200">
                    INTERNATIONAL ACCREDITATION
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    International Education Board (IEB)
                  </span>
                </div>
                
                <p className="font-serif text-lg sm:text-xl font-medium text-stone-900 leading-snug">
                  "Beautique Aesthetic Training Center is accredited by the International Education Board (IEB), Department of Aesthetics and Cosmetology, as a 7 Star Accredited Academy."
                </p>
              </div>

              {/* Verified Key Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold block">
                    International Status
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    7 Star Accredited Academy
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/90 space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Accrediting Organization
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    International Education Board (IEB)
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/90 space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    IEB Certificate Number
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 font-mono">
                    PHIL121808
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/90 space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Accreditation Term
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    July 2022 – July 2027
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/90 space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Founder (on Certificate)
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    Amelyn Medina
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/90 space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Location on Certificate
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    Nueva Ecija, Philippines
                  </span>
                </div>
              </div>

              {/* AREA B: TRAINING COLLABORATION */}
              <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-stone-200/80 text-stone-900 font-semibold text-xs border border-stone-300">
                    TRAINING COLLABORATION
                  </span>
                  <span className="text-xs text-amber-900 font-medium">
                    Santa Rosa, Nueva Ecija
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                  "In collaboration with Bareface Beautique Wellness and Beauty Clinic, Del Pilar, Santa Rosa, Nueva Ecija."
                </p>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  TESDA-related training information is associated with the collaboration with Bareface Beautique Wellness and Beauty Clinic.
                </p>

                <div className="pt-1 text-[11px] text-stone-500 flex items-start gap-2 border-t border-stone-200/60 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    International institutional accreditation (7 Star Accredited Academy) is conferred by the International Education Board (IEB, Certificate No. PHIL121808). TESDA-related training details remain separate and are linked to the partner clinic collaboration.
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Certificate Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-sm rounded-xl overflow-hidden border-2 border-stone-300 bg-stone-100 shadow-md hover:shadow-lg transition-all">
                {/* Certificate Preview Image */}
                <div className="relative aspect-[1/1.414] w-full overflow-hidden bg-white">
                  <img
                    src={TRAINING_ACCREDITATION.certificateImage}
                    alt="Beautique Aesthetic Training Center 7 Star Accredited Academy certificate from the International Education Board, Certificate No. PHIL121808."
                    className="w-full h-full object-contain p-1 group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div 
                    onClick={() => setIsCertModalOpen(true)}
                    className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    aria-hidden="true"
                  >
                    <span className="bg-stone-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>Click to Enlarge</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 sm:p-3.5 bg-stone-900 text-stone-100 flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold truncate text-white">
                      IEB Certificate No. PHIL121808
                    </p>
                    <p className="text-[10px] text-stone-300">
                      7 Star Accredited Academy · Amelyn Medina
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCertModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold py-2 px-3.5 rounded transition-colors shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer min-h-[40px]"
                    aria-label="View original accreditation certificate in full size"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 text-center mt-2.5">
                Official accreditation certificate conferred by International Education Board (IEB)
              </p>
            </div>

          </div>
        </div>

        {/* Standard / Core Training Courses Section */}
        {standardCourses.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
                Core Aesthetic Programs & Masterclasses
              </h3>
              <span className="text-xs text-stone-500">
                Accredited Curriculum
              </span>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {standardCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group justify-between"
                >
                  <div>
                    {/* Visual Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-stone-900">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                      {/* Organization Tag */}
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-medium px-2.5 py-1 rounded border border-stone-200">
                        {course.organization}
                      </span>

                      {/* Badge */}
                      {course.badge && (
                        <span className="absolute top-3 right-3 bg-amber-800 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                          {course.badge}
                        </span>
                      )}

                      {/* Duration Tag */}
                      {course.duration && (
                        <div className="absolute bottom-3 left-3 text-white text-xs flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-300" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-serif text-2xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-xs text-amber-800 font-medium mt-0.5">
                          {course.subtitle}
                        </p>
                        <p className="text-xs text-stone-600 font-light mt-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Curriculum topics */}
                      {course.topics && (
                        <div className="space-y-1.5 border-t border-stone-100 pt-3">
                          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                            Core Training Topics
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {course.topics.map((topic, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Price & CTAs */}
                  <div className="p-6 pt-0">
                    <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-stone-500 block">Tuition & Schedule</span>
                        <span className="font-serif text-base font-semibold text-stone-900">
                          {course.priceFormatted}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          Contact training center to confirm current batch dates and venue
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectCourse(course)}
                          className="text-xs text-stone-600 hover:text-stone-950 font-medium py-2 px-3 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onEnroll(course)}
                          className="inline-flex items-center gap-1.5 bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs font-medium py-2 px-4 rounded-md transition-colors shadow-xs cursor-pointer"
                        >
                          <span>Inquire Course</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* LIGHTBOX FOR TRAINING POSTERS */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxImage.title}
          onClick={() => setActiveLightboxImage(null)}
        >
          <div 
            className="relative bg-stone-900 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-700 flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-4 sm:p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <h3 className="font-serif text-base sm:text-lg font-semibold truncate text-white">
                    {activeLightboxImage.title}
                  </h3>
                </div>
                {activeLightboxImage.subtitle && (
                  <p className="text-xs text-stone-400 truncate mt-0.5">
                    {activeLightboxImage.subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={() => setActiveLightboxImage(null)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Close poster lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Poster Body */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-stone-950 flex items-center justify-center">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="p-3.5 sm:p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 text-xs text-stone-400 shrink-0">
              <span className="text-[11px] truncate">
                Beautique Aesthetic Training Center · Santa Rosa, Nueva Ecija
              </span>
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs py-2 px-4 rounded-md transition-colors cursor-pointer shrink-0"
              >
                Close Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL / LIGHTBOX */}
      {isCertModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 id="cert-modal-title" className="font-serif text-lg sm:text-xl font-semibold">
                    Accreditation Certificate
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-amber-400/30 hidden sm:inline-block">
                    Official Document
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  International Education Board (IEB) · Certificate No. PHIL121808
                </p>
              </div>

              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-2 sm:p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer"
                aria-label="Close certificate lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Original Certificate Image */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-stone-100 flex items-center justify-center">
              <img
                src={TRAINING_ACCREDITATION.certificateImage}
                alt="Beautique Aesthetic Training Center 7 Star Accredited Academy certificate from the International Education Board, Certificate No. PHIL121808."
                className="max-w-full max-h-[68vh] sm:max-h-[72vh] object-contain rounded shadow-md border border-stone-300"
              />
            </div>

            {/* Modal Footer with Certificate Metadata */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 shrink-0">
              <div className="space-y-0.5">
                <p className="font-semibold text-stone-900">
                  Beautique Aesthetic Training Center · 7 Star Accredited Academy
                </p>
                <p className="text-[11px] text-stone-500">
                  Founder: Amelyn Medina · Issued: July 2022 · Valid Until: July 2027 · Nueva Ecija, Philippines
                </p>
              </div>

              <button
                onClick={() => setIsCertModalOpen(false)}
                className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-xs py-2.5 sm:py-2 px-4 rounded-md transition-colors text-center cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
