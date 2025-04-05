
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { generateTeamData, generateTerritoryData } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Users, 
  BarChart3, 
  TrendingUp,
  Phone,
  Mail,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>('performance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  
  const teamData = generateTeamData();
  const territoryData = generateTerritoryData();
  
  // Generate random colors for territory chart
  const COLORS = ['#0F52BA', '#4682B4', '#1A3A6A', '#FF6B6B', '#4CAF50', '#FFC107'];
  
  // Calculate team performance average
  const averagePerformance = teamData.reduce((acc, member) => acc + member.performance, 0) / teamData.length;
  
  // Sorting function
  const sortTeamData = (data: any[], field: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'performance':
        default:
          comparison = a.performance - b.performance;
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Generate performance data for the dialog
  const generatePerformanceData = (employeeId: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const employee = teamData.find(member => member.id === employeeId);
    
    if (!employee) return [];
    
    return months.map(month => {
      const value = Math.floor(Math.random() * 30) + 70;
      return {
        month,
        performance: value,
        target: 100
      };
    });
  };
  
  // Only admins should be able to see employee details
  const canViewEmployeeDetails = user?.role === UserRole.ADMIN || user?.role === UserRole.TSM;
  
  // Sort the team data
  const sortedTeamData = sortTeamData(teamData, sortField, sortDirection);
  
  return (
    <>
      <Header title="Team Performance" subtitle="Track and analyze your team's sales performance" showExport />
      
      <main className="dashboard-layout">
        {/* Team Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Team Overview</CardTitle>
              <CardDescription>Average performance across team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{formatPercentage(averagePerformance)}</div>
                <div className="text-sm text-muted-foreground">
                  Average Performance vs Target
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <div>Overall Progress</div>
                  <div className={getPerformanceColor(averagePerformance, 100)}>
                    {formatPercentage(averagePerformance)}
                  </div>
                </div>
                <CustomProgress 
                  value={averagePerformance} 
                  className="h-2" 
                  indicatorClassName={
                    averagePerformance >= 100 ? "bg-sales-success" :
                    averagePerformance >= 85 ? "bg-sales-warning" :
                    "bg-sales-danger"
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Top Performer</div>
                  <div className="text-xl font-semibold">
                    {formatPercentage(Math.max(...teamData.map(t => t.performance)))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Lowest Performer</div>
                  <div className="text-xl font-semibold">
                    {formatPercentage(Math.min(...teamData.map(t => t.performance)))}
                  </div>
                </div>
              </div>
              
              {canViewEmployeeDetails && (
                <div className="pt-4">
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/comparison')}
                  >
                    <Users className="mr-2 h-4 w-4" /> Compare Employees
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Territory Performance</CardTitle>
              <CardDescription>Sales by territory vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={territoryData.map(t => ({ 
                      name: t.name, 
                      performance: t.performance 
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 120]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Performance']}
                      labelFormatter={(name) => `Territory: ${name}`}
                    />
                    <Bar dataKey="performance" name="Performance %" radius={[4, 4, 0, 0]}>
                      {territoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Member List */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Team Members</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSort('name')}
              >
                Name
                {sortField === 'name' && (
                  <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSort('performance')}
              >
                Performance
                {sortField === 'performance' && (
                  <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSort('region')}
              >
                Region
                {sortField === 'region' && (
                  <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                  {canViewEmployeeDetails && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTeamData.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium ${getPerformanceColor(member.performance, member.target)}`}>
                          {formatPercentage(member.performance)}
                        </span>
                        <div className="w-24 mt-1">
                          <CustomProgress 
                            value={(member.performance / member.target) * 100} 
                            className="h-1.5" 
                            indicatorClassName={
                              member.performance >= member.target ? "bg-sales-success" :
                              member.performance >= member.target * 0.85 ? "bg-sales-warning" :
                              "bg-sales-danger"
                            }
                          />
                        </div>
                      </div>
                    </td>
                    {canViewEmployeeDetails && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedEmployee(member.id)}
                              >
                                <BarChart3 className="h-4 w-4 mr-1" /> Stats
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Performance Metrics: {member.name}</DialogTitle>
                                <DialogDescription>{member.role} - {member.region}</DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <Card>
                                    <CardContent className="pt-6">
                                      <div className="text-center">
                                        <TrendingUp className="h-8 w-8 text-sales-primary mx-auto mb-2" />
                                        <div className="text-2xl font-bold">{formatPercentage(member.performance)}</div>
                                        <div className="text-sm text-muted-foreground">Overall Performance</div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-6">
                                      <div className="text-center">
                                        <Users className="h-8 w-8 text-sales-primary mx-auto mb-2" />
                                        <div className="text-2xl font-bold">
                                          #{sortedTeamData
                                            .sort((a, b) => b.performance - a.performance)
                                            .findIndex(m => m.id === member.id) + 1}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Team Ranking</div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <div className="h-56">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={generatePerformanceData(member.id)}
                                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="month" />
                                      <YAxis domain={[0, 120]} />
                                      <Tooltip 
                                        formatter={(value) => [`${value}%`, 'Performance']}
                                        labelFormatter={(month) => `Month: ${month}`}
                                      />
                                      <Bar dataKey="performance" name="Performance" fill="#0F52BA" radius={[4, 4, 0, 0]} />
                                      <Bar dataKey="target" name="Target" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="text-muted-foreground">Total Sales</div>
                                    <div className="font-medium">{formatCurrency(member.sales || 0)}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">New Accounts</div>
                                    <div className="font-medium">{member.newAccounts || 0}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Calls Made</div>
                                    <div className="font-medium">{member.calls || 0}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Meetings</div>
                                    <div className="font-medium">{member.meetings || 0}</div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/employee/${member.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Territory Details */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Territory Details</h2>
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

export default TeamPage;
