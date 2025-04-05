
import React, { useState } from 'react';
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
import { Calendar, Phone, FileText, Users, Target } from 'lucide-react';

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
  
  // Get current day's metrics (this would be fetched from your API/database in a real app)
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

  // Submit handler
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // This is where you would send the data to your backend
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      // Update current metrics with the parsed number values from the form
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
      
      toast.success('Your sales data has been submitted successfully');
      setIsSubmitting(false);
    }, 1500);
  };

  // Calculate progress percentages
  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <>
      <Header 
        title={`Hello, ${user?.name?.split(' ')[0] || 'User'}`} 
        subtitle={`${user?.role} - Daily Sales Tracker`} 
      />
      
      <main className="dashboard-layout">
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
        <Card>
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
                    {isSubmitting ? 'Saving...' : 'Submit Sales Data'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default DataInputPage;
