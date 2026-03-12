import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiArrowRight, FiFilter } from 'react-icons/fi';
import { ALL_PATIENTS } from '../../data/mockData';
import { StatusBadge, PageHeader } from '../../components/ui/index';

export default function Patients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = ALL_PATIENTS.filter(p => {
    const ms = filter === 'all' || p.status === filter;
    const mq = p.name.toLowerCase().includes(search.toLowerCase()) ||
               p.condition.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader title="My Patients" subtitle={`${ALL_PATIENTS.length} patients total`} />

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input className="input pl-10 text-sm py-2.5" placeholder="Search by name or condition..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards (mobile-friendly) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(patient => (
          <div
            key={patient.id}
            onClick={() => navigate(`/doctor/patient-details/${patient.id}`)}
            className="card-hover p-5 flex flex-col gap-3"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
                {patient.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate">{patient.name}</div>
                <div className="text-xs text-slate-500">{patient.age} yrs · {patient.gender || 'N/A'}</div>
              </div>
              <StatusBadge status={patient.status} />
            </div>
            {/* Details */}
            <div className="space-y-1.5">
              <div className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="text-slate-400">🩺</span> {patient.condition}
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-1.5">
                <span>📅</span> Last: {new Date(patient.lastVisit).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-1.5">
                <span>📞</span> {patient.phone}
              </div>
            </div>
            <div className="flex items-center justify-end text-primary-600 text-sm font-semibold">
              View Details <FiArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
