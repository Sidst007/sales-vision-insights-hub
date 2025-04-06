
import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showHints, setShowHints] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const demoUsers = [
    { 
      role: UserRole.ADMIN, 
      email: 'admin@example.com',
      description: 'Full access to all features and dashboards'
    },
    { 
      role: UserRole.TSM, 
      email: 'tsm1@example.com',
      description: 'Manage territory sales teams and targets'
    },
    { 
      role: UserRole.ASE, 
      email: 'ase1@example.com',
      description: 'Handle area-level sales operations'
    },
    { 
      role: UserRole.ASM, 
      email: 'asm1@example.com',
      description: 'Manage sales teams within specific areas'
    },
    { 
      role: UserRole.SR, 
      email: 'sr1@example.com',
      description: 'Track individual sales performance and tasks'
    },
    { 
      role: UserRole.KAM, 
      email: 'kam@example.com',
      description: 'Manage key client accounts and relationships'
    }
  ];

  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sales-lightest to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">SalesVision</h1>
          <p className="text-muted-foreground">Insights Hub for FMCG Sales Teams</p>
        </div>
        
        <Card className="border-t-4 border-t-sales-primary shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs" 
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                  >
                    {showHints ? "Hide demo info" : "Show demo info"}
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="text-sales-danger text-sm font-medium">{error}</div>
              )}
              
              {showHints && (
                <div className="bg-sales-light rounded-md p-4 text-sm">
                  <Tabs defaultValue="admin">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="admin">Admin</TabsTrigger>
                      <TabsTrigger value="managers">Managers</TabsTrigger>
                      <TabsTrigger value="reps">Sales Reps</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="admin" className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-white/50 rounded hover:bg-white">
                        <div>
                          <p className="font-medium">{demoUsers[0].role}</p>
                          <p className="text-xs text-muted-foreground">{demoUsers[0].description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => setDemoCredentials(demoUsers[0].email)}
                        >
                          Use
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="managers" className="space-y-2">
                      {demoUsers.slice(1, 4).map((user, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white/50 rounded hover:bg-white">
                          <div>
                            <p className="font-medium">{user.role}</p>
                            <p className="text-xs text-muted-foreground">{user.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => setDemoCredentials(user.email)}
                          >
                            Use
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="reps" className="space-y-2">
                      {demoUsers.slice(4).map((user, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white/50 rounded hover:bg-white">
                          <div>
                            <p className="font-medium">{user.role}</p>
                            <p className="text-xs text-muted-foreground">{user.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => setDemoCredentials(user.email)}
                          >
                            Use
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                  
                  <p className="text-xs mt-2 text-center">
                    All demo accounts use password: <code className="bg-white px-1 py-0.5 rounded">password</code>
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full bg-sales-primary hover:bg-sales-dark" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    Sign In <ChevronRight size={16} />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
