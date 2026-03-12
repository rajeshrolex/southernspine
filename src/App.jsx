import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Auth pages
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Components
import ScrollToTop from './components/common/ScrollToTop';

// Patient pages
import PatientDashboard  from './pages/patient/PatientDashboard';
import Appointments      from './pages/patient/Appointments';
import BookAppointment   from './pages/patient/BookAppointment';
import Reports           from './pages/patient/Reports';
import Profile           from './pages/patient/Profile';

// Doctor pages
import DoctorDashboard    from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import Patients           from './pages/doctor/Patients';
import PatientDetails     from './pages/doctor/PatientDetails';
import UploadReport       from './pages/doctor/UploadReport';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Clinics        from './pages/admin/Clinics';
import Doctors        from './pages/admin/Doctors';
import AdminPatients  from './pages/admin/AdminPatients';
import Analytics      from './pages/admin/Analytics';

/** Route guard – redirects to /login if not authenticated */
function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to the user's own home
    if (user.role === 'patient') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'doctor')  return <Navigate to="/doctor/dashboard"  replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e293b',
            color:       '#f8fafc',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#f8fafc' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
        }}
      />

      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={user.role === 'patient' ? '/patient/dashboard' : user.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index                 element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard"        element={<PatientDashboard />} />
          <Route path="appointments"     element={<Appointments />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="reports"          element={<Reports />} />
          <Route path="profile"          element={<Profile />} />
        </Route>

        {/* Doctor routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index                    element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard"         element={<DoctorDashboard />} />
          <Route path="appointments"      element={<DoctorAppointments />} />
          <Route path="patients"          element={<Patients />} />
          <Route path="patient-details/:id" element={<PatientDetails />} />
          <Route path="upload-report"     element={<UploadReport />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index             element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="clinics"    element={<Clinics />} />
          <Route path="doctors"    element={<Doctors />} />
          <Route path="patients"   element={<AdminPatients />} />
          <Route path="analytics"  element={<Analytics />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
