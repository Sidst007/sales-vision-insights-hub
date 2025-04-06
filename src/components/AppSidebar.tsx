
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
  User,
  UserCog
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.KAM]
  },
  {
    title: 'Data Input',
    path: '/data-input',
    icon: FileInput,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.SR, UserRole.KAM]
  },
  {
    title: 'Owner\'s Dashboard',
    path: '/owner-dashboard',
    icon: BarChart4,
    roles: [UserRole.ADMIN]
  },
  {
    title: 'Team Performance',
    path: '/team',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM]
  },
  {
    title: 'Team Hierarchy',
    path: '/team-hierarchy',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE]
  },
  {
    title: 'Employee Management',
    path: '/employee-management',
    icon: UserCog,
    roles: [UserRole.ADMIN]
  },
  {
    title: 'Sales Targets',
    path: '/targets',
    icon: Target,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.SR, UserRole.KAM]
  },
  {
    title: 'Compensation',
    path: '/compensation',
    icon: DollarSign,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.SR, UserRole.KAM]
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: Briefcase,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.KAM]
  },
  {
    title: 'Products',
    path: '/products',
    icon: ShoppingBag,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.SR, UserRole.KAM]
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.KAM]
  },
  {
    title: 'My Profile',
    path: '/profile',
    icon: User,
    roles: [UserRole.ADMIN, UserRole.TSM, UserRole.ASE, UserRole.ASM, UserRole.SR, UserRole.KAM]
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
        
        {user && (
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/20">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-white/70 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
        
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
