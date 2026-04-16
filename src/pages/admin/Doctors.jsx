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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    specialty: '', 
    experience: '', 
    password: '' 
  });

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
    setIsEditing(false);
    setSelectedId(null);
    setForm({ name: '', email: '', phone: '', specialty: '', experience: '', password: '' });
    setModalOpen(true);
  };

  const handleEdit = (doc) => {
    setIsEditing(true);
    setSelectedId(doc.id);
    setForm({
      name: doc.name || '',
      email: doc.email || '',
      phone: doc.phone || '',
      specialty: doc.specialty || '',
      experience: doc.experience || '',
      password: '' // Don't show password on edit
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch('/api/admin/doctors_manage.php', { ...form, id: selectedId });
        toast.success('Doctor updated successfully');
      } else {
        await api.post('/api/admin/doctors_manage.php', form);
        toast.success('Doctor added successfully');
      }
      setModalOpen(false);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medical staff member?')) return;
    try {
      await api.delete(`/api/admin/doctors_manage.php?id=${id}`);
      toast.success('Doctor removed');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to remove doctor');
    }
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
        action={<button onClick={handleAdd} className="btn-primary"><FiPlus className="w-4 h-4" /> Add Doctor</button>}
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
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 text-sm font-semibold" onClick={() => handleEdit(doc)}>
                <FiEdit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(doc.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold">
                <FiTrash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Profile' : 'Add New Doctor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="e.g. Dr. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="label">Specialty</label>
              <input className="input" placeholder="e.g. Cardiologist" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} required />
            </div>
            <div>
              <label className="label">Experience</label>
              <input className="input" placeholder="e.g. 12+ years" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input" placeholder="Contact number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="doctor@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            {!isEditing && (
              <div className="md:col-span-2">
                <label className="label">Temporary Password</label>
                <input className="input" type="password" placeholder="Default: test1234" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{isEditing ? 'Save Changes' : 'Create Account'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
