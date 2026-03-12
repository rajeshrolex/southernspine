// Auth Context – provides role-based auth simulation
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR:  'doctor',
  ADMIN:   'admin',
};

const DEMO_USERS = {
  patient: { id: 'U001', name: 'Anna Sample',     email: 'patient@demo.com', role: 'patient', initials: 'AS', color: 'bg-blue-500' },
  doctor:  { id: 'D001', name: 'Dr. Sarah Mitchell', email: 'doctor@demo.com',  role: 'doctor',  initials: 'SM', color: 'bg-teal-500' },
  admin:   { id: 'A001', name: 'Admin User',       email: 'admin@demo.com',   role: 'admin',   initials: 'AU', color: 'bg-purple-500' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role) => {
    setUser(DEMO_USERS[role]);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
