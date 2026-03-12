import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiUsers } from 'react-icons/fi';
import { ADMIN_STATS, REVENUE_DATA, APPOINTMENTS_DATA } from '../../data/mockData';
import { PageHeader, StatsCard } from '../../components/ui/index';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } },
};

const SPECIALTY_DATA = {
  labels: ['Physiotherapy', 'Chiropractic', 'Massage', 'Rehab', 'Other'],
  datasets: [{
    data: [42, 31, 12, 10, 5],
    backgroundColor: ['#2563eb','#0d9488','#8b5cf6','#ea580c','#94a3b8'],
    borderWidth: 0,
    borderRadius: 4,
  }],
};

const MONTHLY_PATIENTS = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'New Patients',
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
  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader title="Analytics" subtitle="Revenue, appointments & patient trends" />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FiDollarSign}  label="Monthly Revenue"      value={`$${ADMIN_STATS.monthlyRevenue.toLocaleString()}`} change={ADMIN_STATS.revenueGrowth}  color="blue"   />
        <StatsCard icon={FiCalendar}    label="Appointments / Month"  value={ADMIN_STATS.appointmentsMonth}                     change="+5.2%"                        color="orange" />
        <StatsCard icon={FiUsers}       label="Total Patients"        value={ADMIN_STATS.totalPatients}                         change={ADMIN_STATS.patientGrowth}    color="green"  />
        <StatsCard icon={FiTrendingUp}  label="Avg Revenue / Visit"   value="$104"                                              change="+2.1%"                        color="purple" />
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <h3 className="section-title mb-4">Monthly Revenue Trend</h3>
        <div style={{ height: 240 }}>
          <Line data={REVENUE_DATA} options={chartBase} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments bar */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="section-title mb-4">Appointments Per Day (This Week)</h3>
          <div style={{ height: 220 }}>
            <Bar data={APPOINTMENTS_DATA} options={chartBase} />
          </div>
        </div>

        {/* Specialty doughnut */}
        <div className="card p-6">
          <h3 className="section-title mb-4">Sessions by Specialty</h3>
          <div style={{ height: 160 }} className="mb-4">
            <Doughnut
              data={SPECIALTY_DATA}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' }}
            />
          </div>
          <div className="space-y-2">
            {SPECIALTY_DATA.labels.map((label, i) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: SPECIALTY_DATA.datasets[0].backgroundColor[i] }} />
                  <span className="text-slate-600">{label}</span>
                </div>
                <span className="font-semibold text-slate-900">{SPECIALTY_DATA.datasets[0].data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New patients trend */}
      <div className="card p-6">
        <h3 className="section-title mb-4">New Patients per Month</h3>
        <div style={{ height: 200 }}>
          <Line data={MONTHLY_PATIENTS} options={chartBase} />
        </div>
      </div>

      {/* Summary table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="section-title">Monthly Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Month</th>
                <th className="table-header">Revenue</th>
                <th className="table-header">Appointments</th>
                <th className="table-header">New Patients</th>
                <th className="table-header">Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { month: 'March 2026',    revenue: 42800, appts: 412, patients: 35, growth: '+8.4%',  color: 'text-green-600' },
                { month: 'February 2026', revenue: 39500, appts: 388, patients: 29, growth: '-1.5%',  color: 'text-red-500'   },
                { month: 'January 2026',  revenue: 40100, appts: 395, patients: 32, growth: '+3.1%',  color: 'text-green-600' },
                { month: 'December 2025', revenue: 38900, appts: 374, patients: 28, growth: '+24.7%', color: 'text-green-600' },
              ].map(row => (
                <tr key={row.month} className="table-row">
                  <td className="table-cell font-semibold text-slate-900">{row.month}</td>
                  <td className="table-cell font-bold text-slate-900">${row.revenue.toLocaleString()}</td>
                  <td className="table-cell">{row.appts}</td>
                  <td className="table-cell">{row.patients}</td>
                  <td className={`table-cell font-semibold ${row.color}`}>{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
