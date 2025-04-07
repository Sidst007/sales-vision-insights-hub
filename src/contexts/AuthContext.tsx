
import React, { createContext, useState, useContext } from 'react';

export enum UserRole {
  ADMIN = 'Admin',
  TSM = 'TSM',
  KAM = 'KAM',
  ASE = 'ASE',
  ASM = 'ASM',
  SR = 'SR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  managerId?: string;
  performance?: number;
  isDottedLine?: boolean;
  // Additional properties
  phone?: string;
  address?: string;
  region?: string;
  territory?: string;
  target?: number;
  manager?: string;
  joined?: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  updateUserProfile?: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const value: AuthContextProps = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
