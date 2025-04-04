
import React from 'react';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CustomProgress } from '@/components/ui/custom-progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { formatCurrency, formatPercentage, formatNumber, generateInsight } from '@/utils/data-utils';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Users 
} from 'lucide-react';
import { 
  generateSalesSummary, 
  generatePerformanceMetrics, 
  generateMonthlySalesData,
  generateForecastData
} from '@/data/mockData';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Generate role-specific data
  const salesSummary = generateSalesSummary(user?.role || UserRole.TSM);
  const performanceMetrics = generatePerformanceMetrics(user?.role || UserRole.TSM);
  const monthlySalesData = generateMonthlySalesData();
  const forecastData = generateForecastData();
  
  // Function to render the trend indicator
  const renderTrend = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-sales-success">
          <TrendingUp size={14} className="mr-1" />
          <span>+{formatPercentage(change)}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-sales-danger">
          <TrendingDown size={14} className="mr-1" />
          <span>{formatPercentage(change)}</span>
        </div>
      );
    }
    return <span>No change</span>;
  };
  
  // Determine the welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return (
    <>
      <Header 
        title={`${getWelcomeMessage()}, ${user?.name?.split(' ')[0] || 'User'}`} 
        subtitle={`${user?.role} Dashboard for ${user?.territory || 'Your Territory'}`}
        showExport
      />
      
      <main className="dashboard-layout">
        {/* KPI Summary Cards */}
        <div className="sales-grid">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <BarChart3 size={18} className="mr-2 text-sales-primary" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesSummary.totalSales)}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  vs Target: {formatCurrency(salesSummary.targetSales)}
                </div>
                <div className="text-sm">
                  {renderTrend(performanceMetrics[0].change)}
                </div>
              </div>
              <CustomProgress 
                value={salesSummary.targetCompletion} 
                className="h-2 mt-2" 
                indicatorClassName={salesSummary.targetCompletion >= 100 ? "bg-sales-success" : "bg-sales-primary"}
              />
              <div className="mt-1 text-xs text-right">
                {formatPercentage(salesSummary.targetCompletion)} of target
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <DollarSign size={18} className="mr-2 text-sales-primary" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesSummary.totalRevenue)}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Avg. Order: {formatCurrency(salesSummary.averageOrderValue)}
                </div>
                <div className="text-sm">
                  {renderTrend(performanceMetrics[1].change)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ShoppingBag size={18} className="mr-2 text-sales-primary" />
                Units Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(salesSummary.unitsSold)}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  New Accounts: {salesSummary.newAccounts}
                </div>
                <div className="text-sm">
                  {renderTrend(performanceMetrics[0].change)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users size={18} className="mr-2 text-sales-primary" />
                Active Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesSummary.activeCustomers}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Retention: {formatPercentage(performanceMetrics[3].value)}
                </div>
                <div className="text-sm">
                  {renderTrend(performanceMetrics[3].change)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Sales Trend Chart */}
          <Card className="card-hover col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Sales Performance</CardTitle>
              <CardDescription>Comparison of sales vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Actual Sales" fill="#0F52BA" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Forecast Chart */}
          <Card className="card-hover col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Sales Forecast</CardTitle>
              <CardDescription>AI-predicted sales for the next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#0F52BA" 
                      fill="#0F52BA" 
                      fillOpacity={0.8}
                      name="Predicted Sales"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="transparent"
                      fill="#4682B4"
                      fillOpacity={0.2}
                      name="Lower Range"
                    />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="transparent"
                      fill="#4682B4"
                      fillOpacity={0.2}
                      name="Upper Range"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Metrics */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <div className="text-2xl font-bold">
                      {formatPercentage(metric.value)}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      metric.status === 'Excellent' ? 'bg-sales-success/20 text-sales-success' :
                      metric.status === 'Good' ? 'bg-sales-warning/20 text-sales-warning' :
                      'bg-sales-danger/20 text-sales-danger'
                    }`}>
                      {metric.status}
                    </div>
                  </div>
                  
                  <CustomProgress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2" 
                    indicatorClassName={
                      metric.status === 'Excellent' ? "bg-sales-success" :
                      metric.status === 'Good' ? "bg-sales-warning" :
                      "bg-sales-danger"
                    }
                  />
                  
                  <div className="flex justify-between mt-2 text-sm">
                    <div className="text-muted-foreground">
                      Target: {formatPercentage(metric.target)}
                    </div>
                    <div>{renderTrend(metric.change)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">AI-Powered Insights</h2>
          <Card className="border-l-4 border-l-sales-primary">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertCircle className="text-sales-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Performance Analysis</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>{generateInsight(performanceMetrics[0].value, performanceMetrics[0].previousValue, 'sales volume')}</p>
                    <p>{generateInsight(performanceMetrics[1].value, performanceMetrics[1].previousValue, 'revenue')}</p>
                    <p>Based on current trends, you are projected to {salesSummary.targetCompletion >= 95 ? 'meet or exceed' : 'fall short of'} your quarterly targets. {salesSummary.targetCompletion < 95 ? 'Consider focusing on high-margin products and key accounts to improve performance.' : 'Continue with your successful strategies while looking for optimization opportunities.'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
