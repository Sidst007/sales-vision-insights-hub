import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@/contexts/AuthContext';
import { OrganizationChart } from '@/components/OrganizationChart';

interface EmployeeNode {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  managerId?: string;
}

const TeamHierarchyPage: React.FC = () => {
  const { user } = useAuth();

  const employees: EmployeeNode[] = [
    {
      id: "admin1",
      name: "Meera Joshi",
      role: UserRole.ADMIN,
      avatar: "https://i.pravatar.cc/300?img=8",
      email: "meera.joshi@salesvision.com",
    },
    {
      id: "tsm1",
      name: "Rajesh Kumar",
      role: UserRole.TSM,
      avatar: "https://i.pravatar.cc/300?img=11",
      managerId: "admin1",
      email: "rajesh.kumar@salesvision.com",
    },
    {
      id: "tsm2",
      name: "Anita Desai",
      role: UserRole.TSM,
      avatar: "https://i.pravatar.cc/300?img=1",
      managerId: "admin1",
      email: "anita.desai@salesvision.com",
    },
    {
      id: "ase1",
      name: "Priya Sharma",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=5",
      managerId: "tsm1",
      email: "priya.sharma@salesvision.com",
    },
    {
      id: "ase2",
      name: "Amit Patel",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=12",
      managerId: "tsm1",
      email: "amit.patel@salesvision.com",
    },
    {
      id: "ase3",
      name: "Neha Gupta",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=2",
      managerId: "tsm1",
      email: "neha.gupta@salesvision.com",
    },
    {
      id: "ase4",
      name: "Vikram Malhotra",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=13",
      managerId: "tsm2",
      email: "vikram.malhotra@salesvision.com",
    },
    {
      id: "ase5",
      name: "Kavita Reddy",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=3",
      managerId: "tsm2",
      email: "kavita.reddy@salesvision.com",
    },
    {
      id: "ase6",
      name: "Deepak Nair",
      role: UserRole.ASE,
      avatar: "https://i.pravatar.cc/300?img=14",
      managerId: "tsm2",
      email: "deepak.nair@salesvision.com",
    },
    {
      id: "asm1",
      name: "Ravi Verma",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=15",
      managerId: "ase1",
      email: "ravi.verma@salesvision.com",
    },
    {
      id: "asm2",
      name: "Sunita Singh",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=4",
      managerId: "ase1",
      email: "sunita.singh@salesvision.com",
    },
    {
      id: "asm3",
      name: "Prakash Mehta",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=16",
      managerId: "ase2",
      email: "prakash.mehta@salesvision.com",
    },
    {
      id: "asm4",
      name: "Meena Khanna",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=5",
      managerId: "ase2",
      email: "meena.khanna@salesvision.com",
    },
    {
      id: "asm5",
      name: "Ajay Mathur",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=17",
      managerId: "ase3",
      email: "ajay.mathur@salesvision.com",
    },
    {
      id: "sr1",
      name: "Rahul Saxena",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=18",
      managerId: "asm1",
      email: "rahul.saxena@salesvision.com",
    },
    {
      id: "sr2",
      name: "Pooja Agarwal",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=6",
      managerId: "asm1",
      email: "pooja.agarwal@salesvision.com",
    },
    {
      id: "sr3",
      name: "Vivek Chauhan",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=19",
      managerId: "asm2",
      email: "vivek.chauhan@salesvision.com",
    },
    {
      id: "sr4",
      name: "Divya Sharma",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=7",
      managerId: "asm2",
      email: "divya.sharma@salesvision.com",
    },
    {
      id: "sr5",
      name: "Suresh Kapoor",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=20",
      managerId: "asm3",
      email: "suresh.kapoor@salesvision.com",
    },
    {
      id: "kam1",
      name: "Sunita Reddy",
      role: UserRole.KAM,
      avatar: "https://i.pravatar.cc/300?img=9",
      managerId: "admin1",
      email: "sunita.reddy@salesvision.com",
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
