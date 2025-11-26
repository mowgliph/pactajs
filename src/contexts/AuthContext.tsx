
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, initializeDefaultUser } from '@/lib/storage';
import * as authLib from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (name: string, email: string, password: string) => User | null;
  isAuthenticated: boolean;
  hasPermission: (role: User['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDefaultUser();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): User | null => {
    const loggedInUser = authLib.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = (): void => {
    authLib.logout();
    setUser(null);
  };

  const register = (name: string, email: string, password: string): User | null => {
    return authLib.register(name, email, password);
  };

  const hasPermission = (role: User['role']): boolean => {
    return authLib.hasPermission(role);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: user !== null,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
