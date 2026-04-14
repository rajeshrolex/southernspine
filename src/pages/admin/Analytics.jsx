import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiUsers } from 'react-icons/fi';
import { PageHeader, StatsCard } from '../../components/ui/index';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } },
};

const MOCK_TIME_SERIES = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Aggregate Data',
    data: [18, 22, 19, 28, 32, 29, 35],
    borderColor: '#0d9488',
    backgroundColor: 'rgba(13,148,136,0.08)',
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#0d9488',
    pointRadius: 4,
  }],
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/admin/stats.php');
        setData(response.data);
      } catch (error) {
        toast.error('Failed to load analytical data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Processing regional analytics...</div>;

  const { stats } = data;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader subtitle="Network revenue, appointments & demographics" />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FiDollarSign}  label="Total Revenue (Est)"  value={`$${(stats.totalAppointments * 85).toLocaleString()}`} color="blue"   />
        <StatsCard icon={FiCalendar}    label="Total Appointments"   value={stats.totalAppointments}                             color="orange" />
        <StatsCard icon={FiUsers}       label="Active Patient Base"  value={stats.totalPatients}                                 color="green"  />
        <StatsCard icon={FiTrendingUp}  label="Staff Strength"       value={stats.totalDoctors}                                  color="purple" />
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <h3 className="section-title mb-4">Network Growth Projection</h3>
        <div style={{ height: 240 }}>
          <Line data={MOCK_TIME_SERIES} options={chartBase} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments bar */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="section-title mb-4">Daily Activity Trends</h3>
          <div style={{ height: 220 }}>
            <Bar data={MOCK_TIME_SERIES} options={chartBase} />
          </div>
        </div>

        {/* Specialty summary */}
        <div className="card p-6">
          <h3 className="section-title mb-4">Patient Demographics</h3>
          <div className="flex items-center justify-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             Coming Soon in v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
