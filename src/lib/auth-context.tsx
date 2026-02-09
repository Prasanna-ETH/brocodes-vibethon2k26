import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'citizen' | 'admin') => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('resq-user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = useCallback((email: string, _password: string, role: 'citizen' | 'admin') => {
    const u: User = {
      id: crypto.randomUUID(),
      name: role === 'admin' ? 'Commander Admin' : email.split('@')[0],
      email,
      role,
    };
    setUser(u);
    localStorage.setItem('resq-user', JSON.stringify(u));
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string) => {
    const u: User = { id: crypto.randomUUID(), name, email, role: 'citizen' };
    setUser(u);
    localStorage.setItem('resq-user', JSON.stringify(u));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('resq-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
