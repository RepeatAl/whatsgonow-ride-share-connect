import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { publicRoutes, isPublicRoute } from "@/routes/publicRoutes";
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
import ValidationAdmin from "./pages/ValidationAdmin";
import Deal from "./pages/Deal";
import { DeliveryConfirmation } from "./components/delivery/DeliveryConfirmation";
import DeliveryConfirmationPage from "./pages/DeliveryConfirmationPage";
import NotFound from "./pages/NotFound";
import RLSTest from "./pages/RLSTest";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ChatRealtimeProvider } from "./contexts/ChatRealtimeContext";
import InvoiceDownload from "./pages/InvoiceDownload";
import AdminInvoiceTest from "./pages/AdminInvoiceTest";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { SenderOrdersProvider } from "./contexts/SenderOrdersContext";

const Inbox = lazy(() => import("./pages/Inbox"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  console.log("🌐 PublicRoute rendered");
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log("🛡️ ProtectedRoute check for:", location.pathname);
  console.log("👤 User authenticated:", !!user);
  console.log("⏳ Auth loading:", loading);
  console.log("🔓 Is public route:", isPublicRoute(location.pathname));
  
  if (isPublicRoute(location.pathname)) {
    console.log("🔓 Öffentliche Route erkannt, direkter Zugriff gewährt:", location.pathname);
    return <>{children}</>;
  }
  
  if (loading) {
    console.log("⏳ Auth loading, showing fallback");
    return <LoadingFallback />;
  }
  
  if (!user) {
    console.log("🔒 Nicht angemeldet, Weiterleitung zum Login:", location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  console.log("✅ User authenticated, rendering protected content");
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ChatRealtimeProvider>
        <SenderOrdersProvider>
          <TooltipProvider>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route 
                  path="/admin/invoice-test" 
                  element={
                    <PublicRoute>
                      <AdminInvoiceTest />
                    </PublicRoute>
                  }
                />

                <Route 
                  path="/invoice-download/:token" 
                  element={
                    <PublicRoute>
                      <InvoiceDownload />
                    </PublicRoute>
                  } 
                />
                
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
                
                <Route 
                  path="/delivery/:token" 
                  element={
                    <PublicRoute>
                      <DeliveryConfirmationPage />
                    </PublicRoute>
                  } 
                />
                
                <Route 
                  path="/inbox" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Inbox />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/inbox/:orderId" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Inbox />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/rls-test" 
                  element={
                    <ProtectedRoute>
                      <RLSTest />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/validation" 
                  element={
                    <ProtectedRoute>
                      <ValidationAdmin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/forgot-password" 
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />
                
                <Route 
                  path="/reset-password" 
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </TooltipProvider>
        </SenderOrdersProvider>
      </ChatRealtimeProvider>
    </AuthProvider>
  );
}

export default App;
