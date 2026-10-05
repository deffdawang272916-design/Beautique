import React, { useState, useEffect } from 'react';
import { X, CheckCircle, MessageCircle, GraduationCap, Phone } from 'lucide-react';
import { TrainingCourse } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface EnrollmentModalProps {
  course: TrainingCourse | null;
  onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  course,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [background, setBackground] = useState('Aspiring Practitioner / Entrepreneur');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>{course.organization}</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 mt-0.5">
              {isSuccess ? 'Registration Request Sent' : 'Training Registration Request'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close training registration dialog"
            className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75dvh] overflow-y-auto">
            {/* Course Summary */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-semibold text-stone-900 text-sm">{course.title}</p>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-xs">{course.priceFormatted}</span>
              </div>
              <p className="text-stone-600">{course.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-stone-700">
                {course.date && <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Date: <strong>{course.date}</strong></span>}
                {course.registrationDeadline && <span className="bg-red-50 text-red-900 px-2 py-0.5 rounded border border-red-200">Register until: <strong>{course.registrationDeadline}</strong></span>}
                {course.slotsInfo && <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Capacity: <strong>{course.slotsInfo}</strong></span>}
                {course.location && <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Venue: <strong>{course.location}</strong></span>}
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Christine Joy Villanueva"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="09xx xxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Your Background / Interest
              </label>
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                <option value="Aspiring Practitioner / Entrepreneur">Aspiring Practitioner / Entrepreneur</option>
                <option value="Salon or Spa Owner">Salon or Spa Owner</option>
                <option value="Practicing Aesthetician">Practicing Aesthetician</option>
                <option value="Healthcare / Allied Health Background">Healthcare / Allied Health Background</option>
                <option value="Other / Career Shifter">Other / Career Shifter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Questions or Inquiries (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Schedule inquiries, venue details, or group registration"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded text-base sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Actions: Stacks vertically on mobile (<640px) and horizontally on sm: */}
            <div className="pt-3 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-medium text-stone-600 hover:text-stone-900 text-center rounded hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium py-3 sm:py-2.5 px-6 rounded-md shadow-xs transition-colors text-center cursor-pointer"
              >
                Submit Registration Request
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-semibold text-stone-900">
                Thank you, {fullName}!
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Your training registration request for <strong>{course.title}</strong> has been received. Our training coordinators will get in touch with you at <strong>{phone}</strong> to confirm course requirements, slot reservation, and payment procedures.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={CLINIC_INFO.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on Facebook Page</span>
              </a>

              <a
                href="tel:09627400487"
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm py-2 px-4 rounded-md transition-colors border border-stone-200"
              >
                <Phone className="w-4 h-4 text-amber-800" />
                <span>Call Training Center (0962 740 0487)</span>
              </a>

              <button
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 pt-1 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
