
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
  isDottedLine?: boolean;
  performance?: number;
}

const TeamHierarchyPage: React.FC = () => {
  const { user } = useAuth();

  // Define employees with the correct hierarchy
  // 1 Admin, 2 TSMs (1 male, 1 female), 6 ASEs, 12 ASMs, 24 SRs, 1 KAM (female)
  const employees: EmployeeNode[] = [
    // Admin - Top level
    {
      id: "admin1",
      name: "Meera Joshi",
      role: UserRole.ADMIN,
      avatar: "https://i.pravatar.cc/300?img=8",
      email: "meera.joshi@salesvision.com",
    },
    
    // 2 TSMs reporting to Admin (1 male, 1 female)
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
    
    // 1 KAM (female) reporting to Admin, who looks after ASMs and ASEs
    {
      id: "kam1",
      name: "Sunita Reddy",
      role: UserRole.KAM,
      avatar: "https://i.pravatar.cc/300?img=9",
      managerId: "admin1",
      email: "sunita.reddy@salesvision.com",
    },
    
    // 6 ASEs (3 report to each TSM)
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
    
    // 12 ASMs (2 reporting to each ASE)
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
      id: "asm6",
      name: "Divya Iyer",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=10",
      managerId: "ase3",
      email: "divya.iyer@salesvision.com",
    },
    {
      id: "asm7",
      name: "Kiran Shah",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=18",
      managerId: "ase4",
      email: "kiran.shah@salesvision.com",
    },
    {
      id: "asm8",
      name: "Leela Menon",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=6",
      managerId: "ase4",
      email: "leela.menon@salesvision.com",
    },
    {
      id: "asm9",
      name: "Dinesh Kapoor",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=19",
      managerId: "ase5",
      email: "dinesh.kapoor@salesvision.com",
    },
    {
      id: "asm10",
      name: "Aisha Khan",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=7",
      managerId: "ase5",
      email: "aisha.khan@salesvision.com",
    },
    {
      id: "asm11",
      name: "Vikrant Saxena",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=20",
      managerId: "ase6",
      email: "vikrant.saxena@salesvision.com",
    },
    {
      id: "asm12",
      name: "Anjali Rao",
      role: UserRole.ASM,
      avatar: "https://i.pravatar.cc/300?img=29",
      managerId: "ase6",
      email: "anjali.rao@salesvision.com",
    },
    
    // 24 SRs (2 reporting to each ASM)
    {
      id: "sr1",
      name: "Rahul Saxena",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=21",
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
      avatar: "https://i.pravatar.cc/300?img=22",
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
      avatar: "https://i.pravatar.cc/300?img=23",
      managerId: "asm3",
      email: "suresh.kapoor@salesvision.com",
    },
    {
      id: "sr6",
      name: "Nisha Roy",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=8",
      managerId: "asm3",
      email: "nisha.roy@salesvision.com",
    },
    {
      id: "sr7",
      name: "Manoj Tiwari",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=24",
      managerId: "asm4",
      email: "manoj.tiwari@salesvision.com",
    },
    {
      id: "sr8",
      name: "Ananya Das",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=9",
      managerId: "asm4",
      email: "ananya.das@salesvision.com",
    },
    {
      id: "sr9",
      name: "Harish Narayan",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=25",
      managerId: "asm5",
      email: "harish.narayan@salesvision.com",
    },
    {
      id: "sr10",
      name: "Ritu Garg",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=10",
      managerId: "asm5",
      email: "ritu.garg@salesvision.com",
    },
    {
      id: "sr11",
      name: "Pankaj Jha",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=26",
      managerId: "asm6",
      email: "pankaj.jha@salesvision.com",
    },
    {
      id: "sr12",
      name: "Swati Malhotra",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=11",
      managerId: "asm6",
      email: "swati.malhotra@salesvision.com",
    },
    {
      id: "sr13",
      name: "Anil Kumar",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=27",
      managerId: "asm7",
      email: "anil.kumar@salesvision.com",
    },
    {
      id: "sr14",
      name: "Geeta Bose",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=12",
      managerId: "asm7", 
      email: "geeta.bose@salesvision.com",
    },
    {
      id: "sr15",
      name: "Vinod Thakur",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=28",
      managerId: "asm8",
      email: "vinod.thakur@salesvision.com",
    },
    {
      id: "sr16",
      name: "Maya Sinha",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=13",
      managerId: "asm8",
      email: "maya.sinha@salesvision.com",
    },
    {
      id: "sr17",
      name: "Ramesh Tiwari",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=30",
      managerId: "asm9",
      email: "ramesh.tiwari@salesvision.com",
    },
    {
      id: "sr18",
      name: "Sarika Gupta",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=14",
      managerId: "asm9",
      email: "sarika.gupta@salesvision.com",
    },
    {
      id: "sr19",
      name: "Deepak Sharma",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=31",
      managerId: "asm10",
      email: "deepak.sharma@salesvision.com",
    },
    {
      id: "sr20",
      name: "Jyoti Verma",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=15",
      managerId: "asm10",
      email: "jyoti.verma@salesvision.com",
    },
    {
      id: "sr21",
      name: "Alok Mishra",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=32",
      managerId: "asm11",
      email: "alok.mishra@salesvision.com",
    },
    {
      id: "sr22",
      name: "Prerna Patel",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=16",
      managerId: "asm11",
      email: "prerna.patel@salesvision.com",
    },
    {
      id: "sr23",
      name: "Sanjay Batra",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=33",
      managerId: "asm12",
      email: "sanjay.batra@salesvision.com",
    },
    {
      id: "sr24",
      name: "Smita Choudhury",
      role: UserRole.SR,
      avatar: "https://i.pravatar.cc/300?img=17",
      managerId: "asm12",
      email: "smita.choudhury@salesvision.com",
    },
  ];

  // Add dotted connections between KAM and ASMs/ASEs
  // This adds virtual connections that the KAM oversees without being direct manager
  const kamConnections = employees
    .filter(emp => emp.role === UserRole.ASM || emp.role === UserRole.ASE)
    .map(emp => ({
      id: `kam-connection-${emp.id}`,
      name: emp.name,
      role: emp.role,
      avatar: emp.avatar,
      email: emp.email,
      managerId: "kam1",
      isDottedLine: true, // This indicates a dotted line connection (advisory)
      performance: Math.floor(Math.random() * 15) + 85 // Random performance between 85-100
    }));

  // Combine all employees including the KAM connections for visualization
  const allEmployeesWithConnections = [...employees];

  // Add performance data to all employees for visualization
  const employeesWithPerformance = allEmployeesWithConnections.map(emp => ({
    ...emp,
    performance: emp.performance || Math.floor(Math.random() * 15) + 85 // Add random performance if not set
  }));

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
            <div className="min-w-[1000px] min-h-[800px]">
              <OrganizationChart 
                employees={employeesWithPerformance}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamHierarchyPage;
