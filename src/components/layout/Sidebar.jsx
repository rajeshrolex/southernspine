import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiCalendar, FiUser, FiFileText,
  FiUsers, FiUpload, FiBarChart2, FiMapPin,
  FiLogOut, FiHeart, FiX
} from 'react-icons/fi';

const PATIENT_NAV = [
  { to: '/patient/dashboard',        icon: FiGrid,     label: 'Dashboard'        },
  { to: '/patient/book-appointment', icon: FiCalendar, label: 'Book Appointment' },
  { to: '/patient/appointments',     icon: FiCalendar, label: 'My Appointments'  },
  { to: '/patient/reports',          icon: FiFileText, label: 'My Reports'       },
  { to: '/patient/profile',          icon: FiUser,     label: 'Profile'          },
];
const DOCTOR_NAV = [
  { to: '/doctor/dashboard',     icon: FiGrid,     label: 'Dashboard'      },
  { to: '/doctor/appointments',  icon: FiCalendar, label: 'Appointments'   },
  { to: '/doctor/patients',      icon: FiUsers,    label: 'My Patients'    },
  { to: '/doctor/upload-report', icon: FiUpload,   label: 'Upload Report'  },
];
const ADMIN_NAV = [
  { to: '/admin/dashboard', icon: FiGrid,      label: 'Dashboard'  },
  { to: '/admin/clinics',   icon: FiMapPin,    label: 'Clinics'    },
  { to: '/admin/doctors',   icon: FiUser,      label: 'Doctors'    },
  { to: '/admin/patients',  icon: FiUsers,     label: 'Patients'   },
  { to: '/admin/analytics', icon: FiBarChart2, label: 'Analytics'  },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer on route change (mobile)
  useEffect(() => { onClose(); }, [location.pathname]);

  const navItems =
    user?.role === 'patient' ? PATIENT_NAV :
    user?.role === 'doctor'  ? DOCTOR_NAV  : ADMIN_NAV;

  const roleLabel =
    user?.role === 'patient' ? 'Patient Portal' :
    user?.role === 'doctor'  ? 'Doctor Portal'  : 'Admin Panel';

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <FiHeart className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-slate-900 leading-tight">Southern Spine</div>
          <div className="text-xs text-slate-500">{roleLabel}</div>
        </div>
        {/* Close button – mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close menu"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-3 mb-1">
          <div className={`w-9 h-9 rounded-full ${user?.color || 'bg-primary-500'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {user?.initials || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{user?.name}</div>
            <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-slate-100 shadow-sm" style={{ minHeight: '100vh' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
