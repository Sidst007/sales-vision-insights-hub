
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercentage } from '@/utils/data-utils';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Calendar, Target, BarChart4, ArrowUpRight } from 'lucide-react';

// Sample data for performance history
const performanceHistory = [
  { month: "Jan", performance: 87 },
  { month: "Feb", performance: 92 },
  { month: "Mar", performance: 85 },
  { month: "Apr", performance: 91 },
  { month: "May", performance: 95 },
  { month: "Jun", performance: 88 },
];

// Sample data for achievements
const achievements = [
  { id: 1, title: "Top Sales Manager Q1 2023", date: "Mar 2023", description: "Exceeded Q1 targets by 15% through effective team management" },
  { id: 2, title: "Excellence in Customer Retention", date: "Dec 2022", description: "Maintained 95% client retention rate for the fiscal year" },
  { id: 3, title: "Team Development Award", date: "Sep 2022", description: "Successfully mentored 3 team members to promotion" },
];

const ProfileDetailPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  
  // In a real application, this would fetch data from a backend
  // For now, we're using a fake async operation with sample data
  useEffect(() => {
    // This simulates fetching the employee data
    const fetchEmployee = async () => {
      try {
        // Mock data for this demo
        const mockEmployees = [
          {
            id: "admin1",
            name: "Meera Joshi",
            email: "admin@example.com",
            role: "Administrator",
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
            role: "Territory Sales Manager",
            avatar: "https://i.pravatar.cc/300?img=11",
            region: "North",
            territory: "Delhi-NCR",
            phone: "+91 9876543210",
            address: "42 Rajouri Garden, New Delhi",
            joined: "2022-05-15",
            target: 500000,
            performance: 93,
            manager: "Meera Joshi",
            managerId: "admin1"
          },
          // Include other employees here...
        ];
        
        // Find the employee with the matching ID
        const employee = mockEmployees.find(emp => emp.id === employeeId);
        
        if (employee) {
          setProfileUser(employee as User);
        } else {
          // If no employee is found, show an error
          toast.error("Employee not found");
          navigate("/team");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Failed to load employee profile");
      }
    };
    
    fetchEmployee();
  }, [employeeId, navigate]);
  
  if (!profileUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="pb-8">
      <Header
        title="Employee Profile"
        subtitle="Detailed information about the employee"
        showBackButton
      />
      
      <div className="container mt-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{profileUser.name}</h2>
                <p className="text-muted-foreground">{profileUser.role}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                  {profileUser.email && (
                    <div className="flex items-center text-sm">
                      <Mail size={14} className="mr-1 text-muted-foreground" />
                      <span>{profileUser.email}</span>
                    </div>
                  )}
                  
                  {profileUser.phone && (
                    <div className="flex items-center text-sm">
                      <Phone size={14} className="mr-1 text-muted-foreground" />
                      <span>{profileUser.phone}</span>
                    </div>
                  )}
                  
                  {profileUser.joined && (
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-muted-foreground" />
                      <span>Joined {new Date(profileUser.joined).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Territory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{profileUser.territory || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground mt-1">{profileUser.region || 'N/A'} Region</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start">
                        <MapPin size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                        <p>{profileUser.address || 'No address provided'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Manager</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profileUser.manager ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{profileUser.manager.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{profileUser.manager}</span>
                          </div>
                          
                          {profileUser.managerId && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-sales-primary"
                              onClick={() => navigate(`/profile/${profileUser.managerId}`)}
                            >
                              <ArrowUpRight size={14} />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No manager assigned</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Sales Targets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">Annual Target</span>
                            <span className="text-sm font-medium">{formatCurrency(profileUser.target || 0)}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-sales-primary" 
                              style={{ width: `${profileUser.performance || 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs">{formatCurrency((profileUser.target || 0) * (profileUser.performance || 0) / 100)}</span>
                            <span className="text-xs text-sales-success font-medium">{formatPercentage(profileUser.performance || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-2 border-sales-primary pl-4 py-1">
                          <p className="text-sm font-medium">Completed monthly sales report</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <div className="border-l-2 border-sales-primary pl-4 py-1">
                          <p className="text-sm font-medium">Attended product training session</p>
                          <p className="text-xs text-muted-foreground">5 days ago</p>
                        </div>
                        <div className="border-l-2 border-sales-primary pl-4 py-1">
                          <p className="text-sm font-medium">Closed deal with Key Account</p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <div className="flex h-full">
                        {performanceHistory.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col justify-end items-center">
                            <div 
                              className="w-12 bg-sales-primary rounded-t-md" 
                              style={{ height: `${item.performance}%` }}
                            ></div>
                            <p className="text-xs mt-2">{item.month}</p>
                            <p className="text-xs text-muted-foreground">{item.performance}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Sales Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{formatPercentage(88)}</span>
                        <div className="p-2 rounded-full bg-green-100">
                          <Target size={20} className="text-green-600" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Conversion rate of leads to sales</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Customer Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{formatPercentage(92)}</span>
                        <div className="p-2 rounded-full bg-blue-100">
                          <BarChart4 size={20} className="text-blue-600" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Percentage of repeat customers</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">+{formatPercentage(15)}</span>
                        <div className="p-2 rounded-full bg-purple-100">
                          <ArrowUpRight size={20} className="text-purple-600" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Year-over-year growth rate</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {achievements.map((achievement, index) => (
                        <div key={achievement.id} className="relative">
                          {index < achievements.length - 1 && (
                            <span className="absolute top-8 left-4 w-0.5 h-full bg-gray-200"></span>
                          )}
                          <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-sales-primary flex items-center justify-center text-white">
                              <Trophy size={16} />
                            </div>
                            <div>
                              <h3 className="text-base font-medium">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{achievement.date}</p>
                              <p className="text-sm">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Training & Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <h3 className="text-base font-medium">Advanced Sales Techniques</h3>
                          <p className="text-sm text-muted-foreground">Completed July 2023</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <h3 className="text-base font-medium">Product Knowledge Master</h3>
                          <p className="text-sm text-muted-foreground">Completed March 2023</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <h3 className="text-base font-medium">Leadership Development Program</h3>
                          <p className="text-sm text-muted-foreground">Completed November 2022</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Missing icons components
const Trophy: React.FC<{ size: number }> = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const GraduationCap: React.FC<{ size: number }> = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
  </svg>
);

export default ProfileDetailPage;
