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
  // Body scroll lock with safe cleanup
  useEffect(() => {
    if (course) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [course]);

  if (!course) return null;

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
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-sm border border-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Header */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-900 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs text-amber-300 font-semibold tracking-wider uppercase mb-1">
              {course.organization}
            </p>
            <h3 id="course-modal-title" className="font-serif text-2xl sm:text-3xl font-semibold">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              {course.subtitle}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Key Specs Bar (Unboxed) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block">Course Duration</span>
              <span className="font-semibold text-stone-900 text-sm">{course.duration || '5-Day Full Aesthetic Course Training'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Tuition & Schedule</span>
              <span className="font-semibold text-stone-900 text-sm">{course.priceFormatted}</span>
            </div>
          </div>

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
                Core Curriculum Topics
              </h4>
              <div className="space-y-2">
                {course.topics.map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accreditation Notice */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-3 text-xs text-stone-700">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] block">
                Accreditation Registry Note
              </span>
              <p className="leading-relaxed">
                {CLINIC_INFO.trainingAccreditationNotice}
              </p>
            </div>
          </div>
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 font-medium text-xs sm:text-sm py-2.5 px-5 rounded-md shadow-sm transition-all text-center"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Inquire Enrollment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
