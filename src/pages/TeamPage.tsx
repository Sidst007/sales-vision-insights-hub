
import React from 'react';
import Header from '@/components/Header';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPercentage, formatCurrency, getPerformanceColor } from '@/utils/data-utils';
import { generateTeamData, generateTerritoryData } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const TeamPage: React.FC = () => {
  const teamData = generateTeamData();
  const territoryData = generateTerritoryData();
  
  // Generate random colors for territory chart
  const COLORS = ['#0F52BA', '#4682B4', '#1A3A6A', '#FF6B6B', '#4CAF50', '#FFC107'];
  
  // Calculate team performance average
  const averagePerformance = teamData.reduce((acc, member) => acc + member.performance, 0) / teamData.length;
  
  return (
    <>
      <Header title="Team Performance" subtitle="Track and analyze your team's sales performance" showExport />
      
      <main className="dashboard-layout">
        {/* Team Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Team Overview</CardTitle>
              <CardDescription>Average performance across team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{formatPercentage(averagePerformance)}</div>
                <div className="text-sm text-muted-foreground">
                  Average Performance vs Target
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <div>Overall Progress</div>
                  <div className={getPerformanceColor(averagePerformance, 100)}>
                    {formatPercentage(averagePerformance)}
                  </div>
                </div>
                <Progress 
                  value={averagePerformance} 
                  className="h-2" 
                  indicatorClassName={
                    averagePerformance >= 100 ? "bg-sales-success" :
                    averagePerformance >= 85 ? "bg-sales-warning" :
                    "bg-sales-danger"
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Top Performer</div>
                  <div className="text-xl font-semibold">
                    {formatPercentage(Math.max(...teamData.map(t => t.performance)))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Lowest Performer</div>
                  <div className="text-xl font-semibold">
                    {formatPercentage(Math.min(...teamData.map(t => t.performance)))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Territory Performance</CardTitle>
              <CardDescription>Sales by territory vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={territoryData.map(t => ({ 
                      name: t.name, 
                      performance: t.performance 
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 120]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Performance']}
                      labelFormatter={(name) => `Territory: ${name}`}
                    />
                    <Bar dataKey="performance" name="Performance %" radius={[4, 4, 0, 0]}>
                      {territoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Member List */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Team Members</h2>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamData.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium ${getPerformanceColor(member.performance, member.target)}`}>
                          {formatPercentage(member.performance)}
                        </span>
                        <div className="w-24 mt-1">
                          <Progress 
                            value={(member.performance / member.target) * 100} 
                            className="h-1.5" 
                            indicatorClassName={
                              member.performance >= member.target ? "bg-sales-success" :
                              member.performance >= member.target * 0.85 ? "bg-sales-warning" :
                              "bg-sales-danger"
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Territory Details */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Territory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territoryData.map((territory) => (
              <Card key={territory.id} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{territory.name}</CardTitle>
                  <CardDescription className="text-xs">Manager: {territory.manager}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Sales vs Target</div>
                    <div className={`text-sm font-medium ${getPerformanceColor(territory.performance, 100)}`}>
                      {formatPercentage(territory.performance)}
                    </div>
                  </div>
                  
                  <Progress 
                    value={territory.performance} 
                    className="h-2 mb-4" 
                    indicatorClassName={
                      territory.performance >= 100 ? "bg-sales-success" :
                      territory.performance >= 85 ? "bg-sales-warning" :
                      "bg-sales-danger"
                    }
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Sales</div>
                      <div className="font-medium">{formatCurrency(territory.sales)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Growth</div>
                      <div className={`font-medium ${territory.growth >= 0 ? 'text-sales-success' : 'text-sales-danger'}`}>
                        {territory.growth >= 0 ? '+' : ''}{territory.growth}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default TeamPage;
