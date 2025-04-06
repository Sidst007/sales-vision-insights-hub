
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div
     className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
     style={{
       backgroundImage: `url('asset\SalesVisionBackdrop.png')`, // path to your wave image
     }}
   >
     <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-10 text-center max-w-md">
        <h1 className="text-4xl font-bold text-sales-primary mb-2">SalesVision</h1>
        <p className="text-xl text-sales-dark mb-6">Insights Hub for FMCG Sales Teams</p>

        <p className="text-muted-foreground mb-8">
          Welcome to your comprehensive platform for tracking and analyzing sales performance in the
          Fast-Moving Consumer Goods industry.
        </p>

        <Button
          className="bg-sales-primary hover:bg-sales-dark flex items-center gap-2"
          size="lg"
          asChild
        >
          <Link to="/dashboard">
            <span>Go to Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
