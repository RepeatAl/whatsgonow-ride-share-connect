
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Import new pages
import Impressum from "./pages/Impressum";
import Legal from "./pages/Legal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";

// Basic pages - only import what exists
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><span className="loading loading-dots loading-lg"></span></div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/:lang" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/:lang/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/:lang/register" element={<Register />} />
                
                {/* FAQ routes */}
                <Route path="/faq" element={<Faq />} />
                <Route path="/:lang/faq" element={<Faq />} />
                
                {/* Legal pages routes */}
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/:lang/impressum" element={<Impressum />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/:lang/legal" element={<Legal />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/:lang/privacy-policy" element={<PrivacyPolicy />} />
                
                <Route path="/404" element={<NotFound />} />
                <Route path="/:lang/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
