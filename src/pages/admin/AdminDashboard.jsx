import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiTrendingUp, FiActivity, FiFileText, FiArrowRight, FiKey } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import api from '../../services/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { StatsCard, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } },
};

const MOCK_CHART_DATA = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Revenue',
    data: [12000, 15000, 14000, 18000, 19000, 22000, 25000],
    borderColor: '#0f172a',
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    fill: true,
    tension: 0.4
  }]
};

import { ADMIN_STATS } from '../../data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/api/admin/stats.php');
        setData(response.data);
      } catch (error) {
        console.warn('Backend offline, using mock stats');
        setData(ADMIN_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading admin dashboard...</div>;
  if (!data || !data.stats) return <div className="p-8 text-center text-red-500">Failed to load dashboard data. Please try again later.</div>;

  const { stats, recentAppointments } = data;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Health Network Overview</p>
          <p className="text-xs text-slate-400 mt-1">Live updates from Southern Spine</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FiUsers}      label="Total Patients"  value={stats?.totalPatients || 0}   color="blue"   onClick={() => navigate('/admin/patients')} />
        <StatsCard icon={FiActivity}   label="Doctors"         value={stats?.totalDoctors || 0}    color="green"  onClick={() => navigate('/admin/doctors')} />
        <StatsCard icon={FiCalendar}   label="Active Bookings" value={stats?.activeAppointments || 0} color="purple" onClick={() => navigate('/admin/clinics')} />
        <StatsCard icon={FiDollarSign} label="Monthly Revenue" value={`$${((stats?.totalAppointments || 0) * 85).toLocaleString()}`} color="orange" onClick={() => navigate('/admin/analytics')} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Revenue (Est. Trend)</h3>
            <button onClick={() => navigate('/admin/analytics')} className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline">
              Full analytics <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div style={{ height: 220 }}>
            <Line data={MOCK_CHART_DATA} options={chartOptions} />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="section-title mb-4">Appointments Distribution</h3>
          <div style={{ height: 220 }}>
            <Bar data={MOCK_CHART_DATA} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="section-title">Recent Activity</h3>
            <span className="badge-blue">{recentAppointments.length} total</span>
          </div>
          <div className="divide-y divide-slate-50">
            {(!recentAppointments || recentAppointments.length === 0) && <p className="p-6 text-center text-slate-400 text-sm">No recent activity</p>}
            {(recentAppointments || []).slice(0, 5).map((a, i) => {
              const timeParts = (a.appointment_time || "00:00").split(':');
              const displayTime = timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : (a.appointment_time || '--:--');
              
              return (
                <div key={a.id || i} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-16 text-sm font-bold text-slate-800 flex-shrink-0">{displayTime}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">{a.patient_name || 'Patient'}</div>
                    <div className="text-xs text-slate-500">{a.type || 'Appointment'}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Center */}
        <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
          <h3 className="section-title text-white mb-4">Management Console</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/admin/doctors')} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left">
              <FiActivity className="w-6 h-6 mb-2 text-green-400" />
              <p className="font-bold text-sm">Doctors</p>
              <p className="text-xs text-slate-400">Manage staff</p>
            </button>
            <button onClick={() => navigate('/admin/clinics')} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left">
              <FiMapPin className="w-6 h-6 mb-2 text-purple-400" />
              <p className="font-bold text-sm">Clinics</p>
              <p className="text-xs text-slate-400">Locations</p>
            </button>
          </div>
          <button onClick={() => navigate('/admin/analytics')} className="w-full mt-4 py-3 bg-primary-600 rounded-xl font-bold text-sm hover:bg-primary-500 transition-all flex items-center justify-center gap-2">
            View Regional Analytics <FiTrendingUp className="w-4 h-4" />
          </button>
          <div className="card p-5 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-0">
            <FiKey className="w-8 h-8 text-primary-200 mb-4" />
            <h4 className="font-bold underline-offset-4 decoration-primary-300">Staff Access</h4>
            <p className="text-sm text-primary-100 mt-1 mb-5">Generate security codes for new doctor and admin registration.</p>
            <button onClick={() => navigate('/admin/codes')} className="btn-secondary w-full py-2.5 text-sm">
              Manage Codes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
