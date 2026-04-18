import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR:  'doctor',
  ADMIN:   'admin',
  HR:      'hr',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined') {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login.php', { email, password });
      
      const { token, user: userData } = response.data;
      if (!userData) throw new Error('User data missing from response');
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      
      // MOCK MODE FALLBACK
      // If the backend is unreachable (network error or 500 error), use local demo accounts
      if (!error.response || error.response.status >= 500 || error.response.status === 404 || error.code === 'ERR_NETWORK') {
        const existingMocks = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const customMock = existingMocks.find(u => u.email === email && u.password === password);
        
        if (customMock) {
          console.warn(`[MOCK MODE] Logging in as custom registered mock user: ${customMock.email}`);
          const { password: _, ...userToSave } = customMock;
          
          localStorage.setItem('token', 'mock-offline-token-' + customMock.id);
          localStorage.setItem('user', JSON.stringify(userToSave));
          setUser(userToSave);
          return { success: true, user: userToSave };
        }

        let mockRole = null;
        if (email === 'admin@demo.com' && password === 'test') mockRole = ROLES.ADMIN;
        else if (email === 'doctor@demo.com' && password === 'test') mockRole = ROLES.DOCTOR;
        else if (email === 'patient@demo.com' && password === 'test') mockRole = ROLES.PATIENT;

        if (mockRole) {
          console.warn(`[MOCK MODE] Logging in as ${mockRole} due to backend unavailability.`);
          const mockUser = {
            id: email === 'doctor@demo.com' ? 1 : (email === 'patient@demo.com' ? 3 : 99),
            name: mockRole === ROLES.ADMIN ? 'System Admin' : (mockRole === ROLES.DOCTOR ? 'Dr. Sarah Jenkins' : 'Michael Scott'),
            email,
            role: mockRole,
            status: 'active'
          };
          const mockToken = 'mock-offline-token-12345';
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          return { success: true, user: mockUser };
        }
      }

      return { 
        success: false, 
        message: error.response?.data?.error || 'Invalid credentials' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
