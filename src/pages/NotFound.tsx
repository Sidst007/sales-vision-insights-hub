
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-sales-primary mb-4">404</h1>
        <p className="text-xl text-sales-dark font-medium mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          Sorry, the page at <span className="font-medium text-sales-dark">{location.pathname}</span> could not be found.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            asChild
          >
            <Link to="/">
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </Link>
          </Button>
          
          <Button 
            className="bg-sales-primary hover:bg-sales-dark flex items-center gap-2" 
            asChild
          >
            <Link to="/dashboard">
              <Home size={16} />
              <span>Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
