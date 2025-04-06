
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  UserPlus,
  ChevronDown 
} from 'lucide-react';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Card
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatPercentage, getPerformanceColor } from '@/utils/data-utils';

const EmployeeManagementPage: React.FC = () => {
  const { user, users, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: UserRole.SR,
    managerId: '',
  });
  
  // Only admin can access this page
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Filter and search employees
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(term) || 
        emp.email.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (filterRole) {
      result = result.filter(emp => emp.role === filterRole);
    }
    
    setFilteredEmployees(result);
  }, [users, searchTerm, filterRole]);
  
  // Group employees by role for quick stats
  const tsms = users.filter(u => u.role === UserRole.TSM);
  const ases = users.filter(u => u.role === UserRole.ASE);
  const asms = users.filter(u => u.role === UserRole.ASM);
  
  // Handle selection of employees
  const toggleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };
  
  // Select all visible employees
  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };
  
  // Handle bulk delete
  const handleDelete = () => {
    // In a real app, this would call an API to delete the employees
    toast.success(`${selectedEmployees.length} employees deleted successfully`);
    setSelectedEmployees([]);
    setShowDeleteDialog(false);
  };
  
  // Handle adding a new employee
  const handleAddEmployee = () => {
    // In a real app, this would call an API to add the employee
    if (!newEmployee.name || !newEmployee.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Check if email is already in use
    if (users.some(u => u.email === newEmployee.email)) {
      toast.error("Email is already in use");
      return;
    }
    
    toast.success(`${newEmployee.name} added successfully as ${newEmployee.role}`);
    setNewEmployee({
      name: '',
      email: '',
      role: UserRole.SR,
      managerId: '',
    });
    setShowAddDialog(false);
  };
  
  // Get manager options based on role selection
  const getManagerOptions = () => {
    switch (newEmployee.role) {
      case UserRole.ASE:
      case UserRole.ASM:
        return users.filter(u => u.role === UserRole.TSM);
      case UserRole.SR:
        return users.filter(u => u.role === UserRole.ASM);
      default:
        return [];
    }
  };
  
  // Function to get employee's manager name
  const getManagerName = (managerId: string) => {
    const manager = users.find(u => u.id === managerId);
    return manager ? manager.name : 'None';
  };
  
  return (
    <div className="pb-8">
      <Header 
        title="Employee Management" 
        subtitle="Manage your team members and their roles" 
        showExport={true}
      />
      
      <div className="dashboard-layout">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-sales-light flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-sales-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Territory Managers</p>
              <p className="text-2xl font-bold">{tsms.length}</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Area Executives</p>
              <p className="text-2xl font-bold">{ases.length}</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Area Managers</p>
              <p className="text-2xl font-bold">{asms.length}</p>
            </div>
          </Card>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filterRole === null}
                  onCheckedChange={() => setFilterRole(null)}
                >
                  All Roles
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterRole === UserRole.ADMIN}
                  onCheckedChange={() => setFilterRole(UserRole.ADMIN)}
                >
                  Administrator
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterRole === UserRole.TSM}
                  onCheckedChange={() => setFilterRole(UserRole.TSM)}
                >
                  Territory Sales Manager
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterRole === UserRole.ASE}
                  onCheckedChange={() => setFilterRole(UserRole.ASE)}
                >
                  Area Sales Executive
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterRole === UserRole.ASM}
                  onCheckedChange={() => setFilterRole(UserRole.ASM)}
                >
                  Area Sales Manager
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterRole === UserRole.SR}
                  onCheckedChange={() => setFilterRole(UserRole.SR)}
                >
                  Sales Representative
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterRole === UserRole.KAM}
                  onCheckedChange={() => setFilterRole(UserRole.KAM)}
                >
                  Key Account Manager
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-sales-primary hover:bg-sales-dark flex gap-2">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Create a new employee profile. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      className="col-span-3"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      className="col-span-3"
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select 
                      value={newEmployee.role}
                      onValueChange={(value) => setNewEmployee({...newEmployee, role: value as UserRole})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.TSM}>Territory Sales Manager</SelectItem>
                        <SelectItem value={UserRole.ASE}>Area Sales Executive</SelectItem>
                        <SelectItem value={UserRole.ASM}>Area Sales Manager</SelectItem>
                        <SelectItem value={UserRole.SR}>Sales Representative</SelectItem>
                        <SelectItem value={UserRole.KAM}>Key Account Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(newEmployee.role === UserRole.ASE || 
                    newEmployee.role === UserRole.ASM || 
                    newEmployee.role === UserRole.SR) && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="manager" className="text-right">
                        Manager
                      </Label>
                      <Select 
                        value={newEmployee.managerId}
                        onValueChange={(value) => setNewEmployee({...newEmployee, managerId: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {getManagerOptions().map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowAddDialog(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee} className="bg-sales-primary hover:bg-sales-dark">
                    Add Employee
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {selectedEmployees.length > 0 && (
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {selectedEmployees.length} selected employee(s)? 
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button onClick={() => setShowDeleteDialog(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="destructive">
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        {/* Employee Table */}
        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-sales-primary"
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 text-sales-primary"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleSelectEmployee(employee.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{employee.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.managerId ? getManagerName(employee.managerId) : 'None'}</TableCell>
                      <TableCell>
                        <div className={`text-sm font-medium ${getPerformanceColor(employee.performance || 0, 100, true)}`}>
                          {formatPercentage(employee.performance || 0)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/profile/${employee.id}`)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleSelectEmployee(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-sales-danger" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
