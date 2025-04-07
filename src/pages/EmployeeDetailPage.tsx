
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatPercentage, formatCurrency, formatNumber, getPerformanceColor } from '@/utils/data-utils';
import { generateTeamData } from '@/data/mockData';
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
  Legend
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Phone,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  region: string;
  territory: string;
  performance: number;
  target: number;
  sales?: number;
  avatar: string;
  calls?: number;
  meetings?: number;
  newAccounts?: number;
  email?: string;
  phone?: string;
}

const EmployeeDetailPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const teamData = generateTeamData();
  const employeeData = teamData.find(member => member.id === employeeId);
  
  if (user?.role !== UserRole.ADMIN) {
    navigate('/dashboard');
    return null;
  }
  
  if (!employeeData) {
    navigate('/team');
    return null;
  }
  
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const performance = Math.floor(Math.random() * 30) + 70;
      const target = 100;
      
      return {
        month,
        performance,
        target
      };
    });
  };
  
  const generateDailyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days.map(day => ({
      day,
      calls: Math.floor(Math.random() * 40) + 10,
      meetings: Math.floor(Math.random() * 8) + 1,
      sales: Math.floor(Math.random() * 15000) + 2000
    }));
  };
  
  const generateComparisonData = () => {
    const categories = ['Sales', 'Meetings', 'Calls', 'New Accounts', 'Retention'];
    
    return categories.map(category => {
      const employeeValue = Math.floor(Math.random() * 30) + 70;
      const teamAverage = Math.floor(Math.random() * 20) + 60;
      
      return {
        category,
        employee: employeeValue,
        teamAverage
      };
    });
  };
  
  const handleSaveData = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Data saved successfully");
    }, 800);
  };
  
  const monthlyData = generateMonthlyData();
  const dailyData = generateDailyData();
  const comparisonData = generateComparisonData();
  
  return (
    <>
      <Header 
        title={`Employee Profile: ${employeeData.name}`} 
        subtitle={`Detailed performance metrics for ${employeeData.role}`}
        showExport
      />
      
      <main className="dashboard-layout container pb-8">
        <div className="flex justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/team')}
          >
            Back to Team
          </Button>
          
          <Button
            onClick={handleSaveData}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Data"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={employeeData.avatar} alt={employeeData.name} />
                  <AvatarFallback>{employeeData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{employeeData.name}</CardTitle>
                  <CardDescription>{employeeData.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employeeData.email || 'email@example.com'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employeeData.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employeeData.region} - {employeeData.territory}</span>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm">Overall Performance</div>
                    <div className={`text-sm font-medium ${getPerformanceColor(employeeData.performance, 100)}`}>
                      {formatPercentage(employeeData.performance)}
                    </div>
                  </div>
                  <CustomProgress 
                    value={employeeData.performance} 
                    className="h-2 mb-4" 
                    indicatorClassName={
                      employeeData.performance >= 100 ? "bg-sales-success" :
                      employeeData.performance >= 85 ? "bg-sales-warning" :
                      "bg-sales-danger"
                    }
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Target</div>
                    <div className="font-medium">{formatCurrency(employeeData.target || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Achieved</div>
                    <div className="font-medium">{formatCurrency((employeeData.performance / 100) * (employeeData.target || 0))}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
              <CardDescription>Performance vs target over time</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 120]} width={35} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                      formatter={(value) => [value, '']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      name="Performance" 
                      stroke="#0F52BA" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Target" 
                      stroke="#FF6B6B" 
                      strokeDasharray="5 5" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <BarChart3 size={18} className="mr-2 text-sales-primary" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(employeeData.sales || 0)}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  vs Target: {formatPercentage(employeeData.performance)}
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-sales-success">
                    <TrendingUp size={14} className="mr-1" />
                    <span>+7.2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ShoppingBag size={18} className="mr-2 text-sales-primary" />
                New Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeData.newAccounts || 0}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  vs Target: {employeeData.newAccounts ? formatNumber(employeeData.newAccounts) : 0}/20
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-sales-warning">
                    <TrendingUp size={14} className="mr-1" />
                    <span>+2.4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Phone size={18} className="mr-2 text-sales-primary" />
                Calls Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeData.calls || 0}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Conversion: {Math.floor(Math.random() * 20) + 10}%
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-sales-success">
                    <TrendingUp size={14} className="mr-1" />
                    <span>+12.7%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users size={18} className="mr-2 text-sales-primary" />
                Team Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{teamData
                .sort((a, b) => b.performance - a.performance)
                .findIndex(member => member.id === employeeData.id) + 1}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  of {teamData.length} members
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-sales-warning">
                    <TrendingUp size={14} className="mr-1" />
                    <span>+1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Daily calls, meetings and sales performance</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" width={35} />
                    <YAxis yAxisId="right" orientation="right" width={35} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="calls" 
                      name="Calls" 
                      stroke="#0F52BA" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="meetings" 
                      name="Meetings" 
                      stroke="#4CAF50" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="sales" 
                      name="Sales (₹)" 
                      stroke="#FF6B6B" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Against Team Average</CardTitle>
              <CardDescription>Comparison across key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="category" type="category" width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="employee" name="Employee" fill="#0F52BA" />
                    <Bar dataKey="teamAverage" name="Team Average" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6 border-l-4 border-l-sales-primary">
          <CardContent className="p-6">
            <div className="flex items-start">
              <AlertCircle className="text-sales-primary mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Performance Insights for {employeeData.name}</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>{employeeData.name} is {employeeData.performance >= 100 ? 'exceeding' : employeeData.performance >= 90 ? 'close to meeting' : 'below'} their sales targets. {
                    employeeData.performance >= 100 ? 'Consider increasing their target for next quarter or assigning mentorship responsibilities.' :
                    employeeData.performance >= 90 ? 'With some targeted coaching on closing techniques, they could exceed their target.' :
                    'They need additional support and training to improve performance.'
                  }</p>
                  <p>The call-to-meeting conversion rate is {Math.floor(Math.random() * 10) + 15}%, which is {Math.random() > 0.5 ? 'above' : 'below'} team average. {
                    Math.random() > 0.5 ? 'Their approach to qualifying leads appears effective.' :
                    'Consider providing training on qualifying leads more effectively.'
                  }</p>
                  <p>Based on current trends, {employeeData.name} is projected to {
                    employeeData.performance >= 95 ? 'exceed their quarterly targets by approximately 5-10%.' :
                    employeeData.performance >= 85 ? 'slightly miss their quarterly targets by approximately 5%.' :
                    'significantly miss their quarterly targets, requiring immediate intervention.'
                  }</p>
                </div>
                <div className="mt-4">
                  <Button>Schedule 1:1 Meeting</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default EmployeeDetailPage;
