import React, { useState } from 'react';
import { FiCalendar, FiFilter, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { PATIENT_APPOINTMENTS } from '../../data/mockData';
import { StatusBadge, PageHeader, EmptyState } from '../../components/ui/index';

export default function Appointments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = PATIENT_APPOINTMENTS.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter;
    const matchSearch = a.doctor.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="My Appointments"
        subtitle="All your scheduled and past sessions"
        action={
          <button onClick={() => navigate('/patient/book-appointment')} className="btn-primary">
            + Book New
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="input pl-10 py-2.5 text-sm"
            placeholder="Search by doctor or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title="No appointments found"
          description="Try adjusting your filters or book a new appointment."
          action={<button onClick={() => navigate('/patient/book-appointment')} className="btn-primary">Book Now</button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => (
            <div key={appt.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{appt.type}</span>
                  <StatusBadge status={appt.status} />
                </div>
                <div className="text-sm text-slate-600">{appt.doctor} · {appt.specialty}</div>
                <div className="text-sm text-slate-400 mt-1 flex items-center gap-3">
                  <span>📅 {new Date(appt.date).toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'long' })}</span>
                  <span>🕐 {appt.time}</span>
                  <span>📍 {appt.location}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {appt.status === 'upcoming' && (
                  <button className="btn-outline text-sm py-2 px-4 text-red-500 border-red-200 hover:bg-red-50">
                    Cancel
                  </button>
                )}
                {appt.status === 'completed' && (
                  <button className="btn-secondary text-sm py-2 px-4">
                    Rebook
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
