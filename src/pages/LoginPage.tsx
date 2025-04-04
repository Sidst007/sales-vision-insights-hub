
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
    { role: 'Territory Sales Manager', email: 'tsm@example.com' },
    { role: 'Area Sales Executive', email: 'ase@example.com' },
    { role: 'Distributor Sales Representative', email: 'dsr@example.com' },
    { role: 'Key Account Manager', email: 'kam@example.com' },
    { role: 'Retail Sales Officer', email: 'rso@example.com' },
    { role: 'Administrator', email: 'admin@example.com' }
  ];

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
                <div className="bg-sales-light rounded-md p-3 text-sm">
                  <p className="font-medium mb-1">Demo Information:</p>
                  <p className="text-xs mb-2">Use any of the following email addresses with password: <code className="bg-white px-1 py-0.5 rounded">password</code></p>
                  <ul className="space-y-1">
                    {demoUsers.map((user, index) => (
                      <li key={index} className="text-xs flex justify-between">
                        <span>{user.role}:</span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-sales-primary" 
                          type="button"
                          onClick={() => {
                            setEmail(user.email);
                            setPassword('password');
                          }}
                        >
                          {user.email}
                        </Button>
                      </li>
                    ))}
                  </ul>
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
