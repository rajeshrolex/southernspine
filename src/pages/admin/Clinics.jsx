import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import { PageHeader, Modal, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await api.get('/api/clinics/list.php');
      setClinics(response.data);
    } catch (error) {
      toast.error('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    toast.error('Direct clinic creation is currently disabled for security');
  };

  const handleDelete = (id) => {
    toast.error('Contact regional administrator to remove clinic locations');
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading clinic locations...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        subtitle={`${clinics.length} clinic locations`}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <FiPlus className="w-4 h-4" /> Add Clinic
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clinics.length === 0 && <p className="col-span-full py-20 text-center text-slate-400">No clinics found</p>}
        {clinics.map(clinic => (
          <div key={clinic.id} className="card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-primary-600" />
              </div>
              <StatusBadge status={clinic.status || 'active'} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{clinic.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{clinic.address}</p>
            </div>
            <div className="flex gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1"><FiUsers className="w-3.5 h-3.5 text-slate-400" />{clinic.doctor_count || 0} Doctors</span>
              <span className="flex items-center gap-1"><FiUsers className="w-3.5 h-3.5 text-slate-400" />{clinic.patient_count || 0} Patients</span>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1.5">
              <FiPhone className="w-3.5 h-3.5 text-slate-400" />{clinic.phone || 'N/A'}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 text-sm font-semibold transition-colors" onClick={() => toast.error('Edit modal under development')}>
                <FiEdit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(clinic.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold transition-colors">
                <FiTrash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Clinic">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 bg-blue-50 p-3 rounded-xl border border-blue-100">⚠️ New clinic registration requires regional verification.</p>
          <div className="flex gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1">Submit Request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
