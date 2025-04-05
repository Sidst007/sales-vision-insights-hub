
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { formatCurrency, formatPercentage } from '@/utils/data-utils';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Target, 
  TrendingUp,
  Shield
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditMode(false);
  };

  if (!user) {
    return <div>Please log in to view profile</div>;
  }

  return (
    <>
      <Header title="Profile" subtitle="View and manage your profile information" />
      
      <main className="dashboard-layout">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="text-sm">{user.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">ID: {user.id}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.address}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Joined: {user.joined}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Target</span>
                  </div>
                  <span className="font-medium">{formatCurrency(user.target || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Performance</span>
                  </div>
                  <span className={`font-medium ${
                    (user.performance || 0) >= 100 ? 'text-sales-success' : 
                    (user.performance || 0) >= 85 ? 'text-sales-warning' : 
                    'text-sales-danger'
                  }`}>
                    {formatPercentage(user.performance || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => setIsEditMode(true)}
              >
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          {/* Performance Metrics and Activity */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Performance Dashboard</CardTitle>
              <CardDescription>Your personal sales performance at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Sales Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-sales-primary">
                            {formatPercentage(user.performance || 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">vs Target</div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Sales Performance</DialogTitle>
                        <DialogDescription>
                          Detailed view of your performance compared to target
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="h-60">
                          {/* Performance Graph will be rendered here */}
                          <div className="flex items-center justify-center h-full bg-muted rounded-md">
                            <p className="text-muted-foreground">Performance Graph Visualization</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Current Performance:</span>
                            <span className="font-medium">{formatPercentage(user.performance || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Target:</span>
                            <span className="font-medium">{formatCurrency(user.target || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Month:</span>
                            <span className="font-medium">{formatPercentage(Math.random() * 10 + 90)}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Team Ranking</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-sales-primary">
                            #{Math.floor(Math.random() * 5) + 1}
                          </div>
                          <div className="text-sm text-muted-foreground">Out of 6 team members</div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Team Ranking</DialogTitle>
                        <DialogDescription>
                          Your position in the team performance ranking
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="h-60">
                          {/* Ranking Graph will be rendered here */}
                          <div className="flex items-center justify-center h-full bg-muted rounded-md">
                            <p className="text-muted-foreground">Team Ranking Visualization</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Your Rank:</span>
                              <span className="font-medium">#{Math.floor(Math.random() * 5) + 1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Top Performer:</span>
                              <span className="font-medium">Priya Sharma</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Performance Gap:</span>
                              <span className="font-medium">+7.5%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Monthly Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-sales-primary">
                            {formatPercentage(Math.random() * 10 + 85)}
                          </div>
                          <div className="text-sm text-muted-foreground">Month-to-date</div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Monthly Progress</DialogTitle>
                        <DialogDescription>
                          Your month-to-date performance metrics
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="h-60">
                          {/* Monthly Progress Graph will be rendered here */}
                          <div className="flex items-center justify-center h-full bg-muted rounded-md">
                            <p className="text-muted-foreground">Monthly Progress Visualization</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Current Month:</span>
                              <span className="font-medium">{formatPercentage(Math.random() * 10 + 85)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Previous Month:</span>
                              <span className="font-medium">{formatPercentage(Math.random() * 10 + 80)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Month-over-Month:</span>
                              <span className="font-medium text-sales-success">+5.2%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Peer Engagement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-sales-primary">
                            {Math.floor(Math.random() * 30) + 70}/100
                          </div>
                          <div className="text-sm text-muted-foreground">Engagement Score</div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Peer Engagement Score</DialogTitle>
                        <DialogDescription>
                          Your engagement metrics with team members
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="h-60">
                          {/* Peer Engagement Graph will be rendered here */}
                          <div className="flex items-center justify-center h-full bg-muted rounded-md">
                            <p className="text-muted-foreground">Peer Engagement Visualization</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Engagement Score:</span>
                              <span className="font-medium">{Math.floor(Math.random() * 30) + 70}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Team Average:</span>
                              <span className="font-medium">75/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Top Collaboration:</span>
                              <span className="font-medium">Arjun Singh</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Edit Profile Dialog */}
        <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default ProfilePage;
