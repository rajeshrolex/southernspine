import React, { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { DOCTORS } from '../../data/mockData';
import { PageHeader, Modal, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function Doctors() {
  const [doctors, setDoctors] = useState(DOCTORS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '', experience: '' });

  const handleAdd = () => {
    if (!form.name || !form.specialty) { toast.error('Fill required fields'); return; }
    const initials = form.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
    setDoctors(d => [...d, { id: Date.now(), ...form, initials, color: 'bg-indigo-500', rating: 4.5, available: true, bio: '' }]);
    setModalOpen(false);
    setForm({ name: '', specialty: '', experience: '' });
    toast.success('Doctor added!');
  };

  const handleDelete = (id) => { setDoctors(d => d.filter(x => x.id !== id)); toast.success('Removed'); };
  const toggleAvail = (id) => setDoctors(d => d.map(x => x.id === id ? {...x, available: !x.available} : x));

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} medical staff members`}
        action={<button onClick={() => setModalOpen(true)} className="btn-primary"><FiPlus className="w-4 h-4" /> Add Doctor</button>}
      />

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input className="input pl-12" placeholder="Search by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(doc => (
          <div key={doc.id} className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 ${doc.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                {doc.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                <p className="text-sm text-primary-600 font-semibold">{doc.specialty}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-amber-500 font-semibold"><FiStar className="w-3.5 h-3.5" />{doc.rating}</span>
              <span className="text-slate-500">{doc.experience}</span>
              <button
                onClick={() => toggleAvail(doc.id)}
                className={`badge ${doc.available ? 'badge-green cursor-pointer' : 'badge-red cursor-pointer'}`}
              >
                {doc.available ? 'Available' : 'Off Duty'}
              </button>
            </div>
            {doc.bio && <p className="text-xs text-slate-500 leading-relaxed">{doc.bio}</p>}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 text-sm font-semibold">
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
          <div>
            <label className="label">Full Name *</label>
            <input className="input" placeholder="Dr. First Last" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div>
            <label className="label">Specialty *</label>
            <select className="input" value={form.specialty} onChange={e => setForm(f=>({...f,specialty:e.target.value}))}>
              <option value="">Select specialty...</option>
              <option>Physiotherapy</option>
              <option>Chiropractic</option>
              <option>Sports Medicine</option>
              <option>Massage Therapy</option>
            </select>
          </div>
          <div>
            <label className="label">Experience</label>
            <input className="input" placeholder="e.g. 8 years" value={form.experience} onChange={e => setForm(f=>({...f,experience:e.target.value}))} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1">Add Doctor</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
