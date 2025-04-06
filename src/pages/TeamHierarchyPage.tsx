
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CustomProgress } from '@/components/ui/custom-progress';
import { generateTeamData } from '@/data/mockData';
import { getPerformanceColor, formatPercentage } from '@/utils/data-utils';
import { OrganizationChart } from '@/components/OrganizationChart';
import { Search, ChevronDown, ChevronUp, Phone, Mail, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeamHierarchyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  
  // Get all employees
  const allEmployees = generateTeamData();
  
  // Filter employees based on search query
  const filteredEmployees = allEmployees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.territory?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to expand or collapse a team
  const toggleTeam = (teamManagerId: string) => {
    if (expandedTeams.includes(teamManagerId)) {
      setExpandedTeams(expandedTeams.filter(id => id !== teamManagerId));
    } else {
      setExpandedTeams([...expandedTeams, teamManagerId]);
    }
  };
  
  // Get team structure
  const getTeamStructure = () => {
    // Get TSMs
    const tsms = allEmployees.filter(e => e.role === UserRole.TSM);
    
    // For each TSM, get their direct reports (ASEs)
    return tsms.map(tsm => {
      const ases = allEmployees.filter(e => e.managerId === tsm.id);
      
      // For each ASE, get their direct reports (ASMs)
      const aseWithTeams = ases.map(ase => {
        const asms = allEmployees.filter(e => e.managerId === ase.id);
        
        // For each ASM, get their direct reports (SRs)
        const asmWithTeams = asms.map(asm => {
          const srs = allEmployees.filter(e => e.managerId === asm.id);
          return {
            ...asm,
            team: srs
          };
        });
        
        return {
          ...ase,
          team: asmWithTeams
        };
      });
      
      return {
        ...tsm,
        team: aseWithTeams
      };
    });
  };
  
  // Check if user has access to view team hierarchy
  const canViewTeamHierarchy = user?.role === UserRole.ADMIN || 
                              user?.role === UserRole.TSM || 
                              user?.role === UserRole.ASE;
  
  if (!canViewTeamHierarchy) {
    return (
      <>
        <Header title="Team Hierarchy" subtitle="Organizational structure and reporting relationships" />
        <main className="p-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Access Restricted</h2>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have permission to view the team hierarchy. 
                Please contact your administrator for assistance.
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  
  const teamStructure = getTeamStructure();
  
  return (
    <>
      <Header title="Team Hierarchy" subtitle="Organizational structure and reporting relationships" />
      
      <main className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Team Organization</CardTitle>
            </div>
            <CardDescription>Explore the team structure and hierarchy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6 justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="hierarchy" className="w-fit">
                <TabsList>
                  <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <TabsContent value="hierarchy" className="mt-6">
              <div className="overflow-x-auto pb-6">
                <div className="min-w-[800px]">
                  <OrganizationChart employees={allEmployees} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-6">
              {searchQuery ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Search Results</h3>
                  {filteredEmployees.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">No employees found matching your search.</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredEmployees.map(employee => (
                        <Card key={employee.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-4">
                                  <AvatarImage src={employee.avatar} alt={employee.name} />
                                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{employee.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {employee.role} - {employee.region || 'No Region'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/employee/${employee.id}`)}
                                >
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {teamStructure.map(tsm => (
                    <div key={tsm.id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="p-4 bg-muted/30 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleTeam(tsm.id)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={tsm.avatar} alt={tsm.name} />
                            <AvatarFallback>{tsm.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{tsm.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {tsm.role} - {tsm.region || 'No Region'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className={`text-sm font-medium ${getPerformanceColor(tsm.performance || 0, 100)}`}>
                              {formatPercentage(tsm.performance || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">Team Size: {tsm.team.length}</div>
                          </div>
                          {expandedTeams.includes(tsm.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                      
                      {expandedTeams.includes(tsm.id) && (
                        <div className="px-4 py-2">
                          <div className="pl-8 border-l-2 border-muted space-y-4 ml-5">
                            {tsm.team.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">No direct reports.</p>
                            ) : (
                              tsm.team.map(ase => (
                                <div key={ase.id} className="mt-4">
                                  <div className="flex items-center">
                                    <div className="absolute w-6 h-0.5 bg-muted -ml-8"></div>
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarImage src={ase.avatar} alt={ase.name} />
                                      <AvatarFallback>{ase.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-sm">{ase.name}</div>
                                      <div className="text-xs text-muted-foreground">{ase.role}</div>
                                    </div>
                                    <div className="ml-auto">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => navigate(`/employee/${ase.id}`)}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {ase.team.length > 0 && (
                                    <div className="pl-8 border-l-2 border-muted mt-2 space-y-3">
                                      {ase.team.map(asm => (
                                        <div key={asm.id} className="mt-3">
                                          <div className="flex items-center">
                                            <div className="absolute w-6 h-0.5 bg-muted -ml-8"></div>
                                            <Avatar className="h-7 w-7 mr-2">
                                              <AvatarImage src={asm.avatar} alt={asm.name} />
                                              <AvatarFallback>{asm.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="font-medium text-sm">{asm.name}</div>
                                              <div className="text-xs text-muted-foreground">{asm.role}</div>
                                            </div>
                                            <div className="ml-auto">
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => navigate(`/employee/${asm.id}`)}
                                              >
                                                View
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          {asm.team.length > 0 && (
                                            <div className="pl-6 border-l-2 border-muted ml-3 mt-2">
                                              {asm.team.map(sr => (
                                                <div key={sr.id} className="flex items-center py-1">
                                                  <div className="absolute w-4 h-0.5 bg-muted -ml-6"></div>
                                                  <Avatar className="h-6 w-6 mr-2">
                                                    <AvatarImage src={sr.avatar} alt={sr.name} />
                                                    <AvatarFallback>{sr.name.charAt(0)}</AvatarFallback>
                                                  </Avatar>
                                                  <div className="text-xs">{sr.name}</div>
                                                  <div className="ml-auto">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => navigate(`/employee/${sr.id}`)}
                                                    >
                                                      View
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
        
        {selectedTeamMember && (
          <Card>
            <CardHeader>
              <CardTitle>Employee Profile</CardTitle>
              <CardDescription>Detailed information about the selected team member</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Employee profile content */}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
};

export default TeamHierarchyPage;
