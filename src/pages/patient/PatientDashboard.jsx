import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiFileText, FiArrowRight, FiPlus, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatsCard, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';
import { PATIENT_DASHBOARD_DATA } from '../../data/mockData';

function UpcomingCard({ appt }) {
  if (!appt) return (
    <div className="card p-6 bg-slate-50 border-dashed flex flex-col items-center justify-center text-center">
      <FiCalendar className="w-10 h-10 text-slate-300 mb-2" />
      <p className="text-slate-500 font-medium">No upcoming appointments</p>
      <button className="text-primary-600 text-sm font-bold mt-2 hover:underline">Book one now</button>
    </div>
  );
  
  return (
    <div className="card p-5 sm:p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-primary-200 text-sm font-medium mb-1">Next Appointment</p>
          <h3 className="text-lg sm:text-xl font-bold truncate">{appt.doctor_name || 'Clinic Session'}</h3>
          <p className="text-primary-200 text-sm">{appt.specialty}</p>
        </div>
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <FiCalendar className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: 'Date', value: new Date(appt.appointment_date).toLocaleDateString('en-AU', { day:'numeric', month:'short' }) },
          { label: 'Time', value: appt.appointment_time },
          { label: 'Room', value: appt.location || 'TBA' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/10 rounded-xl p-2 sm:p-3 text-center">
            <p className="text-xs text-primary-200 mb-0.5">{label}</p>
            <p className="text-xs sm:text-sm font-bold leading-tight">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const isMockToken = localStorage.getItem('token')?.startsWith('mock-');
      if (isMockToken) {
         setData(PATIENT_DASHBOARD_DATA);
         setLoading(false);
         return;
      }

      try {
        const response = await api.get('/api/patient/dashboard.php');
        setData(response.data);
      } catch (error) {
        console.warn('Backend offline, using mock patient dashboard data');
        setData(PATIENT_DASHBOARD_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const { stats, upcoming, reports } = data || { stats: {}, upcoming: [], reports: [] };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Greeting + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Good morning, {user?.name?.split(' ')[0]} 👋
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard icon={FiCalendar} label="Upcoming"      value={stats.upcoming}  color="blue"   />
        <StatsCard icon={FiActivity} label="Completed"     value={stats.completed} color="green"  />
        <StatsCard icon={FiFileText} label="Reports"       value={stats.reports}   color="purple" />
        <StatsCard icon={FiClock}    label="Total Sessions" value={stats.total}     color="orange" />
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-5">
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
              {upcoming.length === 0 && (
                <p className="p-6 text-center text-slate-400 text-sm">No appointments found</p>
              )}
              {upcoming.map(appt => (
                <div key={appt.id} className="flex items-center gap-3 px-4 sm:px-6 py-3.5">
                  <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm truncate">{appt.type}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {appt.doctor_name} · {new Date(appt.appointment_date).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}
                    </div>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <FiCalendar className="w-7 h-7 text-primary-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Need a session?</h4>
            <p className="text-sm text-slate-600 mb-4">Book your next appointment in 3 easy steps.</p>
            <button onClick={() => navigate('/patient/book-appointment')} className="btn-primary w-full text-sm py-2.5">
              Book Now <FiArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
              <h3 className="section-title text-base">Recent Reports</h3>
              <button onClick={() => navigate('/patient/reports')} className="text-sm text-primary-600 font-semibold hover:underline">
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {reports.length === 0 && (
                <p className="p-4 text-center text-slate-400 text-xs">No reports available</p>
              )}
              {reports.map(r => (
                <div key={r.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFileText className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{r.title}</div>
                    <div className="text-xs text-slate-400">{new Date(r.report_date).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}</div>
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
