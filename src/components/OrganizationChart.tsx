
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CustomProgress } from '@/components/ui/custom-progress';
import { UserRole, User } from '@/contexts/AuthContext';
import { formatPercentage, getPerformanceColor } from '@/utils/data-utils';

interface OrganizationChartProps {
  employees: User[];
}

export const OrganizationChart: React.FC<OrganizationChartProps> = ({ employees }) => {
  const navigate = useNavigate();
  
  // Find admin
  const admin = employees.find(e => e.role === UserRole.ADMIN);
  
  // Find TSMs (reports to admin)
  const tsms = employees.filter(e => e.role === UserRole.TSM);
  
  // Get direct reports for an employee
  const getDirectReports = (employeeId: string) => {
    return employees.filter(e => e.managerId === employeeId);
  };
  
  // Render a node with its children
  const renderNode = (employee: User, level: number) => {
    const directReports = getDirectReports(employee.id);
    const maxWidth = level === 0 ? 'max-w-xs' : 'max-w-[220px]';
    const sizeClass = level === 0 
      ? 'h-28 w-full' 
      : level === 1 
        ? 'h-24 w-full' 
        : level === 2 
          ? 'h-22 w-full' 
          : 'h-20 w-full';
    
    return (
      <div className="flex flex-col items-center" key={employee.id}>
        <div className={`${sizeClass} ${maxWidth} p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow mx-2`}>
          <div className="flex items-center h-full">
            <Avatar className={level === 0 ? "h-12 w-12 mr-3" : "h-8 w-8 mr-2"}>
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className={`font-medium truncate ${level === 0 ? 'text-base' : 'text-sm'}`}>
                {employee.name}
              </div>
              <div className={`text-muted-foreground truncate ${level === 0 ? 'text-sm' : 'text-xs'}`}>
                {employee.role}
              </div>
              {employee.performance !== undefined && (
                <div className="mt-1 flex items-center">
                  <div className="flex-1">
                    <CustomProgress 
                      value={employee.performance} 
                      className="h-1.5" 
                      indicatorClassName={getPerformanceColor(employee.performance, 100)}
                    />
                  </div>
                  <span className={`ml-2 text-xs ${getPerformanceColor(employee.performance, 100)}`}>
                    {formatPercentage(employee.performance)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {directReports.length > 0 && (
          <>
            <div className="w-px h-4 bg-muted-foreground/30" />
            
            <div className="relative">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-[1px] bg-muted-foreground/30" />
              
              <div className="flex pt-4">
                {directReports.map((report, index) => (
                  <div key={report.id} className="flex flex-col items-center">
                    {renderNode(report, level + 1)}
                    
                    {/* Add connecting line to the right if not last item */}
                    {index < directReports.length - 1 && (
                      <div className="absolute top-0 h-[1px] bg-muted-foreground/30" style={{
                        left: `${(index + 1) * (100 / directReports.length)}%`,
                        width: `${100 / directReports.length}%`
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full overflow-auto p-6">
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/employee-management')}
            className="ml-auto"
          >
            Manage Employees
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center">
        {admin ? (
          renderNode(admin, 0)
        ) : tsms.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="flex space-x-4">
              {tsms.map(tsm => renderNode(tsm, 0))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No organization hierarchy data available.
          </div>
        )}
      </div>
    </div>
  );
};
