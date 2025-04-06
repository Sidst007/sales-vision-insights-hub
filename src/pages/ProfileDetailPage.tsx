
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User as LucideUser,
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Award,
  Briefcase,
  Target,
  Clock
} from 'lucide-react';
import { useAuth, User } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CustomProgress } from '@/components/ui/custom-progress';
import { 
  formatCurrency, 
  formatPercentage, 
  formatNumber,
  getPerformanceColor 
} from '@/utils/data-utils';

interface ExtendedUser extends User {
  address?: string;
  phone?: string;
  joined?: string;
  position?: string;
  education?: string;
  experience?: string[];
  achievements?: string[];
  skills?: { name: string; proficiency: number }[];
  targets?: { name: string; achieved: number; target: number }[];
}

const ProfileDetailPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user: currentUser, users } = useAuth();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the employee from the users list
    if (users.length) {
      const foundEmployee = users.find(u => u.id === employeeId);
      
      if (foundEmployee) {
        // Extend the user with additional profile data
        // In a real app, this would come from an API
        const extendedEmployee: ExtendedUser = {
          ...foundEmployee,
          address: "42B, Vikram Vihar, Delhi NCR, India",
          phone: "+91 98765 43210",
          joined: "January 15, 2020",
          position: "Sales Executive",
          education: "MBA in Marketing, Delhi University",
          experience: [
            "Senior Sales Representative at TechCorp (2017-2020)",
            "Marketing Intern at GrowthFirst (2016-2017)"
          ],
          achievements: [
            "Top Performer Award 2022",
            "Exceeded quarterly targets by 35% in Q2 2023",
            "Successfully launched 3 new product lines"
          ],
          skills: [
            { name: "Negotiation", proficiency: 92 },
            { name: "Product Knowledge", proficiency: 88 },
            { name: "Team Leadership", proficiency: 75 },
            { name: "CRM Software", proficiency: 85 }
          ],
          targets: [
            { name: "Revenue", achieved: 3250000, target: 3500000 },
            { name: "New Accounts", achieved: 28, target: 30 },
            { name: "Client Retention", achieved: 92, target: 95 }
          ]
        };
        
        setEmployee(extendedEmployee);
      }
      setLoading(false);
    }
  }, [employeeId, users]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-sales-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!employee) {
    return <div className="dashboard-layout">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Employee Not Found</h2>
        <p className="text-muted-foreground mt-2">The employee you're looking for doesn't exist or you don't have permission to view this profile.</p>
        <button 
          className="mt-4 px-4 py-2 bg-sales-primary text-white rounded-md"
          onClick={() => navigate('/team')}
        >
          Return to Team
        </button>
      </div>
    </div>;
  }
  
  return (
    <div className="pb-8">
      <Header 
        title={employee.name} 
        subtitle={employee.role} 
        showBackButton={true}
      />
      
      <div className="dashboard-layout">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-sales-primary to-sales-secondary"></div>
              <div className="relative px-6">
                <Avatar className="h-24 w-24 border-4 border-white absolute -top-12">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="pt-16 pb-6">
                  <h3 className="text-xl font-bold">{employee.name}</h3>
                  <p className="text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <Separator />
              <CardContent className="p-6 space-y-4">
                {employee.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Address</p>
                      <p className="text-sm">{employee.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Email</p>
                    <p className="text-sm">{employee.email}</p>
                  </div>
                </div>
                {employee.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Phone</p>
                      <p className="text-sm">{employee.phone}</p>
                    </div>
                  </div>
                )}
                {employee.joined && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Joined</p>
                      <p className="text-sm">{employee.joined}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {employee.skills && employee.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{skill.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <CustomProgress 
                        value={skill.proficiency} 
                        className="h-2" 
                        indicatorClassName="bg-sales-primary"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Column - Tabs and Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Position & Education */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Background</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {employee.position && (
                        <div className="flex gap-3">
                          <Briefcase className="h-5 w-5 text-sales-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Current Position</p>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                        </div>
                      )}
                      {employee.education && (
                        <div className="flex gap-3">
                          <Award className="h-5 w-5 text-sales-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Education</p>
                            <p className="text-sm text-muted-foreground">{employee.education}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Work Experience */}
                {employee.experience && employee.experience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Work Experience</CardTitle>
                      <CardDescription>Previous roles and positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {employee.experience.map((exp, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="w-1 bg-sales-primary rounded-full flex-shrink-0"></div>
                            <div>
                              <p className="text-sm">{exp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Achievements */}
                {employee.achievements && employee.achievements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Achievements</CardTitle>
                      <CardDescription>Notable accomplishments and recognition</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {employee.achievements.map((achievement, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sales-light text-sales-primary text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm">{achievement}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-6 mt-6">
                {/* Current Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Overview</CardTitle>
                    <CardDescription>Current quarter performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">Overall Performance</p>
                          <p className="text-3xl font-bold">
                            {formatPercentage(employee.performance || 0)}
                          </p>
                        </div>
                        <div className="w-full sm:w-2/3">
                          <CustomProgress 
                            value={employee.performance || 0} 
                            className="h-3"
                            indicatorClassName={getPerformanceColor(employee.performance || 0, 100)}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {employee.targets && employee.targets.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Current Targets</h4>
                          {employee.targets.map((target, index) => {
                            const progress = (target.achieved / target.target) * 100;
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-sales-primary" />
                                    <p className="text-sm">{target.name}</p>
                                  </div>
                                  <div className="text-sm font-medium">
                                    {target.name === 'Revenue' 
                                      ? `${formatCurrency(target.achieved)} / ${formatCurrency(target.target)}`
                                      : `${formatNumber(target.achieved)} / ${formatNumber(target.target)}`
                                    }
                                  </div>
                                </div>
                                <CustomProgress 
                                  value={progress} 
                                  className="h-2"
                                  indicatorClassName={getPerformanceColor(progress, 100)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Performance History (This would typically be a chart) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance History</CardTitle>
                    <CardDescription>Performance trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border rounded-md bg-muted/10">
                      <p className="text-muted-foreground">Performance chart would appear here in a complete implementation</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity Timeline</CardTitle>
                    <CardDescription>Recent activities and notable events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-sales-light flex items-center justify-center">
                              <Clock className="h-5 w-5 text-sales-primary" />
                            </div>
                            {item < 4 && <div className="h-full w-0.5 bg-sales-light absolute top-10"></div>}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex justify-between mb-1">
                              <p className="text-sm font-medium">Example Activity {item}</p>
                              <p className="text-xs text-muted-foreground">3 days ago</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              This is a placeholder for activity details. In a real application, 
                              this would show actual user activity like completed sales, training,
                              meetings, or other notable events.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
