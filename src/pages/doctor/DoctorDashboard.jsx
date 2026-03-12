import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUsers, FiCheckCircle, FiClock, FiArrowRight, FiUpload } from 'react-icons/fi';
import { DOCTOR_TODAY_APPOINTMENTS, ALL_PATIENTS } from '../../data/mockData';
import { StatsCard, StatusBadge } from '../../components/ui/index';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const completed  = DOCTOR_TODAY_APPOINTMENTS.filter(a => a.status === 'completed').length;
  const upcoming   = DOCTOR_TODAY_APPOINTMENTS.filter(a => a.status === 'upcoming').length;
  const inProgress = DOCTOR_TODAY_APPOINTMENTS.filter(a => a.status === 'in-progress');

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Greeting */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Good morning, Dr. Mitchell 👋</h2>
        <p className="text-slate-500 mt-1 text-sm">You have {upcoming} upcoming appointments today.</p>
      </div>

      {/* Stats – 2 cols mobile, 4 desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard icon={FiCalendar}    label="Today"     value={DOCTOR_TODAY_APPOINTMENTS.length} color="blue"   />
        <StatsCard icon={FiCheckCircle} label="Completed" value={completed}                         color="green"  />
        <StatsCard icon={FiClock}       label="Upcoming"  value={upcoming}                          color="orange" />
        <StatsCard icon={FiUsers}       label="Patients"  value={ALL_PATIENTS.length}               color="purple" />
      </div>

      {/* In Progress banner */}
      {inProgress.length > 0 && (
        <div className="card p-4 bg-orange-50 border border-orange-200 flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FiClock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-orange-900 text-sm">Session in Progress</div>
            <div className="text-sm text-orange-700 truncate">{inProgress[0].patient} · {inProgress[0].type} · {inProgress[0].time}</div>
          </div>
          <span className="badge bg-orange-200 text-orange-700 flex-shrink-0">Live</span>
        </div>
      )}

      {/* Schedule + sidebar */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's schedule */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
            <h3 className="section-title text-base">Today's Schedule</h3>
            <button onClick={() => navigate('/doctor/appointments')} className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1">
              Full view <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {DOCTOR_TODAY_APPOINTMENTS.map(appt => (
              <div key={appt.id} className="flex items-center gap-3 px-4 sm:px-6 py-3.5">
                <div className="w-14 text-center flex-shrink-0">
                  <div className="text-sm font-bold text-slate-900 leading-tight">{appt.time.split(' ')[0]}</div>
                  <div className="text-xs text-slate-400">{appt.time.split(' ')[1]}</div>
                </div>
                <div className="w-px h-8 bg-slate-100 flex-shrink-0" />
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                  {appt.patient.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm truncate">{appt.patient}</div>
                  <div className="text-xs text-slate-500 truncate">{appt.type}</div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + recent patients */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="section-title mb-4 text-base">Quick Actions</h3>
            <div className="space-y-2.5">
              <button onClick={() => navigate('/doctor/patients')}     className="btn-secondary w-full text-sm py-2.5"><FiUsers   className="w-4 h-4" /> My Patients</button>
              <button onClick={() => navigate('/doctor/upload-report')} className="btn-outline  w-full text-sm py-2.5"><FiUpload   className="w-4 h-4" /> Upload Report</button>
              <button onClick={() => navigate('/doctor/appointments')} className="btn-outline  w-full text-sm py-2.5"><FiCalendar className="w-4 h-4" /> View Schedule</button>
            </div>
          </div>
          <div className="card">
            <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
              <h3 className="section-title text-base">Recent Patients</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {ALL_PATIENTS.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer hover:bg-slate-50" onClick={() => navigate('/doctor/patients')}>
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                    {p.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 truncate">{p.condition}</div>
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
