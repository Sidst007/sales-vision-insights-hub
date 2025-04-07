
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CustomProgress } from '@/components/ui/custom-progress';
import { UserRole, User } from '@/contexts/AuthContext';
import { formatPercentage, getPerformanceColor } from '@/utils/data-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OrganizationChartProps {
  employees: User[];
}

export const OrganizationChart: React.FC<OrganizationChartProps> = ({ employees }) => {
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Find admin
  const admin = employees.find(e => e.role === UserRole.ADMIN);
  
  // Function to toggle node expansion
  const toggleNodeExpansion = (id: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
    }
    setExpandedNodes(newExpandedNodes);
  };
  
  // Get direct reports for an employee
  const getDirectReports = (employeeId: string) => {
    return employees.filter(e => e.managerId === employeeId && e.isDottedLine !== true);
  };
  
  // Get KAM's connections (dotted lines)
  const getKAMConnections = () => {
    const kam = employees.find(e => e.role === UserRole.KAM);
    if (!kam) return [];
    
    // For visualization, we'll filter to just show ASEs with dotted lines to KAM
    return employees.filter(e => (e.role === UserRole.ASE));
  };
  
  // Check if node has children
  const hasChildren = (employeeId: string) => {
    return employees.some(e => e.managerId === employeeId);
  };
  
  // Get node count tooltip text
  const getNodeCountText = (employeeId: string) => {
    const directReports = getDirectReports(employeeId);
    if (directReports.length === 0) return "No direct reports";
    
    const roleCount: Record<string, number> = {};
    directReports.forEach(report => {
      const roleName = report.role;
      roleCount[roleName] = (roleCount[roleName] || 0) + 1;
    });
    
    return Object.entries(roleCount)
      .map(([role, count]) => `${count} ${role}${count > 1 ? 's' : ''}`)
      .join(', ');
  };
  
  // Render a node with its children
  const renderNode = (employee: User, level: number) => {
    const directReports = getDirectReports(employee.id);
    const isExpanded = expandedNodes.has(employee.id) || level <= 1; // Auto-expand first two levels
    const hasExpandableChildren = hasChildren(employee.id);
    
    // Different styling based on level
    const nodeSize = level === 0 
      ? 'w-52 h-32' 
      : level === 1 
        ? 'w-44 h-28' 
        : level === 2 
          ? 'w-40 h-24' 
          : 'w-36 h-22';
          
    const bgColor = level === 0 
      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' 
      : level === 1 
        ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200' 
        : level === 2 
          ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
          : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
    
    return (
      <div 
        className="flex flex-col items-center" 
        key={employee.id}
      >
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className={`${nodeSize} p-3 ${bgColor} shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between mx-2 mb-2 rounded-lg`}
                  onClick={() => navigate(`/employee/${employee.id}`)}
                >
                  <CardContent className="p-0 flex items-center h-full">
                    <div className="flex items-start w-full">
                      <Avatar className={level === 0 ? "h-12 w-12 mr-3 border-2 border-primary" : "h-10 w-10 mr-2"}>
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className={`font-medium truncate ${level === 0 ? 'text-base' : 'text-sm'}`}>
                          {employee.name}
                        </div>
                        <div className={`text-muted-foreground truncate ${level === 0 ? 'text-sm' : 'text-xs'}`}>
                          {employee.role}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {employee.email}
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
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">{employee.name}</div>
                <div className="text-xs">{employee.role}</div>
                <div className="text-xs">{employee.email}</div>
                {hasExpandableChildren && (
                  <div className="text-xs mt-1">
                    {getNodeCountText(employee.id)}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {hasExpandableChildren && (
            <button 
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-4 w-4 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-xs`}
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(employee.id);
              }}
            >
              {isExpanded ? "-" : "+"}
            </button>
          )}
        </div>
        
        {hasExpandableChildren && isExpanded && (
          <>
            <div className="w-px h-6 bg-muted-foreground/30" />
            
            <div className="relative">
              {directReports.length > 0 && (
                <>
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-[1px] bg-muted-foreground/30" />
                  
                  <div className="flex pt-4 flex-wrap justify-center">
                    {directReports.map((report, index) => (
                      <div key={report.id} className="flex flex-col items-center mx-1 mb-6">
                        {renderNode(report, level + 1)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  
  // Render KAM connections
  const renderKAMConnections = () => {
    const kam = employees.find(e => e.role === UserRole.KAM);
    if (!kam) return null;
    
    const connections = getKAMConnections();
    
    return (
      <div className="mt-8 p-4 border border-dashed border-orange-300 rounded-lg bg-orange-50 max-w-lg mx-auto">
        <h3 className="text-center text-orange-700 font-medium mb-2">KAM Operational Oversight</h3>
        <p className="text-sm text-center text-muted-foreground mb-4">
          {kam.name} (KAM) provides operational support to ASEs
        </p>
        
        <div className="flex flex-wrap justify-center gap-2">
          {connections.map(connection => (
            <div 
              key={`kam-connection-${connection.id}`}
              className="flex items-center border border-dashed border-orange-200 rounded px-2 py-1 bg-white"
            >
              <Avatar className="h-5 w-5 mr-1">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{connection.name}</span>
            </div>
          ))}
        </div>
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
          <Button 
            variant="outline" 
            onClick={() => setExpandedNodes(new Set())}
          >
            Collapse All
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const allIds = employees.map(e => e.id);
              setExpandedNodes(new Set(allIds));
            }}
          >
            Expand All
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center mb-16">
        {admin ? (
          renderNode(admin, 0)
        ) : (
          <div className="text-center text-muted-foreground">
            No organization hierarchy data available.
          </div>
        )}
      </div>
      
      {renderKAMConnections()}
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-sm mr-2"></div>
            <span>Admin</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-sm mr-2"></div>
            <span>TSM/KAM</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-sm mr-2"></div>
            <span>ASE</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-sm mr-2"></div>
            <span>ASM/SR</span>
          </div>
        </div>
        <p>Click on employee cards to view detailed profiles. Use + and - buttons to expand/collapse teams.</p>
      </div>
    </div>
  );
};
