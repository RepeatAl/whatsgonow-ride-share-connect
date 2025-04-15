
import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import ValidationAdmin from "./pages/ValidationAdmin";
import Deal from "./pages/Deal";
import { DeliveryConfirmation } from "./components/delivery/DeliveryConfirmation";
import DeliveryConfirmationPage from "./pages/DeliveryConfirmationPage";
import NotFound from "./pages/NotFound";
import RLSTest from "./pages/RLSTest";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ChatRealtimeProvider } from "./contexts/ChatRealtimeContext";
import InvoiceDownload from "./pages/InvoiceDownload";
import AdminInvoiceTest from "./pages/AdminInvoiceTest";

const Inbox = lazy(() => import("./pages/Inbox"));

const publicRoutes = [
  '/admin/invoice-test',
  '/invoice-download',
  '/',
  '/login',
  '/register'
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // First, check if this is a public route - highest priority
  const isPublicPath = publicRoutes.some(route => 
    location.pathname.startsWith(route)
  );
  
  if (isPublicPath) {
    return <>{children}</>;
  }
  
  // Then handle loading state
  if (loading) {
    return <LoadingFallback />;
  }
  
  // Finally check authentication for non-public routes
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ChatRealtimeProvider>
        <TooltipProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
  path="/admin/invoice-test" 
  element={
    <ProtectedRoute>
      <AdminInvoiceTest />
    </ProtectedRoute>
  }
/>

              <Route path="/invoice-download/:token" element={<InvoiceDownload />} />
              
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
              <Route path="/delivery/:token" element={<DeliveryConfirmationPage />} />
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
              <Route path="/admin/validation" element={<ValidationAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </TooltipProvider>
      </ChatRealtimeProvider>
    </AuthProvider>
  );
}

export default App;
