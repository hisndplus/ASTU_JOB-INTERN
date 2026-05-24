import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signIn, signOut, signUp, updateUser, User, UserRole } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const u = await signIn(email, password);
    setUser(u);
  }

  async function register(name: string, email: string, password: string, role: UserRole, company?: string) {
    const u = await signUp(name, email, password, role, company);
    setUser(u);
  }

  async function logout() {
    await signOut();
    setUser(null);
  }

  async function refreshUser() {
    const u = await getCurrentUser();
    setUser(u);
  }

  async function updateProfile(updates: Partial<User>) {
    const u = await updateUser(updates);
    setUser(u);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
