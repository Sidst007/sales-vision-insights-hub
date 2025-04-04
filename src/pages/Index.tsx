
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-sales-lightest">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sales-primary"></div>
    </div>
  );
};

export default Index;
