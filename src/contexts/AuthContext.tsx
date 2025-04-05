
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
  phone?: string;
  address?: string;
  joined?: string;
  target?: number;
  performance?: number;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  updateUserProfile: (updatedInfo: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for the demo with Indian names
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "tsm@example.com",
    role: UserRole.TSM,
    avatar: "https://i.pravatar.cc/300?img=11",
    region: "North",
    territory: "Delhi-NCR",
    phone: "+91 9876543210",
    address: "42 Rajouri Garden, New Delhi",
    joined: "2022-05-15",
    target: 500000,
    performance: 93
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "ase@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=5",
    region: "South",
    territory: "Bangalore",
    phone: "+91 8765432109",
    address: "78 Indiranagar, Bangalore",
    joined: "2022-08-22",
    target: 350000,
    performance: 105
  },
  {
    id: "3",
    name: "Vikram Patel",
    email: "dsr@example.com",
    role: UserRole.DSR,
    avatar: "https://i.pravatar.cc/300?img=3",
    region: "West",
    territory: "Mumbai",
    phone: "+91 7654321098",
    address: "23 Bandra West, Mumbai",
    joined: "2023-01-10",
    target: 250000,
    performance: 87
  },
  {
    id: "4",
    name: "Sunita Reddy",
    email: "kam@example.com",
    role: UserRole.KAM,
    avatar: "https://i.pravatar.cc/300?img=9",
    region: "East",
    territory: "Kolkata",
    phone: "+91 6543210987",
    address: "56 Salt Lake City, Kolkata",
    joined: "2022-11-05",
    target: 600000,
    performance: 96
  },
  {
    id: "5",
    name: "Arjun Singh",
    email: "rso@example.com",
    role: UserRole.RSO,
    avatar: "https://i.pravatar.cc/300?img=7",
    region: "Central",
    territory: "Nagpur",
    phone: "+91 5432109876",
    address: "12 Civil Lines, Nagpur",
    joined: "2023-03-20",
    target: 200000,
    performance: 82
  },
  {
    id: "6",
    name: "Meera Joshi",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    avatar: "https://i.pravatar.cc/300?img=8",
    region: "All",
    territory: "All",
    phone: "+91 9876543211",
    address: "Corporate HQ, Mumbai",
    joined: "2022-01-15",
    target: 1000000,
    performance: 100
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

  // Update user profile
  const updateUserProfile = (updatedInfo: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedInfo };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

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
    error,
    updateUserProfile
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
