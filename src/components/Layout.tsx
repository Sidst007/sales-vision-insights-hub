
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';

const Layout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define role-based access paths
  const roleBasedPaths = {
    [UserRole.ADMIN]: ['/dashboard', '/owner-dashboard', '/team', '/team-hierarchy', '/targets', '/compensation', 
                       '/accounts', '/products', '/reports', '/profile', '/settings', '/comparison', 
                       '/employee', '/data-input', '/employee-management', '/profile', '/admin-data'],
    [UserRole.TSM]: ['/dashboard', '/team', '/team-hierarchy', '/targets', '/compensation', '/accounts', 
                    '/products', '/reports', '/profile', '/data-input', '/employee', '/profile'],
    [UserRole.ASE]: ['/dashboard', '/team', '/team-hierarchy', '/targets', '/compensation', '/products', 
                    '/reports', '/profile', '/data-input', '/employee', '/profile'],
    [UserRole.ASM]: ['/dashboard', '/team', '/targets', '/compensation', '/products', 
                    '/reports', '/profile', '/data-input', '/profile'],
    [UserRole.SR]: ['/data-input', '/profile', '/products', '/targets', '/compensation', '/profile'],
    [UserRole.KAM]: ['/dashboard', '/accounts', '/targets', '/compensation', '/products', 
                    '/reports', '/profile', '/data-input', '/profile']
  };

  // Check if user has access to current path
  useEffect(() => {
    if (isAuthenticated && user) {
      const userAllowedPaths = roleBasedPaths[user.role] || [];
      const currentPathBase = '/' + location.pathname.split('/')[1]; // Get base path

      if (!userAllowedPaths.some(path => currentPathBase.startsWith(path)) && 
          currentPathBase !== '/') {
        // Redirect to appropriate default page based on role
        if (user.role === UserRole.SR) {
          navigate('/data-input');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sales-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
