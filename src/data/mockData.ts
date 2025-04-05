import { UserRole } from '@/contexts/AuthContext';
import { getRandomInRange, getLastNMonths } from '@/utils/data-utils';

// Interface for sales data
export interface SalesSummary {
  totalSales: number;
  targetSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  unitsSold: number;
  newAccounts: number;
  activeCustomers: number;
  targetCompletion: number;
  lastUpdated: Date;
}

// Interface for performance metrics
export interface PerformanceMetric {
  label: string;
  value: number;
  previousValue: number;
  change: number;
  target: number;
  status: 'Excellent' | 'Good' | 'Poor';
}

// Interface for product sales
export interface ProductSales {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  growth: number;
  margin: number;
}

// Forecast data interface
export interface Forecast {
  month: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

// Team member interface
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  region: string;
  territory: string;
  avatar: string;
  performance: number;
  target: number;
  sales?: number;
  newAccounts?: number;
  calls?: number;
  meetings?: number;
  email?: string;
  phone?: string;
}

// Territory interface
export interface Territory {
  id: string;
  name: string;
  manager: string;
  sales: number;
  target: number;
  performance: number;
  growth: number;
}

// Account interface
export interface Account {
  id: string;
  name: string;
  type: string;
  sales: number;
  lastOrder: Date;
  status: string;
}

// Generate role-specific sales summary
export const generateSalesSummary = (role: UserRole): SalesSummary => {
  const baseMultiplier = {
    [UserRole.TSM]: 1000000,
    [UserRole.ASE]: 500000,
    [UserRole.DSR]: 300000,
    [UserRole.KAM]: 2000000,
    [UserRole.RSO]: 100000,
    [UserRole.ADMIN]: 5000000,
  }[role] || 500000;
  
  const randomFactor = getRandomInRange(85, 115) / 100;
  const totalSales = Math.round(baseMultiplier * randomFactor);
  const targetSales = Math.round(baseMultiplier * 1.1);
  
  return {
    totalSales,
    targetSales,
    totalRevenue: totalSales,
    averageOrderValue: Math.round(totalSales / getRandomInRange(100, 200)),
    unitsSold: Math.round(totalSales / getRandomInRange(500, 1500)),
    newAccounts: getRandomInRange(5, 20),
    activeCustomers: getRandomInRange(20, 100),
    targetCompletion: (totalSales / targetSales) * 100,
    lastUpdated: new Date(),
  };
};

// Generate performance metrics
export const generatePerformanceMetrics = (role: UserRole): PerformanceMetric[] => {
  const metrics = [
    {
      label: 'Sales Volume',
      value: getRandomInRange(80, 120),
      previousValue: getRandomInRange(70, 110),
      target: 100,
      change: 0,
      status: 'Good' as const,
    },
    {
      label: 'Revenue',
      value: getRandomInRange(75, 115),
      previousValue: getRandomInRange(70, 110),
      target: 100,
      change: 0,
      status: 'Good' as const,
    },
    {
      label: 'Market Share',
      value: getRandomInRange(20, 35),
      previousValue: getRandomInRange(18, 32),
      target: 30,
      change: 0,
      status: 'Good' as const,
    },
    {
      label: 'Customer Retention',
      value: getRandomInRange(70, 95),
      previousValue: getRandomInRange(65, 90),
      target: 85,
      change: 0,
      status: 'Good' as const,
    }
  ];
  
  // Calculate changes and status
  return metrics.map(metric => {
    const change = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
    
    let status: 'Excellent' | 'Good' | 'Poor';
    if (metric.value >= metric.target * 1.05) {
      status = 'Excellent';
    } else if (metric.value >= metric.target * 0.9) {
      status = 'Good';
    } else {
      status = 'Poor';
    }
    
    return { ...metric, change, status };
  });
};

// Generate products sales data
export const generateProductSales = (): ProductSales[] => {
  const categories = ['Beverages', 'Snacks', 'Dairy', 'Personal Care', 'Home Care'];
  const products = [
    'Premium Coffee', 'Energy Drink', 'Mineral Water', 
    'Potato Chips', 'Chocolate Bar', 'Biscuits', 
    'Yogurt', 'Cheese', 'Milk', 
    'Shampoo', 'Soap', 'Toothpaste', 
    'Detergent', 'Air Freshener', 'Dishwasher'
  ];
  
  return products.map((name, index) => {
    const category = categories[Math.floor(index / 3)];
    const unitsSold = getRandomInRange(1000, 10000);
    const price = getRandomInRange(50, 500);
    const revenue = unitsSold * price;
    const growth = getRandomInRange(-15, 30);
    const margin = getRandomInRange(15, 40);
    
    return {
      id: `P${index + 1}`,
      name,
      category,
      unitsSold,
      revenue,
      growth,
      margin
    };
  });
};

// Generate forecast data
export const generateForecastData = (): Forecast[] => {
  const months = getLastNMonths(6);
  const futureMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const allMonths = [...months, ...futureMonths];
  
  return allMonths.map((month, index) => {
    const baseValue = getRandomInRange(80, 120);
    const trend = (index / 3); // Slight upward trend
    const seasonal = 10 * Math.sin(index / 2); // Seasonal variation
    const predicted = baseValue + trend + seasonal;
    const uncertainty = index >= months.length ? (index - months.length + 1) * 3 : 0;
    
    return {
      month,
      predicted: Math.round(predicted),
      lowerBound: Math.round(predicted * (100 - uncertainty) / 100),
      upperBound: Math.round(predicted * (100 + uncertainty) / 100),
    };
  });
};

// Generate monthly sales data
export const generateMonthlySalesData = (): { name: string; sales: number; target: number }[] => {
  const months = getLastNMonths(6);
  
  return months.map(month => {
    const target = getRandomInRange(80, 100);
    const performance = getRandomInRange(70, 110) / 100;
    
    return {
      name: month,
      sales: Math.round(target * performance),
      target
    };
  });
};

// Generate team members data
export const generateTeamData = (): TeamMember[] => {
  const roles = ['Sales Representative', 'Area Manager', 'Account Executive'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const territories = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];
  
  return Array.from({ length: 5 }, (_, i) => {
    const target = getRandomInRange(80, 100) * 10000;
    const performance = getRandomInRange(70, 110);
    const sales = Math.round(target * (performance/100));
    const calls = getRandomInRange(50, 200);
    const meetings = getRandomInRange(10, 40);
    const newAccounts = getRandomInRange(2, 15);
    
    // Indian names for team members
    const names = [
      'Rahul Sharma', 
      'Priya Patel', 
      'Amit Singh', 
      'Deepika Verma', 
      'Vikram Mehta'
    ];
    
    // Generate email based on name
    const nameParts = names[i].split(' ');
    const email = `${nameParts[0].toLowerCase()}.${nameParts[1].toLowerCase()}@example.com`;
    
    // Generate Indian phone number
    const phone = `+91 ${getRandomInRange(7000000000, 9999999999)}`;
    
    return {
      id: `TM${i + 1}`,
      name: names[i],
      role: roles[i % roles.length],
      region: regions[i % regions.length],
      territory: territories[i % territories.length],
      avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      performance,
      target,
      sales,
      calls,
      meetings,
      newAccounts,
      email,
      phone
    };
  });
};

// Generate territory data
export const generateTerritoryData = (): Territory[] => {
  const territories = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  const managers = ['Rahul Singh', 'Amrita Patel', 'Suresh Kumar', 'Priya Sharma', 'Vikram Mehta', 'Deepa Reddy'];
  
  return territories.map((name, i) => {
    const target = getRandomInRange(800000, 1200000);
    const performance = getRandomInRange(80, 110) / 100;
    const sales = Math.round(target * performance);
    const growth = getRandomInRange(-10, 20);
    
    return {
      id: `T${i + 1}`,
      name,
      manager: managers[i],
      sales,
      target,
      performance: performance * 100,
      growth
    };
  });
};

// Generate accounts data
export const generateAccountsData = (): Account[] => {
  const names = [
    'BigMart Retail', 'SuperStore Chain', 'QuickShop', 'ValueMart', 
    'FreshGrocer', 'MegaMall', 'EasyShop', 'PrimeBazaar'
  ];
  
  const types = ['Key Account', 'Distributor', 'Retail Chain', 'Wholesaler'];
  const statuses = ['Active', 'Inactive', 'New', 'At Risk'];
  
  return names.map((name, i) => {
    const lastOrder = new Date();
    lastOrder.setDate(lastOrder.getDate() - getRandomInRange(1, 30));
    
    return {
      id: `A${i + 1}`,
      name,
      type: types[i % types.length],
      sales: getRandomInRange(100000, 500000),
      lastOrder,
      status: statuses[i % statuses.length]
    };
  });
};
