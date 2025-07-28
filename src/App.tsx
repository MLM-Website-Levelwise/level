import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import AddMember from "./pages/2.Members/AddMember";
import ViewMember from "./pages/2.Members/ViewMember";
import DirectMember from "./pages/2.Members/DirectMember";
import AllDirectMem from "./pages/2.Members/AllDirectMem";
import BankDetails from "./pages/2.Members/BankDetails";
import EditBankDetails from "./pages/2.Members/EditBankDetails";

import LevelTeam from "./pages/3.Geneology/LevelTeam";
import TreeTeam from "./pages/3.Geneology/TreeTeam";

import FundGenerate from "./pages/4.Fund/FundGenerate";
import FundHistory from "./pages/4.Fund/FundHistory";

import AddPackage from "./pages/5.Package/PackageManager";
import { ProtectedRoute } from "./components/ProtectedRoute";

import TodaysRequest from "./pages/6. Withdrawal/TodaysRequest";
import PendingRequest from "./pages/6. Withdrawal/PendingRequest";
import WithdrwalHistory from "./pages/6. Withdrawal/WithdrwalHistory";

import EditMember from "./components/EditMember";

// import Index from "./pages/Index";
// import MembersKYC from "./pages/MembersKYC";
// import ActiveAutopool from "./pages/ActiveAutopool";

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
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />
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

            <Route
              path="/members/allDir"
              element={
                <AdminLayout>
                  <AllDirectMem />
                </AdminLayout>
              }
            />

            <Route
              path="members/members-bankdetails"
              element={
                <AdminLayout>
                  <BankDetails />
                </AdminLayout>
              }
            />
            <Route
              path="/bank-details/edit/:id"
              element={
                <AdminLayout>
                  <EditBankDetails />
                </AdminLayout>
              }
            />

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
            <Route
              path="/master/fund-generate"
              element={
                <AdminLayout>
                  <FundGenerate />
                </AdminLayout>
              }
            />
            <Route
              path="/master/fund-history"
              element={
                <AdminLayout>
                  <FundHistory />
                </AdminLayout>
              }
            />
            <Route
              path="/package/add-package"
              element={
                <AdminLayout>
                  <AddPackage />
                </AdminLayout>
              }
            />
            {/* <Route
            path="/members-kyc"
            element={
              <AdminLayout>
                <MembersKYC />
              </AdminLayout>
            }
          /> */}
            {/* 
          <Route path="/active-autopool" element={
            <AdminLayout>
              <ActiveAutopool />
            </AdminLayout>
          } /> */}
            {/* User Icons */}

            <Route
              path="/members/edit-member/:id"
              element={
                <AdminLayout>
                  <EditMember />
                </AdminLayout>
              }
            />

            <Route
              path="/withdrawal/todays-request"
              element={
                <AdminLayout>
                  <TodaysRequest />
                </AdminLayout>
              }
            />

            <Route
              path="/withdrawal/history"
              element={
                <AdminLayout>
                  <WithdrwalHistory />
                </AdminLayout>
              }
            />

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
          </Route>
          {/* <Route path="/index" element={<Index />} />
          ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
