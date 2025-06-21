import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
// Dashbord
import Dashboard from "./pages/Dashboard";
// Member
import AddMember from "./pages/2.Members/AddMember";
import ViewMember from "./pages/2.Members/ViewMember";
import DirectMember from "./pages/2.Members/DirectMember";
// Geneology
import LevelTeam from "./pages/3.Geneology/LevelTeam";
import TreeTeam from "./pages/3.Geneology/TreeTeam";
// Package
import AddPackage from "./pages/4.Package/PackageManager";
// Fund
import FundGenerate from "./pages/5.Fund/FundGenerate";
import FundHistory from "./pages/5.Fund/FundHistory";
import GrowthFund from "./pages/5.Fund/GrowthFund";
import ProfitSharingFund from "./pages/5.Fund/ProfitSharingFund";
// Income
// Withdrawal

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          {/* Members */}
          <Route
            path="/members/add-member"
            element={
              <AdminLayout>
                <AddMember />
              </AdminLayout>
            }
          />
          <Route
            path="/members/view-members"
            element={
              <AdminLayout>
                <ViewMember />
              </AdminLayout>
            }
          />
          <Route
            path="/members/direct-members"
            element={
              <AdminLayout>
                <DirectMember />
              </AdminLayout>
            }
          />
          {/* Geneology */}
          <Route
            path="/geneology/level-wise-team"
            element={
              <AdminLayout>
                <LevelTeam />
              </AdminLayout>
            }
          />
          <Route
            path="/geneology/binary-team"
            element={
              <AdminLayout>
                <TreeTeam />
              </AdminLayout>
            }
          />

          {/* Package */}
          <Route
            path="/package/add-package"
            element={
              <AdminLayout>
                <AddPackage />
              </AdminLayout>
            }
          />
          {/* Fund */}
          {/* <Route
            path="/fund/growth-fund"
            element={
              <AdminLayout>
                <GrowthFund />
              </AdminLayout>
            }
          />
          <Route
            path="/fund/profitsharing-fund"
            element={
              <AdminLayout>
                <ProfitSharingFund />
              </AdminLayout>
            }
          /> */}
          <Route
            path="/fund/fund-generate"
            element={
              <AdminLayout>
                <FundGenerate />
              </AdminLayout>
            }
          />
          <Route
            path="/fund/fund-history"
            element={
              <AdminLayout>
                <FundHistory />
              </AdminLayout>
            }
          />
          {/* Income */}
          {/* Withdrawal */}
          {/* User Icons */}
          <Route
            path="/profile"
            element={
              <AdminLayout>
                <Profile />
              </AdminLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AdminLayout>
                <Settings />
              </AdminLayout>
            }
          />
          {/* <Route path="/index" element={<Index />} />
          ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
