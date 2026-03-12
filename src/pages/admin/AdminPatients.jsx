import React, { useState } from 'react';
import { FiSearch, FiDownload, FiUserPlus, FiEye } from 'react-icons/fi';
import { ALL_PATIENTS } from '../../data/mockData';
import { PageHeader, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function AdminPatients() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = ALL_PATIENTS.filter(p => {
    const ms = filter === 'all' || p.status === filter;
    const mq = p.name.toLowerCase().includes(search.toLowerCase()) ||
               p.condition.toLowerCase().includes(search.toLowerCase()) ||
               p.doctor.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="All Patients"
        subtitle={`${ALL_PATIENTS.length} registered patients`}
        action={
          <div className="flex gap-2">
            <button onClick={() => toast.success('Export started')} className="btn-outline text-sm py-2.5 px-4"><FiDownload className="w-4 h-4" /> Export</button>
            <button onClick={() => toast.success('Add patient form coming soon')} className="btn-primary text-sm py-2.5 px-4"><FiUserPlus className="w-4 h-4" /> Add Patient</button>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input className="input pl-10 py-2.5 text-sm" placeholder="Search patient, condition, or doctor..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Patient</th>
                <th className="table-header">Age</th>
                <th className="table-header">Condition</th>
                <th className="table-header">Doctor</th>
                <th className="table-header">Last Visit</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                        {p.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{p.age}</td>
                  <td className="table-cell font-medium">{p.condition}</td>
                  <td className="table-cell text-slate-600 text-sm">{p.doctor}</td>
                  <td className="table-cell text-slate-500 text-sm">
                    {new Date(p.lastVisit).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}
                  </td>
                  <td className="table-cell"><StatusBadge status={p.status} /></td>
                  <td className="table-cell">
                    <button onClick={() => toast.success(`Viewing ${p.name}`)} className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors">
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
              {Array.from({length:pages},(_,i)=>i+1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-sm font-semibold ${n===page?'bg-primary-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{n}</button>
              ))}
              <button disabled={page===pages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
