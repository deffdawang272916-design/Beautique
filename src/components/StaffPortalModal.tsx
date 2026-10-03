import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  CheckCircle,
  Calendar,
  Clock,
  AlertTriangle,
  RefreshCw,
  Phone,
  MessageSquare,
  ChevronRight,
  Shield,
  Send,
  Eye,
  XCircle,
} from 'lucide-react';
import { AppointmentRecord, APPOINTMENT_STATUSES } from '../types/appointment';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({ isOpen, onClose }) => {
  const [staffKey, setStaffKey] = useState<string>(() => {
    return sessionStorage.getItem('beautique_staff_key') || 'beautique-staff-demo-2026';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [smsProviderInfo, setSmsProviderInfo] = useState<{ name: string; isMock: boolean }>({
    name: 'mock',
    isMock: true,
  });

  // Action dialog states
  const [actionType, setActionType] = useState<'confirm' | 'reschedule' | 'decline' | 'cancel' | null>(null);
  const [actionDate, setActionDate] = useState<string>('');
  const [actionTime, setActionTime] = useState<string>('');
  const [staffNotes, setStaffNotes] = useState<string>('');
  const [actionReason, setActionReason] = useState<string>('');
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Attempt auto-login if key is stored
      if (staffKey) {
        fetchAppointments(staffKey);
      }
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function fetchAppointments(keyToUse = staffKey) {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/staff/appointments', {
        headers: {
          Authorization: `Bearer ${keyToUse.trim()}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setIsAuthenticated(false);
        throw new Error(data.error || 'Authentication failed. Check your staff passkey.');
      }

      setIsAuthenticated(true);
      sessionStorage.setItem('beautique_staff_key', keyToUse.trim());
      setAppointments(data.appointments || []);
      setSmsProviderInfo({
        name: data.smsProvider || 'mock',
        isMock: Boolean(data.isMockSms),
      });

      // Update selected appointment if open
      if (selectedAppointment) {
        const refreshed = data.appointments.find((a: AppointmentRecord) => a.id === selectedAppointment.id);
        if (refreshed) setSelectedAppointment(refreshed);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Staff authentication error');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffKey.trim()) {
      setAuthError('Staff passkey is required.');
      return;
    }
    fetchAppointments(staffKey);
  };

  const openConfirmDialog = (apt: AppointmentRecord) => {
    setSelectedAppointment(apt);
    setActionType('confirm');
    setActionDate(apt.preferredDate);
    setActionTime(apt.preferredTime);
    setStaffNotes('');
    setActionMessage(null);
  };

  const openRescheduleDialog = (apt: AppointmentRecord) => {
    setSelectedAppointment(apt);
    setActionType('reschedule');
    setActionDate(apt.preferredDate);
    setActionTime('01:00 PM – 03:00 PM');
    setStaffNotes('');
    setActionMessage(null);
  };

  const openDeclineDialog = (apt: AppointmentRecord) => {
    setSelectedAppointment(apt);
    setActionType('decline');
    setActionReason('Requested timeslot is unavailable. Clinic fully booked.');
    setStaffNotes('');
    setActionMessage(null);
  };

  const openCancelDialog = (apt: AppointmentRecord) => {
    setSelectedAppointment(apt);
    setActionType('cancel');
    setActionReason('Cancelled per customer telephone request.');
    setStaffNotes('');
    setActionMessage(null);
  };

  const handleExecuteAction = async () => {
    if (!selectedAppointment || !actionType) return;

    setIsProcessingAction(true);
    setActionMessage(null);

    let endpoint = '';
    let payload: any = {};

    if (actionType === 'confirm') {
      if (!actionDate || !actionTime) {
        setActionMessage({ text: 'Explicit confirmed date and time are required.', type: 'error' });
        setIsProcessingAction(false);
        return;
      }
      endpoint = `/api/staff/appointments/${selectedAppointment.id}/confirm`;
      payload = { confirmedDate: actionDate, confirmedTime: actionTime, staffNotes };
    } else if (actionType === 'reschedule') {
      if (!actionDate || !actionTime) {
        setActionMessage({ text: 'Explicit proposed date and time are required.', type: 'error' });
        setIsProcessingAction(false);
        return;
      }
      endpoint = `/api/staff/appointments/${selectedAppointment.id}/propose-schedule`;
      payload = { proposedDate: actionDate, proposedTime: actionTime, staffNotes };
    } else if (actionType === 'decline') {
      endpoint = `/api/staff/appointments/${selectedAppointment.id}/decline`;
      payload = { reason: actionReason, staffNotes };
    } else if (actionType === 'cancel') {
      endpoint = `/api/staff/appointments/${selectedAppointment.id}/cancel`;
      payload = { reason: actionReason, staffNotes };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffKey.trim()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update appointment status.');
      }

      setActionMessage({ text: 'Status updated and customer notification dispatched!', type: 'success' });
      await fetchAppointments();
      setTimeout(() => {
        setActionType(null);
      }, 1200);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error processing action', type: 'error' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden border border-stone-300 flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-tight">
                  Beautique Staff Portal — Santa Rosa
                </h3>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                    smsProviderInfo.isMock
                      ? 'bg-amber-900/80 text-amber-200 border border-amber-700/50'
                      : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/50'
                  }`}
                >
                  SMS: {smsProviderInfo.name} ({smsProviderInfo.isMock ? 'Mock Mode' : 'Live Gateway'})
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Staff Appointment Lifecycle Review & Notification Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => fetchAppointments()}
                disabled={isLoading}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close staff portal"
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 flex-1">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center text-stone-700">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif text-xl font-semibold text-stone-900">
                Authorized Clinic Staff Only
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Enter the clinic staff passkey to review appointment requests, confirm schedules, and dispatch customer SMS notifications.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3 pt-2">
              <input
                type="password"
                required
                placeholder="Enter Staff API Passkey"
                value={staffKey}
                onChange={(e) => setStaffKey(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />

              {authError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 text-left">
                  {authError}
                </div>
              )}

              <p className="text-[11px] text-stone-400 text-left">
                Default local passkey: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">beautique-staff-demo-2026</code>
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1C1917] hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Authorize & View Queue</span>
              </button>
            </form>
          </div>
        ) : (
          /* Main Staff Dashboard Layout */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Queue Panel */}
            <div className="w-full md:w-5/12 lg:w-4/12 border-r border-stone-200 flex flex-col bg-stone-50/50">
              {/* Filter Tabs */}
              <div className="p-3 border-b border-stone-200 bg-white flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: APPOINTMENT_STATUSES.PENDING_CONFIRMATION, label: 'Pending' },
                  { id: APPOINTMENT_STATUSES.CONFIRMED, label: 'Confirmed' },
                  { id: APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED, label: 'Rescheduled' },
                  { id: APPOINTMENT_STATUSES.DECLINED, label: 'Declined' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1 rounded font-medium transition-colors shrink-0 ${
                      statusFilter === tab.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Queue List */}
              <div className="flex-1 overflow-y-auto divide-y divide-stone-200">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    No appointment requests found in this filter category.
                  </div>
                ) : (
                  filteredAppointments.map((apt) => {
                    const isSelected = selectedAppointment?.id === apt.id;
                    return (
                      <div
                        key={apt.id}
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setActionType(null);
                        }}
                        className={`p-3.5 transition-colors cursor-pointer text-left ${
                          isSelected ? 'bg-amber-50/80 border-l-4 border-amber-800' : 'hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-stone-900">{apt.referenceCode}</span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                              apt.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION
                                ? 'bg-amber-100 text-amber-900'
                                : apt.status === APPOINTMENT_STATUSES.CONFIRMED
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : apt.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {apt.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION && 'Pending'}
                            {apt.status === APPOINTMENT_STATUSES.CONFIRMED && 'Confirmed ✓'}
                            {apt.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED && 'Reschedule'}
                            {apt.status === APPOINTMENT_STATUSES.DECLINED && 'Declined'}
                            {apt.status === APPOINTMENT_STATUSES.CANCELLED && 'Cancelled'}
                          </span>
                        </div>

                        <p className="font-medium text-stone-900 text-sm">{apt.clientName}</p>
                        <p className="text-xs text-amber-900 font-medium truncate">{apt.serviceName}</p>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                          <span>Req: {apt.preferredDate}</span>
                          <span className="font-mono text-[10px]">{apt.mobileNumber}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Detail & Action Panel */}
            <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col bg-white overflow-y-auto p-4 sm:p-6">
              {!selectedAppointment ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-stone-400">
                  <Calendar className="w-12 h-12 stroke-[1.2] mb-2" />
                  <p className="text-sm font-medium text-stone-700">Select an Appointment from the Queue</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Choose a request on the left to review customer schedule preferences, verify details, and perform confirmation actions.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  {/* Top Bar for Selected Request */}
                  <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-stone-100 text-stone-900 px-2 py-0.5 rounded border border-stone-300">
                          {selectedAppointment.referenceCode}
                        </span>
                        <span className="text-xs text-stone-500">
                          Submitted: {new Date(selectedAppointment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                        {selectedAppointment.clientName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedAppointment.mobileNumber}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-700" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>

                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                      <span className="text-stone-500 font-medium block">Service Requested</span>
                      <p className="font-semibold text-stone-900 text-sm">{selectedAppointment.serviceName}</p>
                      <p className="text-stone-600">ID: {selectedAppointment.serviceId}</p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                      <span className="text-stone-500 font-medium block">Customer Preferred Schedule</span>
                      <p className="font-semibold text-stone-900 text-sm">{selectedAppointment.preferredDate}</p>
                      <p className="text-stone-600">{selectedAppointment.preferredTime}</p>
                    </div>
                  </div>

                  {/* Customer Skin Notes */}
                  {selectedAppointment.skinConcerns && (
                    <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg text-xs space-y-1">
                      <span className="font-semibold text-amber-900 block">Customer Inquiries / Skin Notes:</span>
                      <p className="text-stone-700 italic">"{selectedAppointment.skinConcerns}"</p>
                    </div>
                  )}

                  {/* Confirmed or Proposed Schedule Display */}
                  {selectedAppointment.status === APPOINTMENT_STATUSES.CONFIRMED && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                      <span className="font-semibold text-emerald-900 block flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Confirmed Schedule:
                      </span>
                      <p className="text-sm font-bold text-emerald-950">
                        {selectedAppointment.confirmedDate} at {selectedAppointment.confirmedTime}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.status === APPOINTMENT_STATUSES.RESCHEDULE_PROPOSED && (
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
                      <span className="font-semibold text-blue-900 block flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Proposed Alternate Schedule:
                      </span>
                      <p className="text-sm font-bold text-blue-950">
                        {selectedAppointment.proposedDate} at {selectedAppointment.proposedTime}
                      </p>
                    </div>
                  )}

                  {/* Staff Consequential Actions Bar */}
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <span className="text-xs uppercase tracking-wider font-semibold text-stone-700 block">
                      Staff Actions (Consequential Lifecycle Updates)
                    </span>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openConfirmDialog(selectedAppointment)}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>CONFIRM APPOINTMENT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openRescheduleDialog(selectedAppointment)}
                        className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>PROPOSE NEW SCHEDULE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeclineDialog(selectedAppointment)}
                        className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-stone-600" />
                        <span>DECLINE REQUEST</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCancelDialog(selectedAppointment)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>CANCEL APPOINTMENT</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Action Modal / Form */}
                  {actionType && (
                    <div className="p-4 bg-stone-100 border border-stone-300 rounded-xl space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs uppercase tracking-wider text-stone-900">
                          {actionType === 'confirm' && 'Confirm Appointment & Send SMS'}
                          {actionType === 'reschedule' && 'Propose New Schedule & Send SMS'}
                          {actionType === 'decline' && 'Decline Appointment & Send SMS'}
                          {actionType === 'cancel' && 'Cancel Appointment & Send SMS'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActionType(null)}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {(actionType === 'confirm' || actionType === 'reschedule') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                              {actionType === 'confirm' ? 'Explicit Confirmed Date *' : 'Proposed Date *'}
                            </label>
                            <input
                              type="date"
                              required
                              value={actionDate}
                              onChange={(e) => setActionDate(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                              {actionType === 'confirm' ? 'Explicit Confirmed Time *' : 'Proposed Time *'}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 10:00 AM"
                              value={actionTime}
                              onChange={(e) => setActionTime(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {(actionType === 'decline' || actionType === 'cancel') && (
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Reason / Internal Note:
                          </label>
                          <input
                            type="text"
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-xs"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Internal Staff Notes (Optional — Never Sent to Customer):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Confirmed with Dra. Amelyn; practitioner room 2"
                          value={staffNotes}
                          onChange={(e) => setStaffNotes(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-xs"
                        />
                      </div>

                      {actionMessage && (
                        <div
                          className={`p-2.5 rounded text-xs ${
                            actionMessage.type === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {actionMessage.text}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActionType(null)}
                          disabled={isProcessingAction}
                          className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteAction}
                          disabled={isProcessingAction}
                          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-500 text-white font-semibold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {isProcessingAction ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Confirm & Send Customer SMS</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SMS Audit Trail */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <span className="text-xs uppercase tracking-wider font-semibold text-stone-700 block">
                      SMS Audit Events Trail ({selectedAppointment.smsEvents.length} events)
                    </span>

                    {selectedAppointment.smsEvents.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No SMS events recorded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedAppointment.smsEvents.map((evt, idx) => (
                          <div
                            key={evt.eventId || idx}
                            className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-stone-800 uppercase tracking-wider">
                                {evt.messageType}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-semibold uppercase text-[10px] ${
                                  evt.status === 'delivered' || evt.status === 'sent' || evt.status === 'accepted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : evt.status === 'mock'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {evt.status}
                              </span>
                            </div>
                            <p className="text-stone-600 font-mono text-[11px] truncate">
                              Provider: {evt.provider} | Message ID: {evt.providerMessageId || 'N/A'}
                            </p>
                            <p className="text-stone-500 text-[10px]">
                              Dispatched at: {new Date(evt.createdAt).toLocaleString()}
                            </p>
                            {evt.failureReason && (
                              <p className="text-red-600 text-[11px]">Failure reason: {evt.failureReason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
