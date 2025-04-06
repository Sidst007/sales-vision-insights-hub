
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { OrganizationChart } from '@/components/OrganizationChart';
import { Card, CardContent } from '@/components/ui/card';

const TeamHierarchyPage: React.FC = () => {
  const { user } = useAuth();
  
  // Normally this data would come from an API or context
  // For now, we'll use hardcoded data that matches the AuthContext
  const employees = [
    {
      id: "admin1",
      name: "Meera Joshi",
      role: "Administrator",
      avatar: "https://i.pravatar.cc/300?img=8",
    },
    {
      id: "tsm1",
      name: "Rajesh Kumar",
      role: "Territory Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=11",
      managerId: "admin1"
    },
    {
      id: "tsm2",
      name: "Anita Desai",
      role: "Territory Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=1",
      managerId: "admin1"
    },
    {
      id: "ase1",
      name: "Priya Sharma",
      role: "Area Sales Executive",
      avatar: "https://i.pravatar.cc/300?img=5",
      managerId: "tsm1"
    },
    {
      id: "ase2",
      name: "Amit Patel",
      role: "Area Sales Executive",
      avatar: "https://i.pravatar.cc/300?img=12",
      managerId: "tsm1"
    },
    {
      id: "ase3",
      name: "Neha Gupta",
      role: "Area Sales Executive",
      avatar: "https://i.pravatar.cc/300?img=2",
      managerId: "tsm1"
    },
    {
      id: "ase4",
      name: "Vikram Malhotra",
      role: "Area Sales Executive",
      avatar: "https://i.pravatar.cc/300?img=13",
      managerId: "tsm2"
    },
    {
      id: "ase5",
      name: "Kavita Reddy",
      role: "Area Sales Executive",
      avatar: "https://i.pravatar.cc/300?img=3",
      managerId: "tsm2"
    },
    {
      id: "ase6",
      name: "Deepak Nair",
      role: "Area Sales Executive",
      avatar: "https://i.pravatar.cc/300?img=14",
      managerId: "tsm2"
    },
    {
      id: "asm1",
      name: "Ravi Verma",
      role: "Area Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=15",
      managerId: "ase1"
    },
    {
      id: "asm2",
      name: "Sunita Singh",
      role: "Area Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=4",
      managerId: "ase1"
    },
    {
      id: "asm3",
      name: "Prakash Mehta",
      role: "Area Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=16",
      managerId: "ase2"
    },
    {
      id: "asm4",
      name: "Meena Khanna",
      role: "Area Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=5",
      managerId: "ase2"
    },
    {
      id: "asm5",
      name: "Ajay Mathur",
      role: "Area Sales Manager",
      avatar: "https://i.pravatar.cc/300?img=17",
      managerId: "ase3"
    },
    {
      id: "sr1",
      name: "Rahul Saxena",
      role: "Sales Representative",
      avatar: "https://i.pravatar.cc/300?img=18",
      managerId: "asm1"
    },
    {
      id: "sr2",
      name: "Pooja Agarwal",
      role: "Sales Representative",
      avatar: "https://i.pravatar.cc/300?img=6",
      managerId: "asm1"
    },
    {
      id: "sr3",
      name: "Vivek Chauhan",
      role: "Sales Representative",
      avatar: "https://i.pravatar.cc/300?img=19",
      managerId: "asm2"
    },
    {
      id: "sr4",
      name: "Divya Sharma",
      role: "Sales Representative",
      avatar: "https://i.pravatar.cc/300?img=7",
      managerId: "asm2"
    },
    {
      id: "sr5",
      name: "Suresh Kapoor",
      role: "Sales Representative",
      avatar: "https://i.pravatar.cc/300?img=20",
      managerId: "asm3"
    },
    {
      id: "kam1",
      name: "Sunita Reddy",
      role: "Key Account Manager",
      avatar: "https://i.pravatar.cc/300?img=9",
      managerId: "admin1"
    }
  ];
  
  return (
    <div className="pb-8">
      <Header
        title="Team Hierarchy"
        subtitle="View your organizational structure"
        showExport
      />
      
      <div className="container mt-6">
        <Card>
          <CardContent className="p-6 overflow-x-auto">
            <div className="min-w-[800px]">
              <OrganizationChart employees={employees} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamHierarchyPage;
