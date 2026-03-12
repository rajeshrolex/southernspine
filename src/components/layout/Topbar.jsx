import React from 'react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 z-30">
      {/* Hamburger – mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
        aria-label="Open menu"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate leading-tight">{title || 'Dashboard'}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 truncate hidden sm:block">{subtitle}</p>}
      </div>

      {/* Search – tablets+ */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-56">
        <FiSearch className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
        />
      </div>

      {/* Notification bell */}
      <button className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0">
        <FiBell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Avatar */}
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${user?.color || 'bg-primary-500'} flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0 cursor-pointer`}>
        {user?.initials || 'U'}
      </div>
    </header>
  );
}
