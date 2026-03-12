import React from 'react';
import { FiLoader } from 'react-icons/fi';

export function StatsCard({ icon: Icon, label, value, change, color = 'blue', onClick }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700'   },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  badge: 'bg-green-100 text-green-700'  },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700'},
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700'},
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    badge: 'bg-red-100 text-red-700'      },
    teal:   { bg: 'bg-teal-50',   icon: 'text-teal-600',   badge: 'bg-teal-100 text-teal-700'    },
  };
  const c = colors[color] || colors.blue;

  return (
    <div
      onClick={onClick}
      className={`card p-4 sm:p-6 ${onClick ? 'cursor-pointer hover:shadow-soft transition-all duration-200 hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          {Icon && <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${c.icon}`} />}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-lg ${c.badge} flex-shrink-0 ml-1`}>{change}</span>
        )}
      </div>
      <div className="mt-3 sm:mt-4">
        <div className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight truncate">{value}</div>
        <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 leading-tight">{label}</div>
      </div>
    </div>
  );
}

export function Badge({ children, color = 'blue' }) {
  const classes = {
    blue:   'badge-blue',
    green:  'badge-green',
    orange: 'badge-orange',
    red:    'badge-red',
    gray:   'badge-gray',
    purple: 'badge-purple',
  };
  return <span className={classes[color] || 'badge-gray'}>{children}</span>;
}

export function StatusBadge({ status }) {
  const map = {
    upcoming:    { color: 'blue',   label: 'Upcoming'     },
    completed:   { color: 'green',  label: 'Completed'    },
    cancelled:   { color: 'red',    label: 'Cancelled'    },
    'in-progress': { color: 'orange', label: 'In Progress' },
    active:      { color: 'green',  label: 'Active'       },
    inactive:    { color: 'gray',   label: 'Inactive'     },
    pending:     { color: 'orange', label: 'Pending'      },
  };
  const { color, label } = map[status] || { color: 'gray', label: status };
  return <Badge color={color}>{label}</Badge>;
}

export function Avatar({ name, initials, color = 'bg-primary-500', size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials || (name ? name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U')}
    </div>
  );
}

export function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse-soft bg-slate-200 rounded-lg h-4" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 animate-pulse-soft space-y-4">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
          <div className="h-8 bg-slate-200 rounded-lg w-1/2" />
          <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <FiLoader className={`${sizes[size]} animate-spin text-primary-600`} />;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl animate-fade-in-up`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Divider({ label }) {
  if (!label) return <hr className="border-slate-100 my-4" />;
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
      <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-slate-500">{label}</span></div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 sm:mb-6">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
