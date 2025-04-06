
import React from 'react';
import { 
  Bell, 
  HelpCircle, 
  Download, 
  FileText,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showExport?: boolean;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showExport = false,
  showBackButton = false
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Exporting as ${format.toUpperCase()} file...`);
    // In a real app, this would trigger an actual export
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
        <div className="flex items-center">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download size={15} />
                  Export <ChevronDown size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText size={15} className="mr-2" /> Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileText size={15} className="mr-2" /> Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-sales-accent rounded-full" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <HelpCircle size={20} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
