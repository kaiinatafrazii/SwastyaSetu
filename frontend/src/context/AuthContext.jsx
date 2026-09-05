import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial user from localStorage
    try {
      const storedUser = localStorage.getItem('swasthyasetu_user');
      const token = localStorage.getItem('swasthyasetu_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        // Verify token in background
        api.getMe()
          .then(res => {
            if (res.user) {
              setUser(res.user);
              localStorage.setItem('swasthyasetu_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            // Keep stored user if offline
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
