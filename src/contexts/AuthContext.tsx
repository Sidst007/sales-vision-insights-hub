import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// User roles enum
export enum UserRole {
  TSM = "Territory Sales Manager",
  ASE = "Area Sales Executive",
  ASM = "Area Sales Manager",
  SR = "Sales Representative",
  KAM = "Key Account Manager",
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
  manager?: string;
  managerId?: string;
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
    id: "admin1",
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
  },
  
  {
    id: "tsm1",
    name: "Rajesh Kumar",
    email: "tsm1@example.com",
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
    id: "tsm2",
    name: "Anita Desai",
    email: "tsm2@example.com",
    role: UserRole.TSM,
    avatar: "https://i.pravatar.cc/300?img=1",
    region: "South",
    territory: "Bangalore",
    phone: "+91 9876543209",
    address: "15 Koramangala, Bangalore",
    joined: "2022-04-10",
    target: 550000,
    performance: 95,
  },
  
  {
    id: "ase1",
    name: "Priya Sharma",
    email: "ase1@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=5",
    region: "North",
    territory: "Delhi",
    phone: "+91 8765432109",
    address: "78 Indiranagar, Delhi",
    joined: "2022-08-22",
    target: 350000,
    performance: 105,
    manager: "Rajesh Kumar",
    managerId: "tsm1"
  },
  {
    id: "ase2",
    name: "Amit Patel",
    email: "ase2@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=12",
    region: "North",
    territory: "Gurgaon",
    phone: "+91 8765432108",
    address: "23 Sector 14, Gurgaon",
    joined: "2022-07-15",
    target: 340000,
    performance: 97,
    manager: "Rajesh Kumar",
    managerId: "tsm1"
  },
  {
    id: "ase3",
    name: "Neha Gupta",
    email: "ase3@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=2",
    region: "North",
    territory: "Noida",
    phone: "+91 8765432107",
    address: "45 Sector 18, Noida",
    joined: "2022-09-05",
    target: 330000,
    performance: 89,
    manager: "Rajesh Kumar",
    managerId: "tsm1"
  },
  {
    id: "ase4",
    name: "Vikram Malhotra",
    email: "ase4@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=13",
    region: "South",
    territory: "Bangalore City",
    phone: "+91 8765432106",
    address: "12 HSR Layout, Bangalore",
    joined: "2022-06-18",
    target: 360000,
    performance: 102,
    manager: "Anita Desai",
    managerId: "tsm2"
  },
  {
    id: "ase5",
    name: "Kavita Reddy",
    email: "ase5@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=3",
    region: "South",
    territory: "Mysore",
    phone: "+91 8765432105",
    address: "34 Jayalakshmipuram, Mysore",
    joined: "2022-10-12",
    target: 320000,
    performance: 94,
    manager: "Anita Desai",
    managerId: "tsm2"
  },
  {
    id: "ase6",
    name: "Deepak Nair",
    email: "ase6@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=14",
    region: "South",
    territory: "Chennai",
    phone: "+91 8765432104",
    address: "56 Adyar, Chennai",
    joined: "2022-11-20",
    target: 350000,
    performance: 91,
    manager: "Anita Desai",
    managerId: "tsm2"
  },
  
  {
    id: "asm1",
    name: "Ravi Verma",
    email: "asm1@example.com",
    role: UserRole.ASM,
    avatar: "https://i.pravatar.cc/300?img=15",
    region: "North",
    territory: "Delhi Central",
    phone: "+91 7654321098",
    address: "11 Connaught Place, Delhi",
    joined: "2022-06-10",
    target: 250000,
    performance: 96,
    manager: "Priya Sharma",
    managerId: "ase1"
  },
  {
    id: "asm2",
    name: "Sunita Singh",
    email: "asm2@example.com",
    role: UserRole.ASM,
    avatar: "https://i.pravatar.cc/300?img=4",
    region: "North",
    territory: "Delhi West",
    phone: "+91 7654321097",
    address: "22 Janakpuri, Delhi",
    joined: "2022-07-05",
    target: 240000,
    performance: 92,
    manager: "Priya Sharma",
    managerId: "ase1"
  },
  {
    id: "asm3",
    name: "Prakash Mehta",
    email: "asm3@example.com",
    role: UserRole.ASM,
    avatar: "https://i.pravatar.cc/300?img=16",
    region: "North",
    territory: "Gurgaon East",
    phone: "+91 7654321096",
    address: "33 Sector 45, Gurgaon",
    joined: "2022-08-15",
    target: 230000,
    performance: 88,
    manager: "Amit Patel",
    managerId: "ase2"
  },
  {
    id: "asm4",
    name: "Meena Khanna",
    email: "asm4@example.com",
    role: UserRole.ASM,
    avatar: "https://i.pravatar.cc/300?img=5",
    region: "North",
    territory: "Gurgaon West",
    phone: "+91 7654321095",
    address: "44 Sector 57, Gurgaon",
    joined: "2022-09-20",
    target: 220000,
    performance: 99,
    manager: "Amit Patel",
    managerId: "ase2"
  },
  {
    id: "asm5",
    name: "Ajay Mathur",
    email: "asm5@example.com",
    role: UserRole.ASM,
    avatar: "https://i.pravatar.cc/300?img=17",
    region: "North",
    territory: "Noida Central",
    phone: "+91 7654321094",
    address: "55 Sector 62, Noida",
    joined: "2022-10-05",
    target: 210000,
    performance: 91,
    manager: "Neha Gupta",
    managerId: "ase3"
  },
  
  {
    id: "sr1",
    name: "Rahul Saxena",
    email: "sr1@example.com",
    role: UserRole.SR,
    avatar: "https://i.pravatar.cc/300?img=18",
    region: "North",
    territory: "Delhi Central Zone 1",
    phone: "+91 6543210987",
    address: "66 Karol Bagh, Delhi",
    joined: "2023-01-10",
    target: 150000,
    performance: 85,
    manager: "Ravi Verma",
    managerId: "asm1"
  },
  {
    id: "sr2",
    name: "Pooja Agarwal",
    email: "sr2@example.com",
    role: UserRole.SR,
    avatar: "https://i.pravatar.cc/300?img=6",
    region: "North",
    territory: "Delhi Central Zone 2",
    phone: "+91 6543210986",
    address: "77 Lajpat Nagar, Delhi",
    joined: "2023-02-15",
    target: 140000,
    performance: 92,
    manager: "Ravi Verma",
    managerId: "asm1"
  },
  {
    id: "sr3",
    name: "Vivek Chauhan",
    email: "sr3@example.com",
    role: UserRole.SR,
    avatar: "https://i.pravatar.cc/300?img=19",
    region: "North",
    territory: "Delhi West Zone 1",
    phone: "+91 6543210985",
    address: "88 Tilak Nagar, Delhi",
    joined: "2023-03-20",
    target: 130000,
    performance: 97,
    manager: "Sunita Singh",
    managerId: "asm2"
  },
  {
    id: "sr4",
    name: "Divya Sharma",
    email: "sr4@example.com",
    role: UserRole.SR,
    avatar: "https://i.pravatar.cc/300?img=7",
    region: "North",
    territory: "Delhi West Zone 2",
    phone: "+91 6543210984",
    address: "99 Punjabi Bagh, Delhi",
    joined: "2023-04-10",
    target: 120000,
    performance: 83,
    manager: "Sunita Singh",
    managerId: "asm2"
  },
  {
    id: "sr5",
    name: "Suresh Kapoor",
    email: "sr5@example.com",
    role: UserRole.SR,
    avatar: "https://i.pravatar.cc/300?img=20",
    region: "North",
    territory: "Gurgaon East Zone 1",
    phone: "+91 6543210983",
    address: "101 Sector 23, Gurgaon",
    joined: "2023-05-15",
    target: 110000,
    performance: 89,
    manager: "Prakash Mehta",
    managerId: "asm3"
  },
  
  {
    id: "kam1",
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
  }
];

// Auth context provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const updateUserProfile = (updatedInfo: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedInfo };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
