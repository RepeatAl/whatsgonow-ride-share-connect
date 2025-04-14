import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CommunityManager from "./pages/CommunityManager";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Deal from "./pages/Deal";
import { DeliveryConfirmation } from "./components/delivery/DeliveryConfirmation";
import DeliveryConfirmationPage from "./pages/DeliveryConfirmationPage";
import NotFound from "./pages/NotFound";
import RLSTest from "./pages/RLSTest";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-order" 
              element={
                <ProtectedRoute>
                  <CreateOrder />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community-manager" 
              element={
                <ProtectedRoute>
                  <CommunityManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/deal/:orderId" 
              element={
                <ProtectedRoute>
                  <Deal />
                </ProtectedRoute>
              } 
            />
            <Route path="/delivery/:token" element={<DeliveryConfirmationPage />} />
            <Route 
              path="/rls-test" 
              element={
                <ProtectedRoute>
                  <RLSTest />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
