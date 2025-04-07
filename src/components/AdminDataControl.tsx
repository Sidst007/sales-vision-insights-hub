
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole, User } from '@/contexts/AuthContext';
import { SavedSalesData, getAllSalesData, deleteUserSalesData, deleteSalesData } from '@/utils/data-storage';
import { formatCurrency } from '@/utils/data-utils';
import { toast } from 'sonner';
import { Trash2, UserX, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdminDataControlProps {
  employees: User[];
}

const AdminDataControl: React.FC<AdminDataControlProps> = ({ employees }) => {
  const [salesData, setSalesData] = useState<SavedSalesData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load all sales data
  const loadSalesData = () => {
    setIsLoading(true);
    try {
      const data = getAllSalesData();
      setSalesData(data);
    } catch (error) {
      console.error('Error loading sales data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  // Group data by user ID
  const dataByUser = salesData.reduce((acc, entry) => {
    if (!acc[entry.userId]) {
      acc[entry.userId] = [];
    }
    acc[entry.userId].push(entry);
    return acc;
  }, {} as Record<string, SavedSalesData[]>);

  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown Employee';
  };

  // Get employee role by ID
  const getEmployeeRole = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.role : 'Unknown';
  };

  // Handle delete all data for a user
  const handleDeleteUserData = (userId: string) => {
    if (deleteUserSalesData(userId)) {
      // Update local state
      setSalesData(prev => prev.filter(entry => entry.userId !== userId));
      toast.success(`All data for ${getEmployeeName(userId)} has been deleted`);
    } else {
      toast.error('Failed to delete user data');
    }
  };

  // Handle delete specific entry
  const handleDeleteEntry = (entryId: string) => {
    if (deleteSalesData(entryId)) {
      // Update local state
      setSalesData(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Entry deleted successfully');
    } else {
      toast.error('Failed to delete entry');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate user totals
  const calculateUserTotals = (entries: SavedSalesData[]) => {
    return entries.reduce((acc, entry) => {
      return {
        calls: acc.calls + entry.callsMade,
        meetings: acc.meetings + entry.meetings,
        sales: acc.sales + entry.salesAmount,
        accounts: acc.accounts + entry.newAccounts,
      };
    }, { calls: 0, meetings: 0, sales: 0, accounts: 0 });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Sales Data Management</CardTitle>
            <CardDescription>View and manage all employee sales data</CardDescription>
          </div>
          <Button 
            onClick={loadSalesData}
            variant="outline"
            className="mt-4 md:mt-0"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Detailed Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <Table>
              <TableCaption>Summary of sales data by employee</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Total Meetings</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>New Accounts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(dataByUser).map(([userId, entries]) => {
                  const totals = calculateUserTotals(entries);
                  return (
                    <TableRow key={userId}>
                      <TableCell className="font-medium">{getEmployeeName(userId)}</TableCell>
                      <TableCell>{getEmployeeRole(userId)}</TableCell>
                      <TableCell>{entries.length}</TableCell>
                      <TableCell>{totals.calls}</TableCell>
                      <TableCell>{totals.meetings}</TableCell>
                      <TableCell>{formatCurrency(totals.sales)}</TableCell>
                      <TableCell>{totals.accounts}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive border-destructive">
                                <UserX size={14} className="mr-1" />
                                Delete All
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete all data for {getEmployeeName(userId)}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove all sales records for this employee. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUserData(userId)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete All Data
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedEmployee(userId)}
                          >
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="w-full sm:w-auto">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedEmployee || ''}
                    onChange={(e) => setSelectedEmployee(e.target.value || null)}
                  >
                    <option value="">All Employees</option>
                    {Object.keys(dataByUser).map((userId) => (
                      <option key={userId} value={userId}>
                        {getEmployeeName(userId)} ({getEmployeeRole(userId)})
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedEmployee && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 size={14} className="mr-1" />
                        Delete All Records for {getEmployeeName(selectedEmployee)}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete all records?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove all sales data for {getEmployeeName(selectedEmployee)}. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleDeleteUserData(selectedEmployee);
                            setSelectedEmployee(null);
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              
              <Table>
                <TableCaption>Detailed sales records</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Calls</TableHead>
                    <TableHead>Meetings</TableHead>
                    <TableHead>Sales Amount</TableHead>
                    <TableHead>New Accounts</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData
                    .filter(entry => !selectedEmployee || entry.userId === selectedEmployee)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>{getEmployeeName(entry.userId)}</TableCell>
                        <TableCell>{entry.callsMade}</TableCell>
                        <TableCell>{entry.meetings}</TableCell>
                        <TableCell>{formatCurrency(entry.salesAmount)}</TableCell>
                        <TableCell>{entry.newAccounts}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" size="sm" className="h-auto p-0">
                                {entry.notes ? (entry.notes.length > 20 ? entry.notes.substring(0, 20) + '...' : entry.notes) : 'No notes'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Entry Notes</DialogTitle>
                                <DialogDescription>
                                  Date: {formatDate(entry.date)}<br />
                                  Employee: {getEmployeeName(entry.userId)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                {entry.notes || 'No notes were added for this entry.'}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove this sales activity record. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {salesData.filter(entry => !selectedEmployee || entry.userId === selectedEmployee).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No records found. {selectedEmployee ? 'This employee has not submitted any sales data.' : 'No sales data has been submitted yet.'}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminDataControl;
