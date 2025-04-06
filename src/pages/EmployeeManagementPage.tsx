
import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee, EmployeeStatus } from '@/common/types';

const EmployeeManagementPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | 'all'>('all');
  
  // Sample data for employees with status
  const employeeData: Employee[] = [
    {
      id: "admin1",
      name: "Meera Joshi",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      avatar: "https://i.pravatar.cc/300?img=8",
      region: "All",
      territory: "All",
      status: "active"
    },
    {
      id: "tsm1",
      name: "Rajesh Kumar",
      email: "tsm1@example.com",
      role: UserRole.TSM,
      avatar: "https://i.pravatar.cc/300?img=11",
      region: "North",
      territory: "Delhi-NCR",
      status: "active"
    },
    {
      id: "tsm2",
      name: "Anita Desai",
      email: "tsm2@example.com",
      role: UserRole.TSM,
      avatar: "https://i.pravatar.cc/300?img=1",
      region: "South",
      territory: "Bangalore",
      status: "active"
    },
    {
      id: "ase1",
      name: "Priya Sharma",
      email: "ase1@example.com",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=5",
      region: "North",
      territory: "Delhi",
      status: "active"
    },
    {
      id: "ase5",
      name: "Kavita Reddy",
      email: "ase5@example.com",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=3",
      region: "South",
      territory: "Mysore",
      status: "inactive"
    },
    {
      id: "asm3",
      name: "Prakash Mehta",
      email: "asm3@example.com",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=16",
      region: "North",
      territory: "Gurgaon East",
      status: "active"
    },
    {
      id: "sr4",
      name: "Divya Sharma",
      email: "sr4@example.com",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=7",
      region: "North",
      territory: "Delhi West Zone 2",
      status: "pending"
    },
    {
      id: "kam1",
      name: "Sunita Reddy",
      email: "kam@example.com",
      role: UserRole.KAM,
      avatar: "https://i.pravatar.cc/300?img=9",
      region: "East",
      territory: "Kolkata",
      status: "active"
    }
  ];
  
  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employeeData.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.territory.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = filterRole === 'all' || employee.role === filterRole;
      const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, filterRole, filterStatus, employeeData]);
  
  // Status badge component
  const StatusBadge = ({ status }: { status: EmployeeStatus }) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'inactive':
        return <Badge variant="destructive">{status}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return null;
    }
  };
  
  // Status icon component
  const StatusIcon = ({ status }: { status: EmployeeStatus }) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-secondary-foreground" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="pb-8">
      <Header 
        title="Employee Management" 
        subtitle="Manage your team members"
      />
      
      <div className="container mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, region, or territory..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-1">
                      Role: {filterRole === 'all' ? 'All' : filterRole}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterRole('all')}>All Roles</DropdownMenuItem>
                    {Object.values(UserRole).map((role) => (
                      <DropdownMenuItem key={role} onClick={() => setFilterRole(role)}>
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-1">
                      Status: {filterStatus === 'all' ? 'All' : filterStatus}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('active')}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>Inactive</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button className="flex gap-1">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Territory
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.territory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon status={employee.status} />
                          <span className="ml-1.5">
                            <StatusBadge status={employee.status} />
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredEmployees.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  No employees found matching your filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
