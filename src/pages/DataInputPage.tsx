
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomProgress } from '@/components/ui/custom-progress';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { formatPercentage, formatCurrency } from '@/utils/data-utils';
import { Calendar, Phone, FileText, Users, Target, Trash2 } from 'lucide-react';
import { 
  saveSalesData, 
  getUserSalesData, 
  deleteSalesData, 
  SavedSalesData,
  canDeleteData
} from '@/utils/data-storage';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// Define form schema
const formSchema = z.object({
  callsMade: z.coerce.number().min(0, { message: "Number of calls is required" }),
  meetings: z.coerce.number().min(0, { message: "Number of meetings is required" }),
  salesAmount: z.coerce.number().min(0, { message: "Sales amount is required" }),
  newAccounts: z.coerce.number().min(0, { message: "Number of new accounts is required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DataInputPage: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailyTarget, setDailyTarget] = useState({
    calls: 30,
    meetings: 5,
    salesAmount: 10000,
    newAccounts: 2
  });
  
  const [savedEntries, setSavedEntries] = useState<SavedSalesData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    calls: 0,
    meetings: 0,
    salesAmount: 0,
    newAccounts: 0
  });

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      callsMade: 0,
      meetings: 0,
      salesAmount: 0,
      newAccounts: 0,
      notes: ""
    }
  });

  // Load saved data on component mount
  useEffect(() => {
    if (user) {
      const userData = getUserSalesData(user.id);
      setSavedEntries(userData);
      
      // Calculate current metrics from saved data
      const totals = userData.reduce((acc, entry) => {
        return {
          calls: acc.calls + entry.callsMade,
          meetings: acc.meetings + entry.meetings,
          salesAmount: acc.salesAmount + entry.salesAmount,
          newAccounts: acc.newAccounts + entry.newAccounts
        };
      }, { calls: 0, meetings: 0, salesAmount: 0, newAccounts: 0 });
      
      setCurrentMetrics(totals);
    }
  }, [user]);

  // Submit handler
  const onSubmit = (data: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit data');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save data to storage
      const savedData = saveSalesData({
        userId: user.id,
        callsMade: data.callsMade,
        meetings: data.meetings,
        salesAmount: data.salesAmount,
        newAccounts: data.newAccounts,
        notes: data.notes
      });
      
      // Update local state
      setSavedEntries(prev => [...prev, savedData]);
      
      // Update current metrics
      setCurrentMetrics(prev => ({
        calls: prev.calls + data.callsMade,
        meetings: prev.meetings + data.meetings,
        salesAmount: prev.salesAmount + data.salesAmount,
        newAccounts: prev.newAccounts + data.newAccounts
      }));
      
      // Reset form
      form.reset({
        callsMade: 0,
        meetings: 0,
        salesAmount: 0,
        newAccounts: 0,
        notes: ""
      });
      
      toast.success('Your sales data has been saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete entry
  const handleDeleteEntry = (entryId: string) => {
    if (deleteSalesData(entryId)) {
      // Update local state after deletion
      const deletedEntry = savedEntries.find(entry => entry.id === entryId);
      
      if (deletedEntry) {
        // Remove from saved entries
        setSavedEntries(prev => prev.filter(entry => entry.id !== entryId));
        
        // Update metrics
        setCurrentMetrics(prev => ({
          calls: prev.calls - deletedEntry.callsMade,
          meetings: prev.meetings - deletedEntry.meetings,
          salesAmount: prev.salesAmount - deletedEntry.salesAmount,
          newAccounts: prev.newAccounts - deletedEntry.newAccounts
        }));
        
        toast.success('Entry deleted successfully');
      }
    } else {
      toast.error('Failed to delete entry');
    }
  };

  // Calculate progress percentages
  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Header 
        title={`Hello, ${user?.name?.split(' ')[0] || 'User'}`} 
        subtitle={`${user?.role} - Daily Sales Tracker`} 
      />
      
      <main className="dashboard-layout p-4">
        {/* Daily Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Phone size={18} className="mr-2 text-sales-primary" />
                Calls Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMetrics.calls} <span className="text-sm text-muted-foreground">/ {dailyTarget.calls}</span></div>
              <CustomProgress 
                value={getProgress(currentMetrics.calls, dailyTarget.calls)} 
                className="h-2 mt-2" 
                indicatorClassName={currentMetrics.calls >= dailyTarget.calls ? "bg-sales-success" : "bg-sales-primary"}
              />
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Calendar size={18} className="mr-2 text-sales-primary" />
                Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMetrics.meetings} <span className="text-sm text-muted-foreground">/ {dailyTarget.meetings}</span></div>
              <CustomProgress 
                value={getProgress(currentMetrics.meetings, dailyTarget.meetings)} 
                className="h-2 mt-2" 
                indicatorClassName={currentMetrics.meetings >= dailyTarget.meetings ? "bg-sales-success" : "bg-sales-primary"}
              />
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Target size={18} className="mr-2 text-sales-primary" />
                Sales Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentMetrics.salesAmount)} <span className="text-sm text-muted-foreground">/ {formatCurrency(dailyTarget.salesAmount)}</span></div>
              <CustomProgress 
                value={getProgress(currentMetrics.salesAmount, dailyTarget.salesAmount)} 
                className="h-2 mt-2" 
                indicatorClassName={currentMetrics.salesAmount >= dailyTarget.salesAmount ? "bg-sales-success" : "bg-sales-primary"}
              />
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users size={18} className="mr-2 text-sales-primary" />
                New Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMetrics.newAccounts} <span className="text-sm text-muted-foreground">/ {dailyTarget.newAccounts}</span></div>
              <CustomProgress 
                value={getProgress(currentMetrics.newAccounts, dailyTarget.newAccounts)} 
                className="h-2 mt-2" 
                indicatorClassName={currentMetrics.newAccounts >= dailyTarget.newAccounts ? "bg-sales-success" : "bg-sales-primary"}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Data Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record Your Sales Activities</CardTitle>
            <CardDescription>Enter details about your calls, meetings, and sales for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="callsMade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Calls Made</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="meetings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Meetings Conducted</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salesAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newAccounts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Accounts Acquired</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional information about your sales activities..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardFooter className="px-0 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Sales Data'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Saved Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Sales Activity History</CardTitle>
            <CardDescription>Review and manage your previously recorded sales activities</CardDescription>
          </CardHeader>
          <CardContent>
            {savedEntries.length > 0 ? (
              <Table>
                <TableCaption>A list of your recorded sales activities</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Calls</TableHead>
                    <TableHead>Meetings</TableHead>
                    <TableHead>Sales Amount</TableHead>
                    <TableHead>New Accounts</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
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
                              <DialogDescription>Date: {formatDate(entry.date)}</DialogDescription>
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No sales activity records found. Start by adding your first entry above.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default DataInputPage;
