import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { FiHeart, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const savedUser = result.user;
      toast.success('Welcome back!');
      
      if (savedUser.role === ROLES.PATIENT) navigate('/patient/dashboard');
      else if (savedUser.role === ROLES.DOCTOR) navigate('/doctor/dashboard');
      else navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
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

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                {error}
              </div>
            )}
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
                  autoComplete="email"
                  required
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
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'} <FiArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New patient?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create an account</Link>
          </p>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white rounded border border-slate-100">
                <p className="font-semibold text-blue-600">Patient</p>
                <p>patient@demo.com</p>
                <p className="font-mono">test</p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <p className="font-semibold text-teal-600">Doctor</p>
                <p>doctor@demo.com</p>
                <p className="font-mono">test</p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100 col-span-2 mt-2">
                <p className="font-semibold text-purple-600 underline">Admin</p>
                <p>admin@demo.com</p>
                <p className="font-mono">test</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
