
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

// Zentrale Definition aller öffentlichen Routen
export const publicRoutes = [
  '/admin/invoice-test',
  '/invoice-download',
  '/',
  '/login',
  '/register'
];

// Hilfsfunktion zum Prüfen, ob eine Route öffentlich ist
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => pathname.startsWith(route));
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// PublicRoute-Komponente, die explizit für öffentliche Routen gedacht ist
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// ProtectedRoute für authentifizierte Routen
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Prüfe zuerst, ob dies eine öffentliche Route ist (höchste Priorität)
  if (isPublicRoute(location.pathname)) {
    console.log("🔓 Öffentliche Route erkannt:", location.pathname);
    return <>{children}</>;
  }
  
  // Wenn noch geladen wird, zeige Ladeindikator
  if (loading) {
    return <LoadingFallback />;
  }
  
  // Wenn kein Benutzer angemeldet ist und Route nicht öffentlich, zum Login weiterleiten
  if (!user) {
    console.log("🔒 Nicht angemeldet, Weiterleitung zum Login:", location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Angemeldet und autorisiert
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ChatRealtimeProvider>
        <TooltipProvider>
          <div className="App">
            <Routes>
              {/* Öffentlich zugängliche Routen ohne Auth-Prüfung */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* AdminInvoiceTest - vollständig öffentlich zugänglich */}
              <Route 
                path="/admin/invoice-test" 
                element={
                  <PublicRoute>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <p className="text-yellow-700">
                        <strong>Hinweis:</strong> Diese Seite ist temporär öffentlich zugänglich für Testzwecke.
                      </p>
                    </div>
                    <AdminInvoiceTest />
                  </PublicRoute>
                }
              />

              {/* InvoiceDownload - öffentlich zugänglich */}
              <Route 
                path="/invoice-download/:token" 
                element={
                  <PublicRoute>
                    <InvoiceDownload />
                  </PublicRoute>
                } 
              />
              
              {/* Geschützte Routen mit Auth-Prüfung */}
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
              
              {/* DeliveryConfirmation - öffentlich zugänglich */}
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
