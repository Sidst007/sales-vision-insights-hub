
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, BarChart2, PieChart, Download, Filter } from 'lucide-react';
import { generateTeamData, generatePerformanceMetrics } from '@/data/mockData';
import { UserRole } from '@/contexts/AuthContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { formatPercentage, formatCurrency } from '@/utils/data-utils';

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('sales');
  const [timeframe, setTimeframe] = useState('month');
  
  // Generate some team data
  const teamData = generateTeamData();
  
  // Generate random monthly data for demo charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlySalesData = months.map(month => ({
    name: month,
    sales: Math.floor(Math.random() * 50000) + 30000,
    target: 50000
  }));
  
  // Performance metrics for different roles
  const adminMetrics = generatePerformanceMetrics(UserRole.ADMIN);
  
  return (
    <div className="pb-8">
      <Header title="Reports Dashboard" subtitle="Generate and analyze sales reports" />
      
      <div className="container mt-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
            <CardDescription>
              Create custom reports based on various metrics and timeframes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">Report Type</label>
                <Select defaultValue={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Performance</SelectItem>
                    <SelectItem value="team">Team Performance</SelectItem>
                    <SelectItem value="products">Product Analysis</SelectItem>
                    <SelectItem value="territory">Territory Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">Timeframe</label>
                <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3 flex items-end">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" /> Generate Report
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sales-reports">Sales Reports</TabsTrigger>
            <TabsTrigger value="team-reports">Team Reports</TabsTrigger>
            <TabsTrigger value="custom-reports">Custom Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlySalesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'Amount']} />
                        <Bar dataKey="sales" name="Sales" fill="#0F52BA" />
                        <Bar dataKey="target" name="Target" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={teamData.map(member => ({
                          name: member.name.split(' ')[0],
                          performance: member.performance,
                          target: 100
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 120]} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                        <Bar dataKey="performance" name="Performance %" barSize={20} radius={[0, 4, 4, 0]}>
                          {teamData.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                teamData[index].performance >= 100 ? "#4CAF50" :
                                teamData[index].performance >= 85 ? "#FFC107" : 
                                "#FF6B6B"
                              } 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {adminMetrics.map((metric, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</h3>
                        <div className="text-2xl font-bold">{metric.label === 'Revenue' ? formatCurrency(metric.value * 1000) : `${metric.value}%`}</div>
                        <div className={`text-sm flex items-center mt-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change).toFixed(1)}%
                          <span className="text-muted-foreground ml-1">vs previous</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales-reports">
            <Card>
              <CardHeader>
                <CardTitle>Sales Reports</CardTitle>
                <CardDescription>View detailed sales reports by product, territory, or time period</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Select report parameters above to generate a detailed sales report.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team-reports">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Reports</CardTitle>
                <CardDescription>Analyze team and individual performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Select report parameters above to generate a detailed team performance report.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom-reports">
            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>Create custom reports with specific metrics and visualizations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Use the report generator to create custom reports with your preferred metrics.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
