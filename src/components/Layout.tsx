
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';

const Layout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

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

  // Redirect employees to the data input page when they first log in
  if (user?.role === UserRole.DSR || user?.role === UserRole.RSO) {
    // We'll check if the user is trying to access a restricted page and redirect if needed
    const path = window.location.pathname;
    const employeeAllowedPaths = ['/data-input', '/profile', '/products'];
    const isAllowedPath = employeeAllowedPaths.some(allowedPath => path.startsWith(allowedPath));
    
    if (!isAllowedPath && path !== '/') {
      return <Navigate to="/data-input" replace />;
    }
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
