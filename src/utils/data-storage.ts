
import { User, UserRole } from '@/contexts/AuthContext';

// Types for saved data
export interface SavedSalesData {
  id: string;
  userId: string;
  date: string;
  callsMade: number;
  meetings: number;
  salesAmount: number;
  newAccounts: number;
  notes?: string;
}

// Mock storage using localStorage
const STORAGE_KEY = 'sales_data_records';

// Get all saved data
export const getAllSalesData = (): SavedSalesData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving sales data:', error);
    return [];
  }
};

// Get sales data for a specific user
export const getUserSalesData = (userId: string): SavedSalesData[] => {
  const allData = getAllSalesData();
  return allData.filter(item => item.userId === userId);
};

// Save new sales data
export const saveSalesData = (data: Omit<SavedSalesData, 'id' | 'date'>): SavedSalesData => {
  const allData = getAllSalesData();
  const newEntry: SavedSalesData = {
    ...data,
    id: `sales_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    date: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...allData, newEntry]));
  return newEntry;
};

// Delete a specific sales data entry
export const deleteSalesData = (id: string): boolean => {
  const allData = getAllSalesData();
  const filteredData = allData.filter(item => item.id !== id);
  
  if (filteredData.length < allData.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  }
  return false;
};

// Delete all sales data for a specific user
export const deleteUserSalesData = (userId: string): boolean => {
  const allData = getAllSalesData();
  const filteredData = allData.filter(item => item.userId !== userId);
  
  if (filteredData.length < allData.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  }
  return false;
};

// Delete all sales data (admin only)
export const clearAllSalesData = (): boolean => {
  localStorage.removeItem(STORAGE_KEY);
  return true;
};

// Check if a user is authorized to delete data
export const canDeleteData = (user: User | null, targetUserId: string): boolean => {
  if (!user) return false;
  
  // Admin can delete anyone's data
  if (user.role === UserRole.ADMIN) return true;
  
  // TSM can delete their direct reports' data
  if (user.role === UserRole.TSM) {
    // In a real app, you would check if targetUserId is a direct report of the TSM
    return true;
  }
  
  // Users can only delete their own data
  return user.id === targetUserId;
};
