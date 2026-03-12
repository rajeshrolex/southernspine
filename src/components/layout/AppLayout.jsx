import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES = {
  '/patient/dashboard':         { title: 'My Dashboard',       subtitle: "Welcome back! Here's your health overview." },
  '/patient/book-appointment':  { title: 'Book Appointment',   subtitle: 'Schedule a visit with our specialists.'     },
  '/patient/appointments':      { title: 'My Appointments',    subtitle: 'View and manage your sessions.'             },
  '/patient/reports':           { title: 'Medical Reports',    subtitle: 'Your health records and test results.'      },
  '/patient/profile':           { title: 'My Profile',         subtitle: 'Manage your personal information.'          },
  '/doctor/dashboard':          { title: 'Doctor Dashboard',   subtitle: "Today's schedule and patient overview."     },
  '/doctor/appointments':       { title: 'Appointments',       subtitle: 'Manage your appointment schedule.'          },
  '/doctor/patients':           { title: 'My Patients',        subtitle: 'View and manage your patient list.'         },
  '/doctor/upload-report':      { title: 'Upload Report',      subtitle: 'Add reports and documents for patients.'    },
  '/admin/dashboard':           { title: 'Admin Dashboard',    subtitle: 'Overview of clinic operations.'             },
  '/admin/clinics':             { title: 'Clinics',            subtitle: 'Manage clinic locations.'                   },
  '/admin/doctors':             { title: 'Doctors',            subtitle: 'Manage medical staff.'                      },
  '/admin/patients':            { title: 'All Patients',       subtitle: 'Manage patient records.'                    },
  '/admin/analytics':           { title: 'Analytics',          subtitle: 'Revenue and performance insights.'          },
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { title, subtitle } = PAGE_TITLES[location.pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
