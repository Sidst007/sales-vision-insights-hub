
import { UserRole } from "@/contexts/AuthContext";

export type EmployeeStatus = "active" | "inactive" | "pending";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  region: string;
  territory: string;
  status: EmployeeStatus;
  phone?: string;
  address?: string;
  joined?: string;
  target?: number;
  performance?: number;
  manager?: string;
  managerId?: string;
}
