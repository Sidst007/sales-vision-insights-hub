
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw, 
  Search,
  ChevronDown 
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/data-utils';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Input } from '@/components/ui/input';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sales');
  
  // Mock report data
  const salesReports = [
    { id: 1, name: 'Monthly Sales Summary', type: 'Sales', date: '2025-04-01', status: 'Ready' },
    { id: 2, name: 'Quarterly Performance Review', type: 'Performance', date: '2025-04-01', status: 'Ready' },
    { id: 3, name: 'Product Category Analysis', type: 'Product', date: '2025-03-28', status: 'Ready' },
    { id: 4, name: 'Sales Representative Performance', type: 'Performance', date: '2025-03-25', status: 'Ready' },
    { id: 5, name: 'Territory Comparison Report', type: 'Territory', date: '2025-03-20', status: 'Ready' },
    { id: 6, name: 'Year-to-Date Growth Analysis', type: 'Growth', date: '2025-03-15', status: 'Ready' },
  ];
  
  // Mock monthly sales data for chart
  const monthlySalesData = [
    { month: 'Jan', sales: 80000, target: 75000, lastYear: 65000 },
    { month: 'Feb', sales: 85000, target: 82000, lastYear: 68000 },
    { month: 'Mar', sales: 92000, target: 90000, lastYear: 75000 },
    { month: 'Apr', sales: 78000, target: 85000, lastYear: 72000 },
    { month: 'May', sales: 96000, target: 88000, lastYear: 80000 },
    { month: 'Jun', sales: 105000, target: 95000, lastYear: 85000 }
  ];
  
  // Mock performance data for chart
  const performanceData = [
    { name: 'Calls Made', current: 85, target: 80, previous: 75 },
    { name: 'Meetings', current: 92, target: 90, previous: 80 },
    { name: 'New Accounts', current: 78, target: 85, previous: 70 },
    { name: 'Follow-ups', current: 94, target: 88, previous: 85 },
    { name: 'Conversions', current: 88, target: 85, previous: 82 }
  ];
  
  return (
    <>
      <Header 
        title="Reports & Analytics" 
        subtitle="Comprehensive business intelligence and reports"
        showExport
      />
      
      <main className="dashboard-layout">
        {/* Report Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search reports..." 
                  className="max-w-xs"
                  prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date Range</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                <Button className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Tabs */}
        <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="performance">Performance Reports</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Analysis</CardTitle>
                <CardDescription>Current period vs target and previous year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlySalesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)} 
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        name="Current Sales" 
                        stroke="#0F52BA" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        name="Target" 
                        stroke="#FF6B6B" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYear" 
                        name="Last Year" 
                        stroke="#4CAF50"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(monthlySalesData.reduce((sum, data) => sum + data.sales, 0))}
                    </p>
                    <p className="text-sm text-sales-success">
                      +{formatPercentage(8.5)} vs previous period
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Target Achievement</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(
                        (monthlySalesData.reduce((sum, data) => sum + data.sales, 0) / 
                        monthlySalesData.reduce((sum, data) => sum + data.target, 0)) * 100
                      )}
                    </p>
                    <p className="text-sm text-sales-success">+{formatPercentage(2.3)} vs target</p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Year-over-Year Growth</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(
                        ((monthlySalesData.reduce((sum, data) => sum + data.sales, 0) / 
                        monthlySalesData.reduce((sum, data) => sum + data.lastYear, 0)) - 1) * 100
                      )}
                    </p>
                    <p className="text-sm text-sales-success">Ahead of forecast</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Available Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Available Sales Reports</CardTitle>
                <CardDescription>Download or view detailed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium py-3">Report Name</th>
                        <th className="text-left font-medium py-3">Type</th>
                        <th className="text-left font-medium py-3">Date</th>
                        <th className="text-left font-medium py-3">Status</th>
                        <th className="text-right font-medium py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesReports.filter(report => report.type === 'Sales' || report.type === 'Growth').map((report) => (
                        <tr key={report.id} className="border-b">
                          <td className="py-3">{report.name}</td>
                          <td className="py-3">{report.type}</td>
                          <td className="py-3">{new Date(report.date).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-sales-success/20 text-sales-success">
                              {report.status}
                            </span>
                          </td>
                          <td className="text-right py-3">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Compare current performance with targets and previous period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="current" name="Current Period" fill="#0F52BA" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="Target" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="previous" name="Previous Period" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Available Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Available Performance Reports</CardTitle>
                <CardDescription>Download or view detailed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium py-3">Report Name</th>
                        <th className="text-left font-medium py-3">Type</th>
                        <th className="text-left font-medium py-3">Date</th>
                        <th className="text-left font-medium py-3">Status</th>
                        <th className="text-right font-medium py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesReports.filter(report => report.type === 'Performance').map((report) => (
                        <tr key={report.id} className="border-b">
                          <td className="py-3">{report.name}</td>
                          <td className="py-3">{report.type}</td>
                          <td className="py-3">{new Date(report.date).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-sales-success/20 text-sales-success">
                              {report.status}
                            </span>
                          </td>
                          <td className="text-right py-3">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Inventory Reports</CardTitle>
                    <CardDescription>Monitor stock levels and inventory health</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <p className="text-yellow-800">No inventory reports are available for the selected time period. Generate a new report to view inventory data.</p>
                </div>
                
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recent Inventory Reports</h3>
                    <p className="text-muted-foreground mb-4">Generate a new inventory report to analyze current stock levels and optimize your inventory.</p>
                    <Button>Generate Inventory Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Custom Report Builder</CardTitle>
                    <CardDescription>Create tailored reports for your specific needs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <p className="text-blue-800">Create custom reports by selecting metrics, dimensions, and filters based on your requirements.</p>
                </div>
                
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Report Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Report Type</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Sales Report</option>
                          <option>Performance Report</option>
                          <option>Inventory Report</option>
                          <option>Customer Report</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Time Period</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>Last 12 months</option>
                          <option>Custom range</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Select Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="metric1" className="rounded" />
                        <label htmlFor="metric1">Total Sales</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="metric2" className="rounded" />
                        <label htmlFor="metric2">Units Sold</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="metric3" className="rounded" />
                        <label htmlFor="metric3">Profit Margin</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="metric4" className="rounded" />
                        <label htmlFor="metric4">Conversion Rate</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="metric5" className="rounded" />
                        <label htmlFor="metric5">Inventory Turnover</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="metric6" className="rounded" />
                        <label htmlFor="metric6">Customer Acquisition Cost</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" className="mr-2">Cancel</Button>
                    <Button>Generate Custom Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default ReportsPage;
