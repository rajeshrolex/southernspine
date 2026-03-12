import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiTrendingUp, FiActivity, FiFileText, FiArrowRight } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { ADMIN_STATS, REVENUE_DATA, APPOINTMENTS_DATA, DOCTOR_TODAY_APPOINTMENTS, ALL_PATIENTS, CLINICS } from '../../data/mockData';
import { StatsCard } from '../../components/ui/index';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Overview</h2>
        <p className="text-slate-500 mt-1">Southern Spine Clinic – March 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FiUsers}     label="Total Patients"  value={ADMIN_STATS.totalPatients}  change={ADMIN_STATS.patientGrowth} color="blue"   onClick={() => navigate('/admin/patients')} />
        <StatsCard icon={FiActivity}  label="Doctors"         value={ADMIN_STATS.totalDoctors}                                       color="green"  onClick={() => navigate('/admin/doctors')} />
        <StatsCard icon={FiMapPin}    label="Clinics"         value={ADMIN_STATS.totalClinics}                                        color="purple" onClick={() => navigate('/admin/clinics')} />
        <StatsCard icon={FiDollarSign} label="Monthly Revenue" value={`$${ADMIN_STATS.monthlyRevenue.toLocaleString()}`} change={ADMIN_STATS.revenueGrowth} color="orange" onClick={() => navigate('/admin/analytics')} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FiCalendar}  label="Today"           value={ADMIN_STATS.appointmentsToday}  color="blue"   />
        <StatsCard icon={FiCalendar}  label="This Month"      value={ADMIN_STATS.appointmentsMonth}  color="teal"   />
        <StatsCard icon={FiFileText}  label="Pending Reports" value={ADMIN_STATS.pendingReports}     color="red"    />
        <StatsCard icon={FiTrendingUp} label="Revenue Growth" value={ADMIN_STATS.revenueGrowth}      color="green"  />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Revenue (Last 7 months)</h3>
            <button onClick={() => navigate('/admin/analytics')} className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline">
              Full analytics <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div style={{ height: 220 }}>
            <Line data={REVENUE_DATA} options={chartOptions} />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="section-title mb-4">Appointments This Week</h3>
          <div style={{ height: 220 }}>
            <Bar data={APPOINTMENTS_DATA} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="section-title">Today's Appointments</h3>
            <span className="badge-blue">{ADMIN_STATS.appointmentsToday} total</span>
          </div>
          <div className="divide-y divide-slate-50">
            {DOCTOR_TODAY_APPOINTMENTS.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-16 text-sm font-bold text-slate-800 flex-shrink-0">{a.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">{a.patient}</div>
                  <div className="text-xs text-slate-500">{a.type}</div>
                </div>
                <span className={`badge ${a.status==='completed'?'badge-green':a.status==='in-progress'?'badge-orange':'badge-blue'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinics overview */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="section-title">Clinic Locations</h3>
            <button onClick={() => navigate('/admin/clinics')} className="text-sm text-primary-600 font-semibold hover:underline">View all</button>
          </div>
          <div className="divide-y divide-slate-50">
            {CLINICS.map(clinic => (
              <div key={clinic.id} className="px-5 py-4">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-slate-900 text-sm">{clinic.name}</div>
                  <span className="badge-green">Active</span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{clinic.address}</div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>👨‍⚕️ {clinic.doctors} doctors</span>
                  <span>👥 {clinic.patients} patients</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
