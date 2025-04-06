
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { OrganizationChart } from '@/components/OrganizationChart';

const TeamHierarchyPage: React.FC = () => {
  const { users } = useAuth();
  
  return (
    <div className="pb-8">
      <Header
        title="Team Hierarchy"
        subtitle="View your organizational structure"
      />
      
      <OrganizationChart employees={users} />
    </div>
  );
};

export default TeamHierarchyPage;
