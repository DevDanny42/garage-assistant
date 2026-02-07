import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { RoleGuard } from "@/components/RoleGuard";
import { Login } from "@/pages/auth/Login";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Customers } from "@/pages/customers/Customers";
import { Vehicles } from "@/pages/vehicles/Vehicles";
import { JobCards } from "@/pages/jobcards/JobCards";
import { Inventory } from "@/pages/inventory/Inventory";
import { Billing } from "@/pages/billing/Billing";
import { Reports } from "@/pages/reports/Reports";
import { Settings } from "@/pages/settings/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<RoleGuard allowedRoles={['admin', 'manager']}><Customers /></RoleGuard>} />
              <Route path="/vehicles" element={<RoleGuard allowedRoles={['admin', 'manager']}><Vehicles /></RoleGuard>} />
              <Route path="/job-cards" element={<JobCards />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/billing" element={<RoleGuard allowedRoles={['admin', 'manager']}><Billing /></RoleGuard>} />
              <Route path="/reports" element={<RoleGuard allowedRoles={['admin']}><Reports /></RoleGuard>} />
              <Route path="/settings" element={<RoleGuard allowedRoles={['admin']}><Settings /></RoleGuard>} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
