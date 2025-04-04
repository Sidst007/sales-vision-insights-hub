
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// User roles enum
export enum UserRole {
  TSM = "Territory Sales Manager",
  ASE = "Area Sales Executive",
  DSR = "Distributor Sales Representative",
  KAM = "Key Account Manager",
  RSO = "Retail Sales Officer",
  ADMIN = "Administrator"
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  region?: string;
  territory?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for the demo
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "tsm@example.com",
    role: UserRole.TSM,
    avatar: "https://i.pravatar.cc/300?img=1",
    region: "North",
    territory: "Delhi-NCR"
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "ase@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=2",
    region: "South",
    territory: "Bangalore"
  },
  {
    id: "3",
    name: "Ravi Kumar",
    email: "dsr@example.com",
    role: UserRole.DSR,
    avatar: "https://i.pravatar.cc/300?img=3",
    region: "West",
    territory: "Mumbai"
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "kam@example.com",
    role: UserRole.KAM,
    avatar: "https://i.pravatar.cc/300?img=4",
    region: "East",
    territory: "Kolkata"
  },
  {
    id: "5",
    name: "Aarav Patel",
    email: "rso@example.com",
    role: UserRole.RSO,
    avatar: "https://i.pravatar.cc/300?img=5",
    region: "Central",
    territory: "Nagpur"
  },
  {
    id: "6",
    name: "Admin User",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    avatar: "https://i.pravatar.cc/300?img=8",
    region: "All",
    territory: "All"
  }
];

// Auth context provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - simulates authentication
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = SAMPLE_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError((err as Error).message);
      toast.error('Login failed: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
