
import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { CustomProgress } from '@/components/ui/custom-progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPercentage, formatCurrency, formatNumber, getPerformanceColor } from '@/utils/data-utils';
import { generateTeamData, generateTerritoryData } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Users,
  ChevronDown,
  ChevronUp,
  Phone 
} from 'lucide-react';

const OwnerDashboardPage: React.FC = () => {
  const teamData = generateTeamData();
  const territoryData = generateTerritoryData();
  
  // Generate random colors for charts
  const COLORS = ['#0F52BA', '#4682B4', '#1A3A6A', '#FF6B6B', '#4CAF50', '#FFC107'];
  
  // Calculate team performance average
  const averagePerformance = teamData.reduce((acc, member) => acc + member.performance, 0) / teamData.length;
  
  // State for expanded employee details
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  
  // Toggle employee details
  const toggleEmployeeDetails = (employeeId: string) => {
    if (expandedEmployee === employeeId) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employeeId);
    }
  };
  
  // Generate mock daily activity data for an employee
  const generateDailyData = (employeeId: string) => {
    // In a real app, this would fetch from an API
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days.map(day => ({
      day,
      calls: Math.floor(Math.random() * 40) + 10,
      meetings: Math.floor(Math.random() * 8) + 1,
      sales: Math.floor(Math.random() * 15000) + 2000
    }));
  };
  
  return (
    <>
      <Header title="Owner's Dashboard" subtitle="Complete insights of all employees in one view" showExport />
      
      <main className="dashboard-layout">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users size={18} className="mr-2 text-sales-primary" />
                Total Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamData.length}</div>
              <div className="flex justify-between mt-1 text-sm">
                <div className="text-muted-foreground">Active Sales Reps</div>
                <div className="flex items-center text-sales-success">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+2 this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <BarChart3 size={18} className="mr-2 text-sales-primary" />
                Avg. Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(averagePerformance)}</div>
              <CustomProgress 
                value={averagePerformance} 
                className="h-2 mt-1" 
                indicatorClassName={
                  averagePerformance >= 100 ? "bg-sales-success" :
                  averagePerformance >= 85 ? "bg-sales-warning" :
                  "bg-sales-danger"
                }
              />
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <DollarSign size={18} className="mr-2 text-sales-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(
                teamData.reduce((acc, member) => acc + (member.sales || 50000), 0)
              )}</div>
              <div className="flex justify-between mt-1 text-sm">
                <div className="text-muted-foreground">YTD</div>
                <div className="flex items-center text-sales-success">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+8.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ShoppingBag size={18} className="mr-2 text-sales-primary" />
                Territories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{territoryData.length}</div>
              <div className="flex justify-between mt-1 text-sm">
                <div className="text-muted-foreground">Active Markets</div>
                <div className="flex items-center text-sales-warning">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+1 this quarter</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Performance Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Team Performance Comparison</CardTitle>
            <CardDescription>Sales performance across all team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teamData.map(member => ({
                    name: member.name.split(' ')[0],
                    performance: member.performance,
                    target: member.target
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 120]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Performance']}
                    labelFormatter={(name) => `Employee: ${name}`}
                  />
                  <Bar dataKey="performance" name="Performance %" radius={[4, 4, 0, 0]}>
                    {teamData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={
                        teamData[index].performance >= 100 ? "#4CAF50" :
                        teamData[index].performance >= 85 ? "#FFC107" : "#FF6B6B"
                      } />
                    ))}
                  </Bar>
                  <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} fill="#1A3A6A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Team Members with Detailed Insights */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Team Member Insights</h2>
          <div className="space-y-4">
            {teamData.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleEmployeeDetails(member.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role} - {member.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getPerformanceColor(member.performance, member.target)}`}>
                          {formatPercentage(member.performance)}
                        </div>
                        <div className="text-xs text-muted-foreground">vs Target</div>
                      </div>
                      <div>
                        {expandedEmployee === member.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedEmployee === member.id && (
                  <div className="px-4 pb-4 pt-2 border-t">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Employee Metrics */}
                      <Card className="col-span-1 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Sales vs Target</span>
                              <span className={getPerformanceColor(member.performance, 100)}>
                                {formatPercentage(member.performance)}
                              </span>
                            </div>
                            <CustomProgress 
                              value={member.performance} 
                              className="h-1.5"
                              indicatorClassName={
                                member.performance >= 100 ? "bg-sales-success" :
                                member.performance >= 85 ? "bg-sales-warning" :
                                "bg-sales-danger"
                              }
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Total Sales</div>
                              <div className="font-medium">{formatCurrency(member.sales || 50000)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">New Accounts</div>
                              <div className="font-medium">{member.newAccounts || 12}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Calls Made</div>
                              <div className="font-medium">{member.calls || 156}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Meetings</div>
                              <div className="font-medium">{member.meetings || 28}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Activity Chart */}
                      <Card className="col-span-1 lg:col-span-2 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Daily Activity Tracker</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={generateDailyData(member.id)}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
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
                                  name="Sales" 
                                  stroke="#FF6B6B" 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        View Full Profile
                      </Button>
                      <Button size="sm">
                        Send Message
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
        
        {/* Territory Performance */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Territory Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territoryData.map((territory) => (
              <Card key={territory.id} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{territory.name}</CardTitle>
                  <CardDescription className="text-xs">Manager: {territory.manager}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Sales vs Target</div>
                    <div className={`text-sm font-medium ${getPerformanceColor(territory.performance, 100)}`}>
                      {formatPercentage(territory.performance)}
                    </div>
                  </div>
                  
                  <CustomProgress 
                    value={territory.performance} 
                    className="h-2 mb-4" 
                    indicatorClassName={
                      territory.performance >= 100 ? "bg-sales-success" :
                      territory.performance >= 85 ? "bg-sales-warning" :
                      "bg-sales-danger"
                    }
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Sales</div>
                      <div className="font-medium">{formatCurrency(territory.sales)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Growth</div>
                      <div className={`font-medium ${territory.growth >= 0 ? 'text-sales-success' : 'text-sales-danger'}`}>
                        {territory.growth >= 0 ? '+' : ''}{territory.growth}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default OwnerDashboardPage;
