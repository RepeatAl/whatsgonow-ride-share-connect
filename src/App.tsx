
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataDeletion from "./pages/DataDeletion";
import Feedback from "./pages/Feedback";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";
import LaunchProvider from "./components/launch/LaunchProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false);
  
  useEffect(() => {
    // Simulating Supabase Performance Monitoring initialization
    console.log("Initializing Supabase Performance Monitoring...");
    
    const initializeMonitoring = async () => {
      // Simulate monitoring initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsMonitoringEnabled(true);
      console.log("Performance monitoring enabled. Target response time: < 1.5s");
    };
    
    initializeMonitoring();
    
    return () => {
      console.log("Shutting down performance monitoring...");
      // Cleanup monitoring if needed
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
              
              {/* GDPR Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              
              {/* Feedback & Support Routes */}
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
