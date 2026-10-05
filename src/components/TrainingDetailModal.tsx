import React, { useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TrainingCourse } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface TrainingDetailModalProps {
  course: TrainingCourse | null;
  onClose: () => void;
  onEnroll: (course: TrainingCourse) => void;
}

export const TrainingDetailModal: React.FC<TrainingDetailModalProps> = ({
  course,
  onClose,
  onEnroll,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // Body scroll lock with safe cleanup
  useEffect(() => {
    if (course) {
      setSelectedImage(course.image);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [course]);

  if (!course) return null;

  const currentPoster = selectedImage || course.image;
  const isVip = course.id.includes('vip');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-sm border border-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Header */}
        <div className="relative bg-stone-950 overflow-hidden border-b border-stone-200">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full flex items-center justify-center bg-stone-900">
            <img
              src={currentPoster}
              alt={course.title}
              className="w-full h-full object-contain object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

          {/* Poster gallery switcher if multiple posters exist */}
          {course.galleryImages && course.galleryImages.length > 1 && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-xs p-1 rounded-md border border-stone-700">
              <span className="text-[10px] text-stone-400 font-semibold px-1.5 uppercase">Posters:</span>
              <button
                type="button"
                onClick={() => setSelectedImage(course.image)}
                className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                  currentPoster === course.image
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Latest (Black/Gold)
              </button>
              {course.secondaryImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(course.secondaryImage || course.galleryImages![1])}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                    currentPoster === course.secondaryImage
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Previous Artwork
                </button>
              )}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-amber-300 font-semibold tracking-wider uppercase">
                {course.organization}
              </span>
              {course.badge && (
                <span className="bg-amber-500 text-stone-950 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                  {course.badge}
                </span>
              )}
            </div>
            <h3 id="course-modal-title" className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
              {course.subtitle}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-stone-200 text-xs">
            {course.date ? (
              <div>
                <span className="text-stone-500 block">Training Date</span>
                <span className="font-semibold text-stone-900 text-sm">{course.date}</span>
              </div>
            ) : (
              <div>
                <span className="text-stone-500 block">Duration / Format</span>
                <span className="font-semibold text-stone-900 text-sm">{course.duration || 'Specialized VIP Module'}</span>
              </div>
            )}

            {course.location && (
              <div>
                <span className="text-stone-500 block">Venue Location</span>
                <span className="font-semibold text-stone-900 text-sm">{course.location}</span>
              </div>
            )}

            <div>
              <span className="text-stone-500 block">Tuition Rate</span>
              <span className="font-semibold text-stone-900 text-sm">{course.priceFormatted}</span>
            </div>

            {course.slotsInfo && (
              <div>
                <span className="text-stone-500 block">Capacity</span>
                <span className="font-semibold text-stone-900 text-sm">{course.slotsInfo}</span>
              </div>
            )}

            {course.registrationDeadline && (
              <div className="sm:col-span-2">
                <span className="text-amber-800 block font-semibold">Registration Deadline</span>
                <span className="font-bold text-amber-950 text-sm">Register Until {course.registrationDeadline}</span>
              </div>
            )}
          </div>

          {/* Highlights */}
          {course.highlights && course.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.highlights.map((h, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Course Overview
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              {course.description}
            </p>
          </div>

          {/* Topics */}
          {course.topics && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
                Training Coverage & Topics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.topics.map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 p-2 rounded bg-stone-50 border border-stone-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing note */}
          {course.pricingNote && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-950">
              <span className="font-semibold block mb-0.5">Registration & Inclusions:</span>
              <p className="text-amber-900">{course.pricingNote}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-stone-500 block">Schedule & Tuition</span>
            <span className="font-serif text-sm font-semibold text-stone-900">
              Please contact BATC directly
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 text-center rounded hover:bg-stone-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md shadow-sm transition-all text-center cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>{isVip ? 'Inquire About Training' : 'Register / Inquire'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
