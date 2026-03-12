import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { CLINICS } from '../../data/mockData';
import { PageHeader, Modal, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function Clinics() {
  const [clinics, setClinics] = useState(CLINICS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  const handleAdd = () => {
    if (!form.name || !form.address) { toast.error('Fill required fields'); return; }
    setClinics(c => [...c, { id: Date.now(), ...form, doctors: 0, patients: 0, status: 'active' }]);
    setModalOpen(false);
    setForm({ name: '', address: '', phone: '' });
    toast.success('Clinic added!');
  };

  const handleDelete = (id) => {
    setClinics(c => c.filter(x => x.id !== id));
    toast.success('Clinic removed');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Clinics"
        subtitle={`${clinics.length} clinic locations`}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <FiPlus className="w-4 h-4" /> Add Clinic
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clinics.map(clinic => (
          <div key={clinic.id} className="card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-primary-600" />
              </div>
              <StatusBadge status={clinic.status} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{clinic.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{clinic.address}</p>
            </div>
            <div className="flex gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1"><FiUsers className="w-3.5 h-3.5 text-slate-400" />{clinic.doctors} Doctors</span>
              <span className="flex items-center gap-1"><FiUsers className="w-3.5 h-3.5 text-slate-400" />{clinic.patients} Patients</span>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1.5">
              <FiPhone className="w-3.5 h-3.5 text-slate-400" />{clinic.phone}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 text-sm font-semibold transition-colors">
                <FiEdit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(clinic.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold transition-colors">
                <FiTrash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Clinic">
        <div className="space-y-4">
          <div>
            <label className="label">Clinic Name *</label>
            <input className="input" placeholder="e.g. Southern Spine – East" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div>
            <label className="label">Address *</label>
            <input className="input" placeholder="Street, Suburb, State Postcode" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="+61 3 9000 0000" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1">Add Clinic</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
