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
  manager?: string;
  managerId?: string;
  directReports?: string[];
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

// PeerEngagement interface
export interface PeerEngagement {
  id: string;
  employeeId: string;
  employeeName: string;
  metrics: {
    salesContribution: number;
    targetCompletion: number;
    teamCollaboration: number;
    knowledgeSharing: number;
    overallEngagement: number;
  };
  ranking: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

// Generate role-specific sales summary
export const generateSalesSummary = (role: UserRole): SalesSummary => {
  const baseMultiplier = {
    [UserRole.TSM]: 1000000,
    [UserRole.ASE]: 500000,
    [UserRole.ASM]: 300000,
    [UserRole.SR]: 100000,
    [UserRole.KAM]: 2000000,
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

// Generate team members data for hierarchy
export const generateTeamData = (userRole?: UserRole, userId?: string): TeamMember[] => {
  const teamData: TeamMember[] = [
    {
      id: "tsm1",
      name: "Rajesh Kumar",
      role: "Territory Sales Manager",
      region: "North",
      territory: "Delhi-NCR",
      avatar: "https://i.pravatar.cc/300?img=11",
      performance: 93,
      target: 500000,
      sales: 465000,
      calls: getRandomInRange(150, 250),
      meetings: getRandomInRange(30, 50),
      newAccounts: getRandomInRange(8, 20),
      email: "tsm1@example.com",
      phone: "+91 9876543210",
      directReports: ["ase1", "ase2", "ase3"]
    },
    {
      id: "tsm2",
      name: "Anita Desai",
      role: "Territory Sales Manager",
      region: "South",
      territory: "Bangalore",
      avatar: "https://i.pravatar.cc/300?img=1",
      performance: 95,
      target: 550000,
      sales: 522500,
      calls: getRandomInRange(140, 230),
      meetings: getRandomInRange(25, 45),
      newAccounts: getRandomInRange(7, 18),
      email: "tsm2@example.com",
      phone: "+91 9876543209",
      directReports: ["ase4", "ase5", "ase6"]
    },
    
    {
      id: "ase1",
      name: "Priya Sharma",
      role: "Area Sales Executive",
      region: "North",
      territory: "Delhi",
      avatar: "https://i.pravatar.cc/300?img=5",
      performance: 105,
      target: 350000,
      sales: 367500,
      calls: getRandomInRange(120, 200),
      meetings: getRandomInRange(20, 40),
      newAccounts: getRandomInRange(5, 15),
      email: "ase1@example.com",
      phone: "+91 8765432109",
      manager: "Rajesh Kumar",
      managerId: "tsm1",
      directReports: ["asm1", "asm2"]
    },
    {
      id: "ase2",
      name: "Amit Patel",
      role: "Area Sales Executive",
      region: "North",
      territory: "Gurgaon",
      avatar: "https://i.pravatar.cc/300?img=12",
      performance: 97,
      target: 340000,
      sales: 329800,
      calls: getRandomInRange(110, 190),
      meetings: getRandomInRange(18, 38),
      newAccounts: getRandomInRange(4, 14),
      email: "ase2@example.com",
      phone: "+91 8765432108",
      manager: "Rajesh Kumar",
      managerId: "tsm1",
      directReports: ["asm3", "asm4"]
    }
  ];
  
  if (userRole && userId) {
    if (userRole === UserRole.ADMIN) {
      return teamData;
    } else if (userRole === UserRole.TSM) {
      const ownData = teamData.find(member => member.id === userId);
      if (!ownData) return [];
      
      const directReports = ownData.directReports || [];
      return [
        ownData,
        ...teamData.filter(member => directReports.includes(member.id) || member.managerId === userId)
      ];
    } else if (userRole === UserRole.ASE || userRole === UserRole.ASM) {
      const ownData = teamData.find(member => member.id === userId);
      if (!ownData) return [];
      
      const directReports = ownData.directReports || [];
      return [
        ownData,
        ...teamData.filter(member => directReports.includes(member.id) || member.managerId === userId)
      ];
    } else {
      return teamData.filter(member => member.id === userId);
    }
  }
  
  return teamData;
};

// Generate territory data
export const generateTerritoryData = (userRole?: UserRole, userId?: string): Territory[] => {
  const territories = [
    {
      id: "t1",
      name: "Delhi-NCR",
      manager: "Rajesh Kumar",
      sales: getRandomInRange(800000, 1200000),
      target: 1000000,
      performance: getRandomInRange(80, 110),
      growth: getRandomInRange(-10, 20)
    },
    {
      id: "t2",
      name: "Bangalore",
      manager: "Anita Desai",
      sales: getRandomInRange(850000, 1300000),
      target: 1100000,
      performance: getRandomInRange(85, 115),
      growth: getRandomInRange(-5, 25)
    },
    {
      id: "t3",
      name: "Mumbai",
      manager: "Vikram Mehta",
      sales: getRandomInRange(900000, 1400000),
      target: 1200000,
      performance: getRandomInRange(75, 105),
      growth: getRandomInRange(-8, 18)
    },
    {
      id: "t4",
      name: "Chennai",
      manager: "Deepak Nair",
      sales: getRandomInRange(750000, 1150000),
      target: 950000,
      performance: getRandomInRange(78, 108),
      growth: getRandomInRange(-12, 15)
    },
    {
      id: "t5",
      name: "Kolkata",
      manager: "Sunita Reddy",
      sales: getRandomInRange(700000, 1100000),
      target: 900000,
      performance: getRandomInRange(76, 106),
      growth: getRandomInRange(-15, 12)
    },
    {
      id: "t6",
      name: "Hyderabad",
      manager: "Rahul Sharma",
      sales: getRandomInRange(780000, 1180000),
      target: 980000,
      performance: getRandomInRange(82, 112),
      growth: getRandomInRange(-7, 22)
    }
  ];
  
  if (userRole && userId) {
    if (userRole === UserRole.ADMIN) {
      return territories;
    } else if (userRole === UserRole.TSM) {
      const userData = generateTeamData().find(member => member.id === userId);
      if (!userData) return [];
      
      return territories.filter(territory => 
        territory.name === userData.territory || 
        territory.manager === userData.name
      );
    } else {
      return [];
    }
  }
  
  return territories;
};

// Generate accounts data
export const generateAccountsData = (userRole?: UserRole, userId?: string): Account[] => {
  const names = [
    'BigMart Retail', 'SuperStore Chain', 'QuickShop', 'ValueMart', 
    'FreshGrocer', 'MegaMall', 'EasyShop', 'PrimeBazaar'
  ];
  
  const types = ['Key Account', 'Distributor', 'Retail Chain', 'Wholesaler'];
  const statuses = ['Active', 'Inactive', 'New', 'At Risk'];
  
  if (userRole && userId) {
    if (userRole === UserRole.ADMIN) {
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
    } else {
      return [];
    }
  }
  
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

// Generate peer engagement data
export const generatePeerEngagementData = (userRole?: UserRole, userId?: string): PeerEngagement[] => {
  const teamData = generateTeamData();
  
  return teamData.map((member, index) => {
    const metrics = {
      salesContribution: getRandomInRange(70, 100),
      targetCompletion: getRandomInRange(75, 105),
      teamCollaboration: getRandomInRange(60, 95),
      knowledgeSharing: getRandomInRange(65, 90),
      overallEngagement: 0
    };
    
    metrics.overallEngagement = Math.round(
      (metrics.salesContribution + metrics.targetCompletion + 
       metrics.teamCollaboration + metrics.knowledgeSharing) / 4
    );
    
    const ranking = index + 1;
    
    const trendOptions: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    const trend = trendOptions[Math.floor(Math.random() * 3)];
    
    return {
      id: `pe-${member.id}`,
      employeeId: member.id,
      employeeName: member.name,
      metrics,
      ranking,
      trend,
      lastUpdated: new Date()
    };
  })
  .sort((a, b) => b.metrics.overallEngagement - a.metrics.overallEngagement)
  .map((item, index) => ({
    ...item,
    ranking: index + 1
  }))
  .filter(item => {
    if (!userRole || !userId) return true;
    
    if (userRole === UserRole.ADMIN) {
      return true;
    } else if (userRole === UserRole.TSM) {
      const tsmData = teamData.find(m => m.id === userId);
      return tsmData?.directReports?.includes(item.employeeId) || item.employeeId === userId;
    } else if (userRole === UserRole.ASE || userRole === UserRole.ASM) {
      const userData = teamData.find(m => m.id === userId);
      return userData?.directReports?.includes(item.employeeId) || item.employeeId === userId;
    } else {
      return item.employeeId === userId;
    }
  });
};
