import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiFileText, FiArrowRight, FiPlus, FiActivity } from 'react-icons/fi';
import { PATIENT_APPOINTMENTS, PATIENT_REPORTS, MOCK_USER } from '../../data/mockData';
import { StatsCard, StatusBadge, PageHeader } from '../../components/ui/index';

function UpcomingCard({ appt }) {
  if (!appt) return null;
  return (
    <div className="card p-5 sm:p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-primary-200 text-sm font-medium mb-1">Next Appointment</p>
          <h3 className="text-lg sm:text-xl font-bold truncate">{appt.doctor}</h3>
          <p className="text-primary-200 text-sm">{appt.specialty}</p>
        </div>
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <FiCalendar className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: 'Date', value: new Date(appt.date).toLocaleDateString('en-AU', { day:'numeric', month:'short' }) },
          { label: 'Time', value: appt.time },
          { label: 'Room', value: appt.location },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/10 rounded-xl p-2 sm:p-3 text-center">
            <p className="text-xs text-primary-200 mb-0.5">{label}</p>
            <p className="text-xs sm:text-sm font-bold leading-tight">{value}</p>
          </div>
        ))}
      </div>
      {appt.notes && (
        <div className="mt-3 bg-white/10 rounded-xl p-3 text-sm text-primary-100">📋 {appt.notes}</div>
      )}
    </div>
  );
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const upcoming = PATIENT_APPOINTMENTS.filter(a => a.status === 'upcoming');
  const completed = PATIENT_APPOINTMENTS.filter(a => a.status === 'completed');

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Greeting + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Good morning, {MOCK_USER.name.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Here's your health overview for today.</p>
        </div>
        <button
          onClick={() => navigate('/patient/book-appointment')}
          className="btn-primary self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Stats – 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard icon={FiCalendar} label="Upcoming"      value={upcoming.length}              color="blue"   />
        <StatsCard icon={FiActivity} label="Completed"     value={completed.length}             color="green"  />
        <StatsCard icon={FiFileText} label="Reports"       value={PATIENT_REPORTS.length}       color="purple" />
        <StatsCard icon={FiClock}    label="Total Sessions" value={PATIENT_APPOINTMENTS.length} color="orange" />
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <UpcomingCard appt={upcoming[0]} />

          <div className="card">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
              <h3 className="section-title text-base">Appointment History</h3>
              <button
                onClick={() => navigate('/patient/appointments')}
                className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline"
              >
                View all <FiArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {PATIENT_APPOINTMENTS.slice(0, 4).map(appt => (
                <div key={appt.id} className="flex items-center gap-3 px-4 sm:px-6 py-3.5">
                  <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm truncate">{appt.type}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {appt.doctor} · {new Date(appt.date).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}
                    </div>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Book now CTA card */}
          <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <FiCalendar className="w-7 h-7 text-primary-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Need a session?</h4>
            <p className="text-sm text-slate-600 mb-4">Book your next appointment in 3 easy steps.</p>
            <button onClick={() => navigate('/patient/book-appointment')} className="btn-primary w-full text-sm py-2.5">
              Book Now <FiArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent reports */}
          <div className="card">
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
              <h3 className="section-title text-base">Recent Reports</h3>
              <button onClick={() => navigate('/patient/reports')} className="text-sm text-primary-600 font-semibold hover:underline">
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {PATIENT_REPORTS.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFileText className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{r.title}</div>
                    <div className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
