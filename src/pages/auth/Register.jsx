import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHeart, FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', gender: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    login('patient');
    toast.success('Account created! Welcome to Southern Spine.');
    navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
              <FiHeart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500">Join Southern Spine – takes less than 2 minutes</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8 px-4">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-primary-600' : step > s ? 'text-green-600' : 'text-slate-400'}`}>
                <div className={step > s ? 'step-done' : step === s ? 'step-active' : 'step-inactive'}>
                  {step > s ? '✓' : s}
                </div>
                <span className="text-sm font-semibold hidden sm:block">
                  {s === 1 ? 'Personal Info' : 'Account Setup'}
                </span>
              </div>
              {s < 2 && <div className="flex-1 h-0.5 bg-slate-200" />}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <label className="label-lg">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input className="input pl-12" placeholder="e.g. Anna Sample" value={form.name} onChange={e => update('name', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="label-lg">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input className="input pl-12" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="label-lg">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input className="input pl-12" type="tel" placeholder="+61 400 000 000" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-lg">Date of Birth</label>
                    <input className="input" type="date" value={form.dob} onChange={e => update('dob', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-lg">Gender</label>
                    <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-4 text-lg">
                  Continue <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <label className="label-lg">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input className="input pl-12" type="password" placeholder="Create a strong password" value={form.password} onChange={e => update('password', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="label-lg">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input className="input pl-12" type="password" placeholder="Repeat your password" required />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-100">
                  <strong>👋 Almost done!</strong><br />
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 py-4">
                    <FiArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-4 text-lg">
                    Create Account <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
