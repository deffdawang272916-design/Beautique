import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { PublicAppointmentStatus, APPOINTMENT_STATUSES } from '../types/appointment';

interface AppointmentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRef?: string;
  initialToken?: string;
}

export const AppointmentStatusModal: React.FC<AppointmentStatusModalProps> = ({
  isOpen,
  onClose,
  initialRef = '',
  initialToken = '',
}) => {
  const [referenceCode, setReferenceCode] = useState(initialRef);
  const [statusToken, setStatusToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicAppointmentStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialRef) setReferenceCode(initialRef);
      if (initialToken) setStatusToken(initialToken);
      setError(null);
      setResult(null);
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen, initialRef, initialToken]);

  if (!isOpen) return null;

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!referenceCode.trim() || !statusToken.trim()) {
      setError('Please provide both your reference code and status verification key.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/appointments/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceCode: referenceCode.trim().toUpperCase(),
          statusToken: statusToken.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to locate appointment record.');
      }

      setResult(data.appointment);
    } catch (err: any) {
      setError(err.message || 'Error looking up appointment status.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-lookup-title"
    >
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
              Live Status Verification
            </span>
            <h3 id="status-lookup-title" className="font-serif text-lg sm:text-xl font-semibold text-stone-900 mt-0.5">
              Check Appointment Status
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close status dialog"
            className="p-2 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Reference Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BT-APT-8275"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Status Verification Key *
              </label>
              <input
                type="text"
                required
                placeholder="Enter 32-character security key"
                value={statusToken}
                onChange={(e) => setStatusToken(e.target.value.trim())}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Verification keys protect customer privacy by preventing unauthorized status lookups.
              </span>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 text-stone-50 text-xs sm:text-sm font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Checking Backend Status...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify Status</span>
                </>
              )}
            </button>
          </form>

          {/* Results Display */}
          {result && (
            <div className="pt-3 border-t border-stone-200 space-y-3 animate-in fade-in duration-200">
              {/* Status Header Badge */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-stone-50">
                <div>
                  <span className="text-xs text-stone-500 block">Current Status</span>
                  <span className="font-semibold text-sm text-stone-900">
                    {result.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION && 'Pending Staff Confirmation'}
                    {result.status === APPOINTMENT_STATUSES.CONFIRMED && 'Appointment Confirmed ✓'}
                    {result.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED && 'New Schedule Proposed'}
                    {result.status === APPOINTMENT_STATUSES.DECLINED && 'Request Declined'}
                    {result.status === APPOINTMENT_STATUSES.CANCELLED && 'Appointment Cancelled'}
                  </span>
                </div>
                <div>
                  {result.status === APPOINTMENT_STATUSES.CONFIRMED ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Confirmed
                    </span>
                  ) : result.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION ? (
                    <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      Under Review
                    </span>
                  ) : result.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED ? (
                    <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-700" />
                      Schedule Update
                    </span>
                  ) : (
                    <span className="bg-stone-200 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {result.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Details */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">Service:</span>
                  <span className="font-semibold text-stone-800">{result.serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">Requested Schedule:</span>
                  <span className="text-stone-800">{result.preferredDate} ({result.preferredTime})</span>
                </div>

                {result.status === APPOINTMENT_STATUSES.CONFIRMED && (
                  <div className="flex justify-between border-b border-emerald-100 pb-1.5 bg-emerald-50/50 p-1.5 rounded">
                    <span className="text-emerald-800 font-semibold">Confirmed Schedule:</span>
                    <span className="text-emerald-950 font-bold">{result.confirmedDate} at {result.confirmedTime}</span>
                  </div>
                )}

                {result.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED && (
                  <div className="flex justify-between border-b border-blue-100 pb-1.5 bg-blue-50/50 p-1.5 rounded">
                    <span className="text-blue-800 font-semibold">Proposed Schedule:</span>
                    <span className="text-blue-950 font-bold">{result.proposedDate} at {result.proposedTime}</span>
                  </div>
                )}

                <div className="flex justify-between pt-0.5">
                  <span className="text-stone-500">Client:</span>
                  <span className="text-stone-800">{result.clientNameMasked}</span>
                </div>
              </div>

              {/* Reassurance text */}
              <p className="text-[11px] text-stone-500 text-center">
                For changes, questions, or immediate coordination, please call 0962 740 0487 or 0930 344 1943.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
