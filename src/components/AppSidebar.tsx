
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart4, 
  Users, 
  Target, 
  DollarSign, 
  Briefcase, 
  ShoppingBag, 
  FileText, 
  Settings, 
  Home,
  FileInput,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';

// Navigation item interface
interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

// Nav items for the sidebar
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.KAM, UserRole.ADMIN]
  },
  {
    title: 'Data Input',
    path: '/data-input',
    icon: FileInput,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.DSR, UserRole.KAM, UserRole.RSO, UserRole.ADMIN]
  },
  {
    title: 'Owner\'s Dashboard',
    path: '/owner-dashboard',
    icon: BarChart4,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.KAM, UserRole.ADMIN]
  },
  {
    title: 'Team Performance',
    path: '/team',
    icon: Users,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.KAM, UserRole.ADMIN]
  },
  {
    title: 'Sales Targets',
    path: '/targets',
    icon: Target,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.DSR, UserRole.KAM, UserRole.RSO, UserRole.ADMIN]
  },
  {
    title: 'Compensation',
    path: '/compensation',
    icon: DollarSign,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.DSR, UserRole.KAM, UserRole.RSO, UserRole.ADMIN]
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: Briefcase,
    roles: [UserRole.KAM, UserRole.TSM, UserRole.ADMIN]
  },
  {
    title: 'Products',
    path: '/products',
    icon: ShoppingBag,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.DSR, UserRole.KAM, UserRole.RSO, UserRole.ADMIN]
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: FileText,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.KAM, UserRole.ADMIN]
  },
  {
    title: 'My Profile',
    path: '/profile',
    icon: User,
    roles: [UserRole.TSM, UserRole.ASE, UserRole.DSR, UserRole.KAM, UserRole.RSO, UserRole.ADMIN]
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: [UserRole.ADMIN]
  }
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-4 flex justify-center items-center mb-4">
        <h1 className="text-white text-xl font-semibold">
          Sales<span className="text-white/70">Vision</span>
        </h1>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="flex justify-between items-center px-4 mb-4 md:hidden">
          <SidebarTrigger />
        </div>
        
        <div className="px-3">
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({isActive}) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-4">
        <Button 
          variant="outline" 
          className="w-full text-white bg-sidebar-accent/20 hover:bg-sidebar-accent/40"
          onClick={logout}
        >
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
