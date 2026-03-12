import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHeart, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DEMO_ROLES = [
  { role: 'patient', label: 'Patient', color: 'bg-blue-500',   ring: 'ring-blue-400',   desc: 'Book appointments & view reports' },
  { role: 'doctor',  label: 'Doctor',  color: 'bg-teal-500',   ring: 'ring-teal-400',   desc: 'Manage patients & schedule' },
  { role: 'admin',   label: 'Admin',   color: 'bg-purple-500', ring: 'ring-purple-400', desc: 'Full clinic management' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole);
    toast.success('Welcome back!');
    if (selectedRole === 'patient') navigate('/patient/dashboard');
    else if (selectedRole === 'doctor') navigate('/doctor/dashboard');
    else navigate('/admin/dashboard');
  };

  const handleQuickDemo = (role) => {
    login(role);
    toast.success(`Logged in as ${role}`);
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FiHeart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Southern Spine</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Your health journey<br />starts here
            </h2>
            <p className="text-primary-200 text-lg leading-relaxed">
              Expert physiotherapy and chiropractic care, tailored for you. Book, track, and manage your wellness effortlessly.
            </p>
          </div>
        </div>
        <div className="relative space-y-4">
          {[
            '✓  Book appointments in under 2 minutes',
            '✓  View your medical reports online',
            '✓  Get reminders for upcoming sessions',
          ].map(t => (
            <div key={t} className="text-primary-100 font-medium">{t}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <FiHeart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Southern Spine</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Sign in to your account to continue</p>
          </div>

          {/* Quick demo buttons */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-500 text-center mb-3">Quick Demo – Select a role</p>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ROLES.map(r => (
                <button
                  key={r.role}
                  onClick={() => handleQuickDemo(r.role)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                    selectedRole === r.role
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 ${r.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {r.label[0]}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{r.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">Click a role to instantly demo the portal</p>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-lg">Email Address</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-12"
                />
              </div>
            </div>
            <div>
              <label className="label-lg">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-12"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Sign In <FiArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New patient?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
