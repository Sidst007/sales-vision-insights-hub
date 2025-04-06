
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth, UserRole, User } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Search,
  User as UserIcon, 
  Users,
  UserPlus,
  Edit,
  Trash,
  Check,
  X
} from 'lucide-react';
import { generateTeamData } from '@/data/mockData';

const EmployeeManagementPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isNewEmployeeDialogOpen, setIsNewEmployeeDialogOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState<User | null>(null);
  
  // Get all employees
  const allEmployees = generateTeamData();
  
  // Filter employees based on search query and current tab
  const filteredEmployees = allEmployees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.region?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && employee.role === getUserRoleFromTab(currentTab);
  });
  
  // Get user role from tab name
  const getUserRoleFromTab = (tabName: string): UserRole => {
    switch (tabName) {
      case 'admin': return UserRole.ADMIN;
      case 'tsm': return UserRole.TSM;
      case 'ase': return UserRole.ASE;
      case 'asm': return UserRole.ASM;
      case 'sr': return UserRole.SR;
      case 'kam': return UserRole.KAM;
      default: return UserRole.SR;
    }
  };
  
  // Handle edit employee
  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      region: employee.region,
      territory: employee.territory,
      phone: employee.phone,
      address: employee.address,
      target: employee.target,
      managerId: employee.managerId
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle new employee
  const handleNewEmployee = () => {
    setSelectedEmployee(null);
    setEditFormData({
      name: '',
      email: '',
      role: UserRole.SR,
      region: '',
      territory: '',
      phone: '',
      address: '',
      target: 100000,
      managerId: ''
    });
    setIsNewEmployeeDialogOpen(true);
  };
  
  // Handle save employee
  const handleSaveEmployee = () => {
    if (selectedEmployee) {
      // In a real app, this would update the employee in the database
      toast.success(`Employee ${editFormData.name} updated successfully`);
    } else {
      // In a real app, this would create a new employee in the database
      toast.success(`New employee ${editFormData.name} created successfully`);
    }
    setIsEditDialogOpen(false);
    setIsNewEmployeeDialogOpen(false);
  };
  
  // Handle delete employee
  const handleDeleteEmployee = (employee: User) => {
    setDeleteConfirmEmployee(employee);
  };
  
  // Confirm delete employee
  const confirmDeleteEmployee = () => {
    // In a real app, this would delete the employee from the database
    toast.success(`Employee ${deleteConfirmEmployee?.name} deleted successfully`);
    setDeleteConfirmEmployee(null);
  };
  
  // Get potential managers based on role
  const getPotentialManagers = (role: UserRole): User[] => {
    switch (role) {
      case UserRole.SR:
        return allEmployees.filter(e => e.role === UserRole.ASM);
      case UserRole.ASM:
        return allEmployees.filter(e => e.role === UserRole.ASE);
      case UserRole.ASE:
        return allEmployees.filter(e => e.role === UserRole.TSM);
      default:
        return [];
    }
  };
  
  // Check if user is admin
  const isAdmin = user?.role === UserRole.ADMIN;
  
  if (!isAdmin) {
    return (
      <>
        <Header title="Employee Management" subtitle="Manage all employee profiles and information" />
        <main className="p-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <UserIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Access Restricted</h2>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have permission to access the employee management system. 
                Please contact your administrator for assistance.
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Header title="Employee Management" subtitle="Manage all employee profiles and information" />
      
      <main className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Employee Directory</CardTitle>
              <Button onClick={handleNewEmployee}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
            <CardDescription>Manage and organize your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="all" className="w-fit" onValueChange={setCurrentTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tsm">TSM</TabsTrigger>
                  <TabsTrigger value="ase">ASE</TabsTrigger>
                  <TabsTrigger value="asm">ASM</TabsTrigger>
                  <TabsTrigger value="sr">SR</TabsTrigger>
                  <TabsTrigger value="kam">KAM</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Territory</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Users className="h-8 w-8 mb-2" />
                          <p>No employees found matching your search criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-xs text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.region}</TableCell>
                        <TableCell>{employee.territory}</TableCell>
                        <TableCell>₹{employee.target?.toLocaleString()}</TableCell>
                        <TableCell>{employee.manager || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Hierarchy</CardTitle>
              <CardDescription>Organizational structure overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Territory Sales Managers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {allEmployees.filter(e => e.role === UserRole.TSM).map((tsm) => (
                      <Card key={tsm.id} className="p-3 shadow-sm">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={tsm.avatar} alt={tsm.name} />
                            <AvatarFallback>{tsm.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{tsm.name}</div>
                            <div className="text-xs text-muted-foreground">{tsm.region}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Area Sales Executives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {allEmployees.filter(e => e.role === UserRole.ASE).map((ase) => (
                      <Card key={ase.id} className="p-3 shadow-sm">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={ase.avatar} alt={ase.name} />
                            <AvatarFallback>{ase.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{ase.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Reports to: {ase.manager}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Employee performance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['TSM', 'ASE', 'ASM', 'SR', 'KAM'].map((role) => {
                  const roleEmployees = allEmployees.filter(
                    e => e.role === ('UserRole.' + role) as UserRole
                  );
                  
                  if (roleEmployees.length === 0) return null;
                  
                  const avgPerformance = roleEmployees.reduce(
                    (acc, curr) => acc + (curr.performance || 0), 0
                  ) / roleEmployees.length;
                  
                  const bestPerformer = roleEmployees.reduce(
                    (best, curr) => (!best || (curr.performance || 0) > (best.performance || 0)) ? curr : best, 
                    null as (User | null)
                  );
                  
                  return (
                    <div key={role} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{role}</h3>
                        <p className="text-sm text-muted-foreground">
                          {roleEmployees.length} employees
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Avg: {avgPerformance.toFixed(1)}%</div>
                        {bestPerformer && (
                          <p className="text-sm text-muted-foreground">
                            Top: {bestPerformer.name} ({bestPerformer.performance}%)
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={editFormData.name || ''} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={editFormData.email || ''} 
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={editFormData.role} 
                  onValueChange={(value) => setEditFormData({...editFormData, role: value as UserRole})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={UserRole.TSM}>Territory Sales Manager</SelectItem>
                    <SelectItem value={UserRole.ASE}>Area Sales Executive</SelectItem>
                    <SelectItem value={UserRole.ASM}>Area Sales Manager</SelectItem>
                    <SelectItem value={UserRole.SR}>Sales Representative</SelectItem>
                    <SelectItem value={UserRole.KAM}>Key Account Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select 
                  value={editFormData.managerId || ''} 
                  onValueChange={(value) => setEditFormData({...editFormData, managerId: value})}
                  disabled={!editFormData.role || [UserRole.ADMIN, UserRole.TSM].includes(editFormData.role as UserRole)}
                >
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {editFormData.role && getPotentialManagers(editFormData.role as UserRole).map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} ({manager.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input 
                  id="region" 
                  value={editFormData.region || ''} 
                  onChange={(e) => setEditFormData({...editFormData, region: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="territory">Territory</Label>
                <Input 
                  id="territory" 
                  value={editFormData.territory || ''} 
                  onChange={(e) => setEditFormData({...editFormData, territory: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={editFormData.phone || ''} 
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target">Target (₹)</Label>
                <Input 
                  id="target" 
                  type="number"
                  value={editFormData.target || 0} 
                  onChange={(e) => setEditFormData({...editFormData, target: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={editFormData.address || ''} 
                onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Employee Dialog */}
      <Dialog open={isNewEmployeeDialogOpen} onOpenChange={setIsNewEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter the details for the new employee
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input 
                  id="new-name" 
                  value={editFormData.name || ''} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input 
                  id="new-email" 
                  type="email"
                  value={editFormData.email || ''} 
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select 
                  value={editFormData.role} 
                  onValueChange={(value) => setEditFormData({...editFormData, role: value as UserRole})}
                >
                  <SelectTrigger id="new-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={UserRole.TSM}>Territory Sales Manager</SelectItem>
                    <SelectItem value={UserRole.ASE}>Area Sales Executive</SelectItem>
                    <SelectItem value={UserRole.ASM}>Area Sales Manager</SelectItem>
                    <SelectItem value={UserRole.SR}>Sales Representative</SelectItem>
                    <SelectItem value={UserRole.KAM}>Key Account Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-manager">Manager</Label>
                <Select 
                  value={editFormData.managerId || ''} 
                  onValueChange={(value) => setEditFormData({...editFormData, managerId: value})}
                  disabled={!editFormData.role || [UserRole.ADMIN, UserRole.TSM].includes(editFormData.role as UserRole)}
                >
                  <SelectTrigger id="new-manager">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {editFormData.role && getPotentialManagers(editFormData.role as UserRole).map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} ({manager.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-region">Region</Label>
                <Input 
                  id="new-region" 
                  value={editFormData.region || ''} 
                  onChange={(e) => setEditFormData({...editFormData, region: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-territory">Territory</Label>
                <Input 
                  id="new-territory" 
                  value={editFormData.territory || ''} 
                  onChange={(e) => setEditFormData({...editFormData, territory: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input 
                  id="new-phone" 
                  value={editFormData.phone || ''} 
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-target">Target (₹)</Label>
                <Input 
                  id="new-target" 
                  type="number"
                  value={editFormData.target || 0} 
                  onChange={(e) => setEditFormData({...editFormData, target: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-address">Address</Label>
              <Input 
                id="new-address" 
                value={editFormData.address || ''} 
                onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEmployeeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee}>
              Create Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmEmployee} onOpenChange={(open) => !open && setDeleteConfirmEmployee(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteConfirmEmployee && (
            <div className="py-4">
              <div className="flex items-center p-3 border rounded-md">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={deleteConfirmEmployee.avatar} alt={deleteConfirmEmployee.name} />
                  <AvatarFallback>{deleteConfirmEmployee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{deleteConfirmEmployee.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {deleteConfirmEmployee.role} - {deleteConfirmEmployee.region}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmEmployee(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEmployee}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeManagementPage;
