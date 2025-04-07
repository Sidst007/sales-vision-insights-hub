
import React from 'react';
import Header from '@/components/Header';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDataControl from '@/components/AdminDataControl';
import { Navigate } from 'react-router-dom';
import { TeamHierarchyPage } from '@/pages/TeamHierarchyPage';

const AdminDataPage: React.FC = () => {
  const { user } = useAuth();
  
  // This page should only be accessible to Admins
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Get employees from TeamHierarchyPage data
  const hierarchyPageInstance = new TeamHierarchyPage({});
  const employees = hierarchyPageInstance.render().props.children[1].props.children.props.children.props.children.props.employees;

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
        
        <AdminDataControl employees={employees} />
      </div>
    </div>
  );
};

export default AdminDataPage;
