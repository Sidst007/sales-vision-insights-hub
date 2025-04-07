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
  isDottedLine?: boolean;  // Add this line to include the optional isDottedLine property
}

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextProps = {
    user,
    login,
    logout,
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
