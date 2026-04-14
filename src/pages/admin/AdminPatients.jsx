import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiUserPlus, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import { PageHeader, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/api/patients/list.php');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to load patient database');
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter(p => {
    const ms = filter === 'all' || p.status === filter;
    const mq = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
               (p.email || '').toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading patient records...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        subtitle={`${patients.length} registered patients`}
        action={
          <div className="flex gap-2">
            <button onClick={() => toast.success('Exporting database...')} className="btn-outline text-sm py-2.5 px-4"><FiDownload className="w-4 h-4" /> Export</button>
            <button onClick={() => toast.error('Creation module is restricted')} className="btn-primary text-sm py-2.5 px-4"><FiUserPlus className="w-4 h-4" /> Add Patient</button>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input className="input pl-10 py-2.5 text-sm" placeholder="Search patient name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
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
                <th className="table-header">Status</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400">No records found</td>
                </tr>
              )}
              {visible.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 uppercase">
                        {(p.name || 'P').split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><StatusBadge status={p.status || 'active'} /></td>
                  <td className="table-cell text-slate-500 text-sm">
                    {new Date(p.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}
                  </td>
                  <td className="table-cell">
                    <button onClick={() => toast.success(`Accessing profile for ${p.name}`)} className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors">
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
              <button disabled={page===pages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
