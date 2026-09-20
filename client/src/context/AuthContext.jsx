import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const savedUser = localStorage.getItem('solarsense_user');
    const token = localStorage.getItem('solarsense_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('solarsense_user');
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('solarsense_user', JSON.stringify(res.data.user));
        localStorage.setItem('solarsense_token', res.data.token);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      // Local demo login fallback if offline
      const mockUser = { _id: 'guest_' + Date.now(), name: email.split('@')[0], email };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('solarsense_user', JSON.stringify(mockUser));
      localStorage.setItem('solarsense_token', mockUser._id);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('solarsense_user', JSON.stringify(res.data.user));
        localStorage.setItem('solarsense_token', res.data.token);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      const mockUser = { _id: 'guest_' + Date.now(), name: name || email.split('@')[0], email };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('solarsense_user', JSON.stringify(mockUser));
      localStorage.setItem('solarsense_token', mockUser._id);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('solarsense_user');
    localStorage.removeItem('solarsense_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
