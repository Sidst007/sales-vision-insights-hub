
// Helper functions for data manipulation and formatting

// Format a number as currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format a percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Format a large number with K, M suffixes
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Calculate percentage change between two values
export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Generate random data within a range
export const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Format a date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Get an array of the last n months
export const getLastNMonths = (n: number): string[] => {
  const months = [];
  const date = new Date();
  
  for (let i = 0; i < n; i++) {
    const monthDate = new Date(date);
    monthDate.setMonth(date.getMonth() - i);
    months.unshift(monthDate.toLocaleString('default', { month: 'short' }));
  }
  
  return months;
};

// Generate a color based on performance
export const getPerformanceColor = (actual: number, target: number): string => {
  const percentage = (actual / target) * 100;
  
  if (percentage >= 100) return 'text-sales-success';
  if (percentage >= 85) return 'text-sales-warning';
  return 'text-sales-danger';
};

// Get appropriate status badge color
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'achieved':
    case 'excellent':
      return 'bg-sales-success/20 text-sales-success';
    case 'in progress':
    case 'on track':
    case 'good':
      return 'bg-sales-warning/20 text-sales-warning';
    case 'not started':
    case 'at risk':
    case 'poor':
      return 'bg-sales-danger/20 text-sales-danger';
    default:
      return 'bg-gray-200 text-gray-600';
  }
};

// Generate simple AI insights
export const generateInsight = (current: number, previous: number, type: string): string => {
  const change = calculateChange(current, previous);
  
  if (Math.abs(change) < 5) {
    return `Your ${type} has remained stable compared to the previous period.`;
  } 
  
  if (change > 20) {
    return `Excellent! Your ${type} has increased significantly by ${formatPercentage(change)}. Continue with your current strategy.`;
  } 
  
  if (change > 0) {
    return `Good progress. Your ${type} has increased by ${formatPercentage(change)}. Keep improving.`;
  }
  
  if (change > -10) {
    return `Your ${type} has slightly decreased by ${formatPercentage(Math.abs(change))}. Monitor the situation.`;
  }
  
  return `Warning: Your ${type} has decreased by ${formatPercentage(Math.abs(change))}. Action is needed.`;
};
