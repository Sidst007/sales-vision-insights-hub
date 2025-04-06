
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Edit, Trash2, ArrowUpDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/contexts/AuthContext';

// Sample employee data
const SAMPLE_EMPLOYEES = [
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
    id: "ase2",
    name: "Amit Patel",
    email: "ase2@example.com",
    role: UserRole.ASE,
    avatar: "https://i.pravatar.cc/300?img=12",
    region: "North",
    territory: "Gurgaon",
    status: "active"
  },
  {
    id: "sr1",
    name: "Rahul Saxena",
    email: "sr1@example.com",
    role: UserRole.SR,
    avatar: "https://i.pravatar.cc/300?img=18",
    region: "North",
    territory: "Delhi Central Zone 1",
    status: "inactive"
  },
];

// Employee interface
interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  region?: string;
  territory?: string;
  status: 'active' | 'inactive' | 'pending';
}

const EmployeeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(SAMPLE_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterRegion, setFilterRegion] = useState<string | 'all'>('all');
  
  // Form state for add/edit
  const [formState, setFormState] = useState<Partial<Employee>>({
    name: '',
    email: '',
    role: UserRole.SR,
    region: '',
    territory: '',
    status: 'active',
  });
  
  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter employees based on search, role, region, and status
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = currentTab === 'all' || 
                         (currentTab === 'active' && employee.status === 'active') ||
                         (currentTab === 'inactive' && employee.status === 'inactive') ||
                         (currentTab === 'pending' && employee.status === 'pending');
    
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    
    const matchesRegion = filterRegion === 'all' || employee.region === filterRegion;
    
    return matchesSearch && matchesStatus && matchesRole && matchesRegion;
  });
  
  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortField] && b[sortField]) {
      const valueA = a[sortField].toString().toLowerCase();
      const valueB = b[sortField].toString().toLowerCase();
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
    return 0;
  });
  
  // Handle sort change
  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Reset form state
  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      role: UserRole.SR,
      region: '',
      territory: '',
      status: 'active',
    });
  };
  
  // Open add dialog
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  // Open edit dialog
  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormState({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      region: employee.region,
      territory: employee.territory,
      status: employee.status,
    });
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select input change
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new employee
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name || !formState.email || !formState.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: formState.name || '',
      email: formState.email || '',
      role: formState.role as UserRole,
      region: formState.region,
      territory: formState.territory,
      status: formState.status as 'active' | 'inactive' | 'pending',
      avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
    };
    
    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    toast.success('Employee added successfully');
    resetForm();
  };
  
  // Update existing employee
  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) return;
    
    if (!formState.name || !formState.email || !formState.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id
        ? {
            ...emp,
            name: formState.name || emp.name,
            email: formState.email || emp.email,
            role: formState.role as UserRole || emp.role,
            region: formState.region,
            territory: formState.territory,
            status: formState.status as 'active' | 'inactive' | 'pending' || emp.status,
          }
        : emp
    );
    
    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    toast.success('Employee updated successfully');
    resetForm();
  };
  
  // Delete employee
  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteDialogOpen(false);
    toast.success('Employee deleted successfully');
  };
  
  // Get unique regions for filtering
  const uniqueRegions = Array.from(new Set(employees.map(emp => emp.region).filter(Boolean)));
  
  return (
    <div className="pb-8">
      <Header
        title="Employee Management"
        subtitle="Manage your team members"
      />
      
      <div className="container mt-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 pb-2">
            <CardTitle>Employees</CardTitle>
            <Button onClick={openAddDialog} className="bg-sales-primary">
              <Plus size={16} className="mr-1" /> Add Employee
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <TabsList>
                    <TabsTrigger value="all">All Employees</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search employees..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter size={14} className="mr-1" /> Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <div className="p-2">
                          <Label htmlFor="role-filter" className="text-xs">Role</Label>
                          <Select 
                            value={filterRole.toString()} 
                            onValueChange={(value) => setFilterRole(value as UserRole | 'all')}
                          >
                            <SelectTrigger id="role-filter" className="mt-1">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              {Object.values(UserRole).map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="p-2">
                          <Label htmlFor="region-filter" className="text-xs">Region</Label>
                          <Select 
                            value={filterRegion} 
                            onValueChange={setFilterRegion}
                          >
                            <SelectTrigger id="region-filter" className="mt-1">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Regions</SelectItem>
                              {uniqueRegions.map(region => (
                                <SelectItem key={region} value={region || ''}>{region}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setFilterRole('all');
                          setFilterRegion('all');
                        }}>
                          Reset Filters
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Tabs>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('name')}
                        >
                          Employee
                          {sortField === 'name' && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('role')}
                        >
                          Role
                          {sortField === 'role' && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('territory')}
                        >
                          Territory
                          {sortField === 'territory' && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('status')}
                        >
                          Status
                          {sortField === 'status' && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-4 text-center text-sm text-muted-foreground">
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      sortedEmployees.map(employee => (
                        <tr key={employee.id} className="hover:bg-muted/50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {employee.role}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {employee.territory ? (
                              <div>
                                <div>{employee.territory}</div>
                                {employee.region && (
                                  <div className="text-xs text-muted-foreground">{employee.region} Region</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                employee.status === 'active' ? 'default' : 
                                employee.status === 'inactive' ? 'destructive' : 
                                'outline'
                              }
                              className={
                                employee.status === 'active' ? 'bg-green-500' : 
                                employee.status === 'inactive' ? 'bg-red-500' : 
                                'bg-yellow-500'
                              }
                            >
                              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigate(`/profile/${employee.id}`)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditDialog(employee)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDeleteDialog(employee)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Create a new employee profile. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role *
                </Label>
                <Select
                  value={formState.role?.toString()}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Region
                </Label>
                <Input
                  id="region"
                  name="region"
                  value={formState.region}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="territory" className="text-right">
                  Territory
                </Label>
                <Input
                  id="territory"
                  name="territory"
                  value={formState.territory}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update the employee's information.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role *
                </Label>
                <Select
                  value={formState.role?.toString()}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger id="edit-role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-region" className="text-right">
                  Region
                </Label>
                <Input
                  id="edit-region"
                  name="region"
                  value={formState.region}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-territory" className="text-right">
                  Territory
                </Label>
                <Input
                  id="edit-territory"
                  name="territory"
                  value={formState.territory}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="edit-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagementPage;
