import React, { useState } from 'react';
import { FiCalendar, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { DOCTOR_TODAY_APPOINTMENTS } from '../../data/mockData';
import { StatusBadge, PageHeader } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(DOCTOR_TODAY_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const markComplete = (id) => {
    setAppointments(a => a.map(x => x.id === id ? { ...x, status: 'completed' } : x));
    toast.success('Marked as completed');
  };

  const filtered = appointments.filter(a => {
    const ms = filter === 'all' || a.status === filter;
    const mq = a.patient.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader title="Today's Appointments" subtitle={`${appointments.length} appointments scheduled`} />

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input className="input pl-10 py-2.5 text-sm" placeholder="Search patient or type..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'upcoming', 'in-progress', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Time</th>
                <th className="table-header">Patient</th>
                <th className="table-header">Age</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="table-row">
                  <td className="table-cell font-bold text-slate-900">{a.time}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                        {a.patient.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{a.patient}</span>
                    </div>
                  </td>
                  <td className="table-cell text-slate-600">{a.age}</td>
                  <td className="table-cell">{a.type}</td>
                  <td className="table-cell"><StatusBadge status={a.status} /></td>
                  <td className="table-cell">
                    {a.status !== 'completed' && (
                      <button
                        onClick={() => markComplete(a.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                      >
                        <FiCheck className="w-3.5 h-3.5" /> Complete
                      </button>
                    )}
                    {a.status === 'completed' && (
                      <span className="text-xs text-slate-400">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
