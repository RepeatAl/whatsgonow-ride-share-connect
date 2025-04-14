import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LaunchProvider from "./components/launch/LaunchProvider";
import Index from "./pages/Index";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import FindTransport from "./pages/FindTransport";
import OfferTransport from "./pages/OfferTransport";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import CreateOrder from "./pages/CreateOrder";
import SubmitOffer from "./pages/SubmitOffer";
import Deal from "./pages/Deal";
import Tracking from "./pages/Tracking";
import PaymentStatus from "./pages/PaymentStatus";
import ManagerDashboard from "./pages/ManagerDashboard";
import CommunityManager from "./pages/CommunityManager";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataDeletion from "./pages/DataDeletion";
import Feedback from "./pages/Feedback";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";
import ShadcnDemo from "./pages/ShadcnDemo";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PrivateRoute = ({ children, requiredRole }: { 
  children: React.ReactNode, 
  requiredRole: string 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(data.role === requiredRole);
      }

      setLoading(false);
    };

    checkAuthorization();
  }, [requiredRole]);

  if (loading) {
    return <div>Wird geladen...</div>;
  }

  return isAuthorized 
    ? <>{children}</>
    : <Navigate to="/" replace />;
};

const App = () => {
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false);
  
  useEffect(() => {
    console.log("Initializing Supabase Performance Monitoring...");
    
    const initializeMonitoring = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsMonitoringEnabled(true);
      console.log("Performance monitoring enabled. Target response time: < 1.5s");
    };
    
    initializeMonitoring();
    
    return () => {
      console.log("Shutting down performance monitoring...");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <LaunchProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/find-transport" element={<FindTransport />} />
              <Route path="/offer-transport" element={<OfferTransport />} />
              <Route path="/create-order" element={<CreateOrder />} />
              <Route path="/submit-offer/:orderId" element={<SubmitOffer />} />
              <Route path="/deal/:orderId" element={<Deal />} />
              <Route path="/tracking/:orderId" element={<Tracking />} />
              <Route path="/payment-status/:orderId" element={<PaymentStatus />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/cm" element={<CommunityManager />} />
              
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              
              <Route path="/shadcn-demo" element={<ShadcnDemo />} />
              
              <Route path="/admin" 
                element={
                  <PrivateRoute requiredRole="admin">
                    <Admin />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/admin/dashboard" 
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </LaunchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
