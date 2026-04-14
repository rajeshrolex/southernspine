import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user || {});

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    // In a real app: await api.post('/api/user/update.php', form);
    setEditing(false);
    toast.success('Profile updated successfully (simulated)!');
  };

  const Field = ({ label, icon: Ic, value, field, type = 'text' }) => (
    <div>
      <label className="label flex items-center gap-1.5"><Ic className="w-4 h-4 text-slate-400" /> {label}</label>
      {editing ? (
        <input
          type={type}
          value={form[field] || ''}
          onChange={e => update(field, e.target.value)}
          className="input"
        />
      ) : (
        <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium border border-slate-100">{value || '—'}</div>
      )}
    </div>
  );

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <PageHeader
        title="My Profile"
        action={
          editing ? (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn-outline py-2 px-4">
                <FiX className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleSave} className="btn-success py-2 px-4">
                <FiSave className="w-4 h-4" /> Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-secondary py-2 px-4">
              <FiEdit2 className="w-4 h-4" /> Edit Profile
            </button>
          )
        }
      />

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 uppercase">
          {(form.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{form.name}</h3>
          <p className="text-slate-500">{form.email}</p>
          <span className="badge-blue mt-2 inline-block uppercase text-xs">{user.role}</span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card p-6 space-y-5">
        <h3 className="section-title border-b border-slate-100 pb-3">Personal Information</h3>
        <Field label="Full Name"      icon={FiUser}     value={form.name}      field="name"    />
        <Field label="Email Address"  icon={FiMail}     value={form.email}     field="email"   type="email" />
        <Field label="Phone Number"   icon={FiPhone}    value={form.phone}     field="phone"   type="tel" />
        <Field label="Date of Birth"  icon={FiCalendar} value={form.dob}       field="dob"     type="date" />
      </div>

      {/* Security */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title border-b border-slate-100 pb-3">Account Actions</h3>
        <button className="btn-outline w-full" onClick={() => toast.error('Change password module coming soon')}>Change Password</button>
        <button className="btn-outline w-full text-red-500 border-red-200 hover:bg-red-50" onClick={() => toast.error('Please contact admin to delete account')}>Delete Account</button>
      </div>
    </div>
  );
}
