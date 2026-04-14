import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import api from '../../services/api';
import { PageHeader, Modal, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '', experience: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/api/doctors/list.php');
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    toast.error('Direct staff registration requires HR authorization');
  };

  const handleDelete = (id) => {
    toast.error('Please contact system administrator to remove medical staff');
  };

  const filtered = doctors.filter(d =>
    (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-500">Loading medical staff...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        subtitle={`${doctors.length} medical staff members`}
        action={<button onClick={() => setModalOpen(true)} className="btn-primary"><FiPlus className="w-4 h-4" /> Add Doctor</button>}
      />

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input className="input pl-12" placeholder="Search by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 && <p className="col-span-full py-20 text-center text-slate-400">No doctors found</p>}
        {filtered.map(doc => (
          <div key={doc.id} className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 uppercase`}>
                {(doc.name || 'D').split(' ').map(n=>n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                <p className="text-sm text-primary-600 font-semibold">{doc.specialty || 'General Practitioner'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-amber-500 font-semibold"><FiStar className="w-3.5 h-3.5" /> 4.9</span>
              <span className="text-slate-500">{doc.experience || '8+ years'}</span>
              <StatusBadge status={doc.available === false ? 'inactive' : 'active'} />
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 text-sm font-semibold" onClick={() => toast.error('Editing disabled for demo')}>
                <FiEdit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(doc.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold">
                <FiTrash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Doctor">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 bg-blue-50 p-3 rounded-xl border border-blue-100">Staff accounts must be provisioned via HR portal.</p>
          <div className="flex gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1">Open HR Portal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
