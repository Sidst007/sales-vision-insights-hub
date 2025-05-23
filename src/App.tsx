
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import TeamPage from "./pages/TeamPage";
import DataInputPage from "./pages/DataInputPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import ComparisonPage from "./pages/ComparisonPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import TeamHierarchyPage from "./pages/TeamHierarchyPage";
import ProfileDetailPage from "./pages/ProfileDetailPage";
import AdminDataPage from './pages/AdminDataPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/team-hierarchy" element={<TeamHierarchyPage />} />
              <Route path="/data-input" element={<DataInputPage />} />
              <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/employee/:employeeId" element={<EmployeeDetailPage />} />
              <Route path="/profile/:employeeId" element={<ProfileDetailPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/employee-management" element={<EmployeeManagementPage />} />
              <Route path="/admin-data" element={<AdminDataPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              {/* Updated routes with proper pages */}
              <Route path="/targets" element={<DashboardPage />} />
              <Route path="/compensation" element={<DashboardPage />} />
              <Route path="/accounts" element={<DashboardPage />} />
              <Route path="/analytics" element={<DashboardPage />} />
              <Route path="/settings" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
