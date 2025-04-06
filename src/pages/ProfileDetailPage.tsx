
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CustomProgress } from '@/components/ui/custom-progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPercentage, formatCurrency, getPerformanceColor } from '@/utils/data-utils';
import { generateTeamData, generateMonthlySalesData } from '@/data/mockData';
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
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar, 
  Award, 
  TrendingUp,
  Users,
  Settings,
  UserCog,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ProfileDetailPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get all employees
  const allEmployees = generateTeamData();
  
  // Find the employee with the given ID
  const employee = allEmployees.find(emp => emp.id === employeeId);
  
  // Find direct reports
  const directReports = allEmployees.filter(emp => emp.managerId === employeeId);
  
  // Generate performance data for charts
  const performanceData = generateMonthlySalesData();
  
  // Generate activity data
  const activityData = [
    { day: 'Mon', calls: 15, meetings: 3, sales: 7500 },
    { day: 'Tue', calls: 22, meetings: 5, sales: 12000 },
    { day: 'Wed', calls: 18, meetings: 4, sales: 9300 },
    { day: 'Thu', calls: 25, meetings: 6, sales: 15000 },
    { day: 'Fri', calls: 20, meetings: 4, sales: 11000 },
  ];
  
  // Check if the current user has permission to view this profile
  const canViewProfile = () => {
    if (!user || !employee) return false;
    
    if (user.role === UserRole.ADMIN) return true;
    if (user.id === employeeId) return true;
    if (user.role === UserRole.TSM && employee.managerId === user.id) return true;
    if (user.role === UserRole.ASE && employee.managerId === user.id) return true;
    
    return false;
  };
  
  if (!employee) {
    return (
      <>
        <Header title="Employee Not Found" subtitle="The requested employee profile could not be found" />
        <main className="p-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <User className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Employee Not Found</h2>
              <p className="text-muted-foreground text-center max-w-md">
                The employee profile you are looking for does not exist or has been removed.
              </p>
              <Button className="mt-4" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  
  if (!canViewProfile()) {
    return (
      <>
        <Header title="Access Restricted" subtitle="You don't have permission to view this profile" />
        <main className="p-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <UserCog className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Access Restricted</h2>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have permission to view this employee profile.
                Please contact your administrator for assistance.
              </p>
              <Button className="mt-4" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title={employee.name} 
        subtitle={`${employee.role} - ${employee.region || 'No Region'}`} 
        showBackButton
      />
      
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{employee.name}</h2>
                  <p className="text-muted-foreground">{employee.role}</p>
                  
                  <div className="w-full mt-6 space-y-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                    
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.address}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.territory || 'No Territory'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Joined: {employee.joined || 'N/A'}</span>
                    </div>
                    
                    {employee.manager && (
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Manager: {employee.manager}</span>
                      </div>
                    )}
                  </div>
                  
                  {(user?.role === UserRole.ADMIN || user?.id === employeeId) && (
                    <Button variant="outline" className="mt-6 w-full" onClick={() => navigate('/profile')}>
                      <Settings className="h-4 w-4 mr-2" />
                      {user?.id === employeeId ? 'Edit Profile' : 'Edit Employee'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Summary Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Target Completion</span>
                    <span className={getPerformanceColor(employee.performance || 0, 100)}>
                      {formatPercentage(employee.performance || 0)}
                    </span>
                  </div>
                  <CustomProgress 
                    value={employee.performance || 0} 
                    className="h-2" 
                    indicatorClassName={
                      (employee.performance || 0) >= 100 ? "bg-sales-success" :
                      (employee.performance || 0) >= 85 ? "bg-sales-warning" :
                      "bg-sales-danger"
                    }
                  />
                </div>
                
                <div className="pt-2 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sales Target</span>
                    <span className="text-sm font-medium">₹{employee.target?.toLocaleString() || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Sales</span>
                    <span className="text-sm font-medium">₹{(employee.sales || 0).toLocaleString()}</span>
                  </div>
                  
                  {employee.newAccounts !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">New Accounts</span>
                      <span className="text-sm font-medium">{employee.newAccounts}</span>
                    </div>
                  )}
                  
                  {employee.calls !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Calls Made</span>
                      <span className="text-sm font-medium">{employee.calls}</span>
                    </div>
                  )}
                  
                  {employee.meetings !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Meetings</span>
                      <span className="text-sm font-medium">{employee.meetings}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Award className="h-8 w-8 text-sales-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{formatPercentage(employee.performance || 0)}</div>
                        <div className="text-sm text-muted-foreground">Performance</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-sales-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">₹{(employee.sales || 0).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Sales</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="h-8 w-8 text-sales-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{directReports.length}</div>
                        <div className="text-sm text-muted-foreground">Direct Reports</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Sales performance over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={performanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales" name="Sales" fill="#0F52BA" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="target" name="Target" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {directReports.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Overview</CardTitle>
                      <CardDescription>Direct reports and their performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {directReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={report.avatar} alt={report.name} />
                                <AvatarFallback>{report.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{report.name}</div>
                                <div className="text-sm text-muted-foreground">{report.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-4">
                                <div className={cn(
                                  "text-sm font-medium",
                                  getPerformanceColor(report.performance || 0, 100)
                                )}>
                                  {formatPercentage(report.performance || 0)}
                                </div>
                                <div className="text-xs text-muted-foreground">vs Target</div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => navigate(`/employee/${report.id}`)}>
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>Detailed performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-base font-medium mb-4">Performance Summary</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Overall Target Completion</span>
                              <span className={getPerformanceColor(employee.performance || 0, 100)}>
                                {formatPercentage(employee.performance || 0)}
                              </span>
                            </div>
                            <CustomProgress 
                              value={employee.performance || 0} 
                              className="h-2" 
                              indicatorClassName={
                                (employee.performance || 0) >= 100 ? "bg-sales-success" :
                                (employee.performance || 0) >= 85 ? "bg-sales-warning" :
                                "bg-sales-danger"
                              }
                            />
                          </div>
                          
                          <div className="pt-4 space-y-3">
                            <div className="flex justify-between items-center py-1">
                              <span className="text-sm">Sales Target</span>
                              <span className="text-sm font-medium">₹{employee.target?.toLocaleString() || 0}</span>
                            </div>
                            
                            <div className="flex justify-between items-center py-1 border-t">
                              <span className="text-sm">Current Sales</span>
                              <span className="text-sm font-medium">₹{(employee.sales || 0).toLocaleString()}</span>
                            </div>
                            
                            <div className="flex justify-between items-center py-1 border-t">
                              <span className="text-sm">Remaining Target</span>
                              <span className="text-sm font-medium">
                                ₹{((employee.target || 0) - (employee.sales || 0)).toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center py-1 border-t">
                              <span className="text-sm">Performance Rating</span>
                              <Badge className={cn(
                                (employee.performance || 0) >= 100 ? "bg-sales-success" :
                                (employee.performance || 0) >= 85 ? "bg-sales-warning" :
                                "bg-sales-danger"
                              )}>
                                {(employee.performance || 0) >= 100 ? "Excellent" :
                                 (employee.performance || 0) >= 85 ? "Good" : "Needs Improvement"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-medium mb-4">Activity Metrics</h3>
                        <div className="space-y-3">
                          {employee.calls !== undefined && (
                            <div className="flex justify-between items-center p-2 border rounded-md">
                              <div className="flex items-center">
                                <div className="rounded-full p-2 bg-blue-100 mr-3">
                                  <Phone className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-sm">Calls Made</span>
                              </div>
                              <span className="text-sm font-medium">{employee.calls}</span>
                            </div>
                          )}
                          
                          {employee.meetings !== undefined && (
                            <div className="flex justify-between items-center p-2 border rounded-md">
                              <div className="flex items-center">
                                <div className="rounded-full p-2 bg-green-100 mr-3">
                                  <Users className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-sm">Meetings</span>
                              </div>
                              <span className="text-sm font-medium">{employee.meetings}</span>
                            </div>
                          )}
                          
                          {employee.newAccounts !== undefined && (
                            <div className="flex justify-between items-center p-2 border rounded-md">
                              <div className="flex items-center">
                                <div className="rounded-full p-2 bg-purple-100 mr-3">
                                  <Building className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="text-sm">New Accounts</span>
                              </div>
                              <span className="text-sm font-medium">{employee.newAccounts}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-80 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={performanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            name="Actual" 
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
              </TabsContent>
              
              {/* Team Tab */}
              <TabsContent value="team" className="mt-6">
                {directReports.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        Employees reporting directly to {employee.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {directReports.map((report) => (
                            <Card key={report.id} className="overflow-hidden">
                              <div className="p-4">
                                <div className="flex flex-col items-center text-center">
                                  <Avatar className="h-16 w-16 mb-3">
                                    <AvatarImage src={report.avatar} alt={report.name} />
                                    <AvatarFallback>{report.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <h3 className="font-medium">{report.name}</h3>
                                  <p className="text-sm text-muted-foreground">{report.role}</p>
                                  
                                  <div className="w-full mt-4">
                                    <div className="flex justify-between mb-1 text-sm">
                                      <span>Performance</span>
                                      <span className={getPerformanceColor(report.performance || 0, 100)}>
                                        {formatPercentage(report.performance || 0)}
                                      </span>
                                    </div>
                                    <CustomProgress 
                                      value={report.performance || 0} 
                                      className="h-1.5" 
                                      indicatorClassName={
                                        (report.performance || 0) >= 100 ? "bg-sales-success" :
                                        (report.performance || 0) >= 85 ? "bg-sales-warning" :
                                        "bg-sales-danger"
                                      }
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 w-full mt-4 text-sm">
                                    <div className="text-left">
                                      <span className="text-muted-foreground">Region:</span>
                                    </div>
                                    <div className="text-right">
                                      <span>{report.region}</span>
                                    </div>
                                    
                                    <div className="text-left">
                                      <span className="text-muted-foreground">Sales:</span>
                                    </div>
                                    <div className="text-right">
                                      <span>₹{(report.sales || 0).toLocaleString()}</span>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-4 w-full"
                                    onClick={() => navigate(`/employee/${report.id}`)}
                                  >
                                    View Profile
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Team Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={directReports.map(report => ({
                                    name: report.name.split(' ')[0],
                                    performance: report.performance || 0,
                                    target: 100
                                  }))}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis domain={[0, 120]} />
                                  <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Performance']}
                                    labelFormatter={(name) => `Employee: ${name}`}
                                  />
                                  <Bar dataKey="performance" name="Performance %" radius={[4, 4, 0, 0]}>
                                    {directReports.map((_, index) => (
                                      <Cell key={`cell-${index}`} fill={
                                        (directReports[index].performance || 0) >= 100 ? "#4CAF50" :
                                        (directReports[index].performance || 0) >= 85 ? "#FFC107" : "#FF6B6B"
                                      } />
                                    ))}
                                  </Bar>
                                  <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} fill="#1A3A6A" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                      <Users className="w-16 h-16 text-muted-foreground mb-4" />
                      <h2 className="text-xl font-medium mb-2">No Team Members</h2>
                      <p className="text-muted-foreground text-center max-w-md">
                        {employee.name} does not have any direct reports at this time.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Activity</CardTitle>
                    <CardDescription>Weekly activity tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={activityData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                            name="Sales (₹)" 
                            stroke="#FF6B6B" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                              {activityData.reduce((sum, day) => sum + day.calls, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Weekly Calls</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                              {activityData.reduce((sum, day) => sum + day.meetings, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Weekly Meetings</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                              ₹{activityData.reduce((sum, day) => sum + day.sales, 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Weekly Sales</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileDetailPage;
