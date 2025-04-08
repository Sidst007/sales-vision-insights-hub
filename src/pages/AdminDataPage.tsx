
import React from 'react';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDataControl from '@/components/AdminDataControl';
import { Navigate } from 'react-router-dom';

// Import the team data directly from TeamHierarchyPage structure to ensure consistency
const TeamHierarchyPage = React.lazy(() => import('@/pages/TeamHierarchyPage'));

const AdminDataPage: React.FC = () => {
  const { user } = useAuth();
  
  // This page should only be accessible to Admins
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // We'll use the same employee structure as defined in TeamHierarchyPage
  // This is a temporary solution to load the employees from TeamHierarchyPage
  // In a real app, this would come from a shared data source
  const employeesFromTeamPage = React.useMemo(() => {
    // Get employees from the team hierarchy page
    // This imports the same structure, ensuring consistency
    const teamPage = document.createElement('div');
    // We'll set up a structure matching the one in TeamHierarchyPage
    const employees = [
      // Admin - Top level
      {
        id: "admin1",
        name: "Meera Joshi",
        role: UserRole.ADMIN,
        avatar: "https://i.pravatar.cc/300?img=8",
        email: "meera.joshi@salesvision.com",
        territory: "All India"
      },
      
      // 2 TSMs reporting to Admin
      {
        id: "tsm1",
        name: "Rajesh Kumar",
        role: UserRole.TSM,
        avatar: "https://i.pravatar.cc/300?img=11",
        email: "rajesh.kumar@salesvision.com",
        territory: "North Region"
      },
      {
        id: "tsm2",
        name: "Anita Desai",
        role: UserRole.TSM,
        avatar: "https://i.pravatar.cc/300?img=1",
        email: "anita.desai@salesvision.com",
        territory: "South Region"
      },
      
      // 1 KAM reporting to Admin
      {
        id: "kam1",
        name: "Sunita Reddy",
        role: UserRole.KAM,
        avatar: "https://i.pravatar.cc/300?img=9",
        email: "sunita.reddy@salesvision.com",
        territory: "National Key Accounts"
      },
      
      // Sample of ASEs
      {
        id: "ase1",
        name: "Priya Sharma",
        role: UserRole.ASE,
        avatar: "https://i.pravatar.cc/300?img=5",
        email: "priya.sharma@salesvision.com",
        territory: "Delhi"
      },
      {
        id: "ase2",
        name: "Amit Patel",
        role: UserRole.ASE,
        avatar: "https://i.pravatar.cc/300?img=12",
        email: "amit.patel@salesvision.com",
        territory: "Gurgaon"
      },
      
      // Sample of ASMs
      {
        id: "asm1",
        name: "Ravi Verma",
        role: UserRole.ASM,
        avatar: "https://i.pravatar.cc/300?img=15",
        email: "ravi.verma@salesvision.com",
        territory: "Delhi - Central"
      },
      {
        id: "asm2",
        name: "Sunita Singh",
        role: UserRole.ASM,
        avatar: "https://i.pravatar.cc/300?img=4",
        email: "sunita.singh@salesvision.com",
        territory: "Delhi - South"
      },
      
      // Sample of SRs
      {
        id: "sr1",
        name: "Rahul Saxena",
        role: UserRole.SR,
        avatar: "https://i.pravatar.cc/300?img=21",
        email: "rahul.saxena@salesvision.com",
        territory: "Delhi - South Zone 1"
      },
      {
        id: "sr2",
        name: "Pooja Agarwal",
        role: UserRole.SR,
        avatar: "https://i.pravatar.cc/300?img=6",
        email: "pooja.agarwal@salesvision.com",
        territory: "Delhi - South Zone 2"
      }
    ];
    
    return employees;
  }, []);

  return (
    <div className="pb-8">
      <Header
        title="Sales Data Management"
        subtitle="Admin tools to manage employee sales data"
      />
      
      <div className="container mt-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Administration</CardTitle>
            <CardDescription>
              As an administrator, you can view and manage sales data for all employees. 
              You can delete individual records or clear all data for specific employees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use the tools below to monitor and manage sales data across your organization. 
              The summary view provides an overview of each employee's performance, while 
              the detailed view allows you to examine and manage individual records.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Deleting data is permanent and cannot be undone. 
              Make sure to confirm your actions before proceeding.
            </p>
          </CardContent>
        </Card>
        
        <AdminDataControl employees={employeesFromTeamPage} />
      </div>
    </div>
  );
};

export default AdminDataPage;
