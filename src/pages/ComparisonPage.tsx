
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CustomProgress } from '@/components/ui/custom-progress';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPercentage, formatCurrency, formatNumber, getPerformanceColor } from '@/utils/data-utils';
import { generateTeamData } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  BarChart3, 
  Users,
  ArrowUpDown,
  Shield,
  TrendingUp
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  region: string;
  territory: string;
  performance: number;
  target: number;
  sales: number;
  avatar: string;
  calls?: number;
  meetings?: number;
  newAccounts?: number;
  email?: string;
}

interface ComparisonCategory {
  name: string;
  value: string;
  sort: (a: TeamMember, b: TeamMember) => number;
}

const ComparisonPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sortCategory, setSortCategory] = useState<string>('performance');
  
  // Get team data
  const teamData = generateTeamData();
  
  // Redirect if not admin
  if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.TSM) {
    return <div>You do not have permission to access this page.</div>;
  }
  
  // Categories for sorting and comparison
  const categories: ComparisonCategory[] = [
    { 
      name: 'Performance', 
      value: 'performance',
      sort: (a, b) => b.performance - a.performance 
    },
    { 
      name: 'Sales', 
      value: 'sales',
      sort: (a, b) => (b.sales || 0) - (a.sales || 0)
    },
    { 
      name: 'Calls', 
      value: 'calls',
      sort: (a, b) => (b.calls || 0) - (a.calls || 0)
    },
    { 
      name: 'Meetings', 
      value: 'meetings',
      sort: (a, b) => (b.meetings || 0) - (a.meetings || 0)
    },
    { 
      name: 'New Accounts', 
      value: 'newAccounts',
      sort: (a, b) => (b.newAccounts || 0) - (a.newAccounts || 0)
    }
  ];
  
  // Handle member selection
  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      if (selectedMembers.length < 4) {
        setSelectedMembers([...selectedMembers, memberId]);
      }
    }
  };
  
  // Generate radar data for comparison
  const generateRadarData = () => {
    const metrics = ['Performance', 'Sales', 'Calls', 'New Accounts', 'Meetings'];
    const data = metrics.map(metric => {
      const result: any = { metric };
      
      selectedMembers.forEach(memberId => {
        const member = teamData.find(m => m.id === memberId);
        if (member) {
          switch(metric) {
            case 'Performance':
              result[member.name] = member.performance;
              break;
            case 'Sales':
              // Normalize sales to 0-100 scale
              const maxSales = Math.max(...teamData.map(m => m.sales || 0));
              result[member.name] = ((member.sales || 0) / maxSales) * 100;
              break;
            case 'Calls':
              // Normalize calls to 0-100 scale
              const maxCalls = Math.max(...teamData.map(m => m.calls || 0));
              result[member.name] = ((member.calls || 0) / maxCalls) * 100;
              break;
            case 'New Accounts':
              // Normalize new accounts to 0-100 scale
              const maxAccounts = Math.max(...teamData.map(m => m.newAccounts || 0));
              result[member.name] = ((member.newAccounts || 0) / maxAccounts) * 100;
              break;
            case 'Meetings':
              // Normalize meetings to 0-100 scale
              const maxMeetings = Math.max(...teamData.map(m => m.meetings || 0));
              result[member.name] = ((member.meetings || 0) / maxMeetings) * 100;
              break;
            default:
              result[member.name] = 0;
          }
        }
      });
      
      return result;
    });
    
    return data;
  };
  
  // Generate bar data for comparison
  const generateBarData = () => {
    const selectedData = teamData
      .filter(member => selectedMembers.includes(member.id))
      .map(member => ({
        name: member.name,
        performance: member.performance,
        target: 100
      }));
    
    return selectedData;
  };
  
  // Prepare data for radar chart
  const radarData = generateRadarData();
  const barData = generateBarData();
  
  // Sort team data based on selected category
  const sortedTeamData = [...teamData].sort(
    categories.find(c => c.value === sortCategory)?.sort || 
    ((a, b) => b.performance - a.performance)
  );
  
  // Generate random colors for the charts
  const getRandomColors = (count: number) => {
    const colors = ['#0F52BA', '#4CAF50', '#FF6B6B', '#FFC107', '#9C27B0', '#FF9800'];
    return colors.slice(0, count);
  };
  
  const memberColors = getRandomColors(selectedMembers.length);
  
  return (
    <>
      <Header 
        title="Team Comparison" 
        subtitle="Compare performance metrics across team members" 
        showExport
      />
      
      <main className="dashboard-layout">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Team Rankings</CardTitle>
            <CardDescription>Select up to 4 team members to compare (currently selected: {selectedMembers.length})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={sortCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortCategory(category.value)}
                >
                  {category.name}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ))}
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Performance</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeamData.map((member, index) => (
                    <TableRow 
                      key={member.id}
                      className={selectedMembers.includes(member.id) ? "bg-muted/50" : ""}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${selectedMembers.includes(member.id) ? "bg-primary text-primary-foreground" : ""}`}
                          disabled={selectedMembers.length >= 4 && !selectedMembers.includes(member.id)}
                          onClick={() => toggleMemberSelection(member.id)}
                        >
                          {selectedMembers.includes(member.id) ? (
                            <Shield className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.region}</TableCell>
                      <TableCell className="text-right">
                        <span className={getPerformanceColor(member.performance, 100)}>
                          {formatPercentage(member.performance)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(member.sales || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {selectedMembers.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>Target achievement comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={{}}>
                      <BarChart
                        data={barData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 120]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="performance" name="Performance %" fill="#0F52BA" radius={[4, 4, 0, 0]}>
                          {barData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={memberColors[index % memberColors.length]} 
                            />
                          ))}
                        </Bar>
                        <Bar dataKey="target" name="Target" fill="#1A3A6A" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Radar Analysis</CardTitle>
                  <CardDescription>Multi-dimensional performance visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={{}}>
                      <RadarChart 
                        outerRadius={90} 
                        width={500} 
                        height={300} 
                        data={radarData}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        
                        {selectedMembers.map((memberId, index) => {
                          const member = teamData.find(m => m.id === memberId);
                          if (!member) return null;
                          
                          return (
                            <Radar
                              key={memberId}
                              name={member.name}
                              dataKey={member.name}
                              stroke={memberColors[index % memberColors.length]}
                              fill={memberColors[index % memberColors.length]}
                              fillOpacity={0.2}
                            />
                          );
                        })}
                        
                        <Legend />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detailed Metrics Comparison</CardTitle>
                <CardDescription>Key performance indicators side by side</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableHead key={memberId}>
                              {member?.name || "Employee"}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Performance</TableCell>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableCell key={memberId}>
                              <span className={getPerformanceColor(member?.performance || 0, 100)}>
                                {formatPercentage(member?.performance || 0)}
                              </span>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sales</TableCell>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableCell key={memberId}>
                              {formatCurrency(member?.sales || 0)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Calls Made</TableCell>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableCell key={memberId}>
                              {formatNumber(member?.calls || 0)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Meetings</TableCell>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableCell key={memberId}>
                              {formatNumber(member?.meetings || 0)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">New Accounts</TableCell>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableCell key={memberId}>
                              {formatNumber(member?.newAccounts || 0)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Target</TableCell>
                        {selectedMembers.map(memberId => {
                          const member = teamData.find(m => m.id === memberId);
                          return (
                            <TableCell key={memberId}>
                              {formatCurrency(member?.target || 0)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-sales-primary">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <TrendingUp className="text-sales-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Comparative Analysis Insights</h3>
                    <div className="space-y-2 text-muted-foreground">
                      {selectedMembers.length === 1 ? (
                        <p>Select more team members to see comparative analysis insights.</p>
                      ) : (
                        <>
                          <p>
                            {teamData.find(m => m.id === selectedMembers[0])?.name} is {
                              barData[0]?.performance > barData[1]?.performance ? 'outperforming' : 'underperforming compared to'
                            } {teamData.find(m => m.id === selectedMembers[1])?.name} by {
                              Math.abs(barData[0]?.performance - barData[1]?.performance).toFixed(1)
                            }% in overall target achievement.
                          </p>
                          {selectedMembers.length > 2 && (
                            <p>
                              {teamData.find(m => m.id === selectedMembers.sort((a, b) => {
                                const memberA = teamData.find(m => m.id === a);
                                const memberB = teamData.find(m => m.id === b);
                                return (memberB?.performance || 0) - (memberA?.performance || 0);
                              })[0])?.name} is the highest performer in this group.
                            </p>
                          )}
                          <p>
                            Key differences between team members are most evident in {
                              Math.random() > 0.5 ? 'call volume and conversion rates' : 'new account acquisition and sales closing efficiency'
                            }.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </>
  );
};

export default ComparisonPage;
