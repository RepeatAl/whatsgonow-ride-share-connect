import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Suspense, lazy } from "react";
import { useBoundStore } from "./store/store";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { trackPageView } from "./utils/analytics";
import { useLanguageMCP } from "./mcp/language/LanguageMCP";
import { publicRoutes, isPublicRoute, isAlwaysPublicRoute } from "./routes/publicRoutes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthRequired } from "./components/auth/AuthRequired";
import { ROUTES } from "./routes/routes";
import { useAuth } from "./hooks/useAuth";
import { Shell } from "./components/Shell";
import { useToast } from "@/components/ui/use-toast";
import { useSignalR } from "./hooks/useSignalR";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { OfflinePlaceholder } from "./components/OfflinePlaceholder";
import { useTheme } from "@/components/ui/use-theme";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RegisterSuccess = lazy(() => import('./pages/RegisterSuccess'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Support = lazy(() => import('./pages/Support'));
const MobileUpload = lazy(() => import('./pages/MobileUpload'));
const UploadComplete = lazy(() => import('./pages/UploadComplete'));
const Delivery = lazy(() => import('./pages/Delivery'));
const InvoiceDownload = lazy(() => import('./pages/InvoiceDownload'));
const PreRegister = lazy(() => import('./pages/PreRegister'));
const PreRegisterSuccess = lazy(() => import('./pages/PreRegisterSuccess'));
const Legal = lazy(() => import('./pages/Legal'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const About = lazy(() => import('./pages/About'));
const EsgDashboard = lazy(() => import('./pages/EsgDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardSender = lazy(() => import('./pages/DashboardSender'));
const DashboardDriver = lazy(() => import('./pages/DashboardDriver'));
const DashboardCm = lazy(() => import('./pages/DashboardCm'));
const Profile = lazy(() => import('./pages/Profile'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDrafts = lazy(() => import('./pages/OrderDrafts'));
const EditOrderDraft = lazy(() => import('./pages/EditOrderDraft'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const CreateOrder = lazy(() => import('./pages/CreateOrder'));
const Deal = lazy(() => import('./pages/Deal'));
const OfferTransport = lazy(() => import('./pages/OfferTransport'));
const Rides = lazy(() => import('./pages/Rides'));
const CreateRide = lazy(() => import('./pages/CreateRide'));
const EditRide = lazy(() => import('./pages/EditRide'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminValidation = lazy(() => import('./pages/AdminValidation'));
const AdminFeedback = lazy(() => import('./pages/AdminFeedback'));
const AdminPreRegistrations = lazy(() => import('./pages/AdminPreRegistrations'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const TrustManagement = lazy(() => import('./pages/TrustManagement'));
const AdminInvoiceTest = lazy(() => import('./pages/AdminInvoiceTest'));
const EmailTest = lazy(() => import('./pages/EmailTest'));
const RlsTest = lazy(() => import('./pages/RlsTest'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Import new Impressum page
import Impressum from "./pages/Impressum";

const queryClient = new QueryClient();

// Bootstrap component to stabilize the app before rendering
const StabilizedAppBootstrap = ({ children }: { children: React.ReactNode }) => {
  const authInitialized = useBoundStore(state => state.authInitialized);
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();

  // Analytics
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  // SignalR
  useSignalR();

  // Check for language in URL
  const { checkLanguageInURL } = useLanguageMCP();
  useEffect(() => {
    checkLanguageInURL();
  }, [checkLanguageInURL]);

  // Auth check
  useEffect(() => {
    if (!authInitialized) {
      console.warn('App: Auth not initialized, delaying render');
      return;
    }
  }, [authInitialized]);

  // Theme check
  useEffect(() => {
    if (!theme) {
      console.warn('App: Theme not initialized, delaying render');
      return;
    }
  }, [theme]);

  // Check if the current route is public
  const currentRouteIsPublic = isPublicRoute(location.pathname);
  const currentRouteIsAlwaysPublic = isAlwaysPublicRoute(location.pathname);

  // Redirect logic
  useEffect(() => {
    if (!isLoading && isAuthenticated && location.pathname === '/') {
      window.location.href = getLocalizedUrl('/dashboard');
      return;
    }

    if (!isLoading && isAuthenticated && currentRouteIsPublic && !currentRouteIsAlwaysPublic) {
      console.warn('App: User is authenticated but trying to access a public route, redirecting to dashboard');
      window.location.href = getLocalizedUrl('/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, location.pathname, currentRouteIsPublic, currentRouteIsAlwaysPublic, getLocalizedUrl]);

  // Offline check
  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You are offline",
        description: "Some features may not be available",
        variant: "destructive",
      });
    }
  }, [isOnline, toast]);

  // Loading state
  if (!authInitialized || !theme) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  // Render app
  return (
    <>
      {!isOnline ? (
        <OfflinePlaceholder />
      ) : (
        children
      )}
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <StabilizedAppBootstrap>
              <Routes>
                <Route path="/" element={<Shell><Suspense fallback={<>Loading...</>}><Landing /></Suspense></Shell>} />
                <Route path="/:lang" element={<Shell><Suspense fallback={<>Loading...</>}><Landing /></Suspense></Shell>} />
                <Route path="/login" element={<Shell><Suspense fallback={<>Loading...</>}><Login /></Suspense></Shell>} />
                <Route path="/:lang/login" element={<Shell><Suspense fallback={<>Loading...</>}><Login /></Suspense></Shell>} />
                <Route path="/register" element={<Shell><Suspense fallback={<>Loading...</>}><Register /></Suspense></Shell>} />
                <Route path="/:lang/register" element={<Shell><Suspense fallback={<>Loading...</>}><Register /></Suspense></Shell>} />
                <Route path="/register/success" element={<Shell><Suspense fallback={<>Loading...</>}><RegisterSuccess /></Suspense></Shell>} />
                <Route path="/:lang/register/success" element={<Shell><Suspense fallback={<>Loading...</>}><RegisterSuccess /></Suspense></Shell>} />
                <Route path="/forgot-password" element={<Shell><Suspense fallback={<>Loading...</>}><ForgotPassword /></Suspense></Shell>} />
                <Route path="/:lang/forgot-password" element={<Shell><Suspense fallback={<>Loading...</>}><ForgotPassword /></Suspense></Shell>} />
                <Route path="/reset-password" element={<Shell><Suspense fallback={<>Loading...</>}><ResetPassword /></Suspense></Shell>} />
                <Route path="/:lang/reset-password" element={<Shell><Suspense fallback={<>Loading...</>}><ResetPassword /></Suspense></Shell>} />
                <Route path="/faq" element={<Shell><Suspense fallback={<>Loading...</>}><FAQ /></Suspense></Shell>} />
                <Route path="/:lang/faq" element={<Shell><Suspense fallback={<>Loading...</>}><FAQ /></Suspense></Shell>} />
                <Route path="/support" element={<Shell><Suspense fallback={<>Loading...</>}><Support /></Suspense></Shell>} />
                <Route path="/:lang/support" element={<Shell><Suspense fallback={<>Loading...</>}><Support /></Suspense></Shell>} />
                <Route path="/mobile-upload/:sessionId" element={<Shell><Suspense fallback={<>Loading...</>}><MobileUpload /></Suspense></Shell>} />
                <Route path="/:lang/mobile-upload/:sessionId" element={<Shell><Suspense fallback={<>Loading...</>}><MobileUpload /></Suspense></Shell>} />
                <Route path="/upload-complete" element={<Shell><Suspense fallback={<>Loading...</>}><UploadComplete /></Suspense></Shell>} />
                <Route path="/:lang/upload-complete" element={<Shell><Suspense fallback={<>Loading...</>}><UploadComplete /></Suspense></Shell>} />
                <Route path="/delivery/:token" element={<Shell><Suspense fallback={<>Loading...</>}><Delivery /></Suspense></Shell>} />
                <Route path="/:lang/delivery/:token" element={<Shell><Suspense fallback={<>Loading...</>}><Delivery /></Suspense></Shell>} />
                <Route path="/invoice-download/:token" element={<Shell><Suspense fallback={<>Loading...</>}><InvoiceDownload /></Suspense></Shell>} />
                <Route path="/:lang/invoice-download/:token" element={<Shell><Suspense fallback={<>Loading...</>}><InvoiceDownload /></Suspense></Shell>} />
                <Route path="/pre-register" element={<Shell><Suspense fallback={<>Loading...</>}><PreRegister /></Suspense></Shell>} />
                <Route path="/:lang/pre-register" element={<Shell><Suspense fallback={<>Loading...</>}><PreRegister /></Suspense></Shell>} />
                <Route path="/pre-register/success" element={<Shell><Suspense fallback={<>Loading...</>}><PreRegisterSuccess /></Suspense></Shell>} />
                <Route path="/:lang/pre-register/success" element={<Shell><Suspense fallback={<>Loading...</>}><PreRegisterSuccess /></Suspense></Shell>} />
                <Route path="/legal" element={<Shell><Suspense fallback={<>Loading...</>}><Legal /></Suspense></Shell>} />
                <Route path="/:lang/legal" element={<Shell><Suspense fallback={<>Loading...</>}><Legal /></Suspense></Shell>} />
                <Route path="/privacy-policy" element={<Shell><Suspense fallback={<>Loading...</>}><PrivacyPolicy /></Suspense></Shell>} />
                <Route path="/:lang/privacy-policy" element={<Shell><Suspense fallback={<>Loading...</>}><PrivacyPolicy /></Suspense></Shell>} />
                <Route path="/about" element={<Shell><Suspense fallback={<>Loading...</>}><About /></Suspense></Shell>} />
                <Route path="/:lang/about" element={<Shell><Suspense fallback={<>Loading...</>}><About /></Suspense></Shell>} />
                <Route path="/esg-dashboard" element={<Shell><Suspense fallback={<>Loading...</>}><EsgDashboard /></Suspense></Shell>} />
                <Route path="/:lang/esg-dashboard" element={<Shell><Suspense fallback={<>Loading...</>}><EsgDashboard /></Suspense></Shell>} />
                
                {/* Add Impressum route */}
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/:lang/impressum" element={<Impressum />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Dashboard /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/dashboard" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Dashboard /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/sender" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><DashboardSender /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/dashboard/sender" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><DashboardSender /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/driver" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><DashboardDriver /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/dashboard/driver" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><DashboardDriver /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/cm" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><DashboardCm /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/dashboard/cm" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><DashboardCm /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Profile /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/profile" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Profile /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/complete-profile" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><CompleteProfile /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/complete-profile" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><CompleteProfile /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Orders /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/orders" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Orders /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/orders/drafts" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><OrderDrafts /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/orders/drafts" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><OrderDrafts /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/orders/drafts/:draftId/edit" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><EditOrderDraft /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/orders/drafts/:draftId/edit" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><EditOrderDraft /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/myOrders" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><MyOrders /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/myOrders" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><MyOrders /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/create-order" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><CreateOrder /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/create-order" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><CreateOrder /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/deal/:orderId" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Deal /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/deal/:orderId" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Deal /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/offer-transport" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><OfferTransport /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/offer-transport" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><OfferTransport /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/rides" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Rides /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                 <Route path="/:lang/rides" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Rides /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/rides/create" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><CreateRide /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/rides/create" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><CreateRide /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/rides/:rideId/edit" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><EditRide /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/rides/:rideId/edit" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><EditRide /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Feedback /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/feedback" element={
                  <ProtectedRoute>
                    <Shell><Suspense fallback={<>Loading...</>}><Feedback /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><Admin /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><Admin /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminDashboard /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/admin/dashboard" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminDashboard /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin/validation" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminValidation /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/admin/validation" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminValidation /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin/feedback" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminFeedback /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/admin/feedback" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminFeedback /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin/pre-registrations" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminPreRegistrations /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/admin/pre-registrations" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminPreRegistrations /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminUsers /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/:lang/admin/users" element={
                  <ProtectedRoute roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminUsers /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/trust-management" element={
                  <ProtectedRoute roles={['admin', 'cm']}>
                    <Shell><Suspense fallback={<>Loading...</>}><TrustManagement /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                 <Route path="/:lang/trust-management" element={
                  <ProtectedRoute roles={['admin', 'cm']}>
                    <Shell><Suspense fallback={<>Loading...</>}><TrustManagement /></Suspense></Shell>
                  </ProtectedRoute>
                } />
                <Route path="/admin/invoice-test" element={
                  <AuthRequired roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminInvoiceTest /></Suspense></Shell>
                  </AuthRequired>
                } />
                <Route path="/:lang/admin/invoice-test" element={
                  <AuthRequired roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><AdminInvoiceTest /></Suspense></Shell>
                  </AuthRequired>
                } />
                <Route path="/email-test" element={
                  <AuthRequired roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><EmailTest /></Suspense></Shell>
                  </AuthRequired>
                } />
                <Route path="/:lang/email-test" element={
                  <AuthRequired roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><EmailTest /></Suspense></Shell>
                  </AuthRequired>
                } />
                <Route path="/rls-test" element={
                  <AuthRequired roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><RlsTest /></Suspense></Shell>
                  </AuthRequired>
                } />
                 <Route path="/:lang/rls-test" element={
                  <AuthRequired roles={['admin']}>
                    <Shell><Suspense fallback={<>Loading...</>}><RlsTest /></Suspense></Shell>
                  </AuthRequired>
                } />
                <Route path="/404" element={<Shell><Suspense fallback={<>Loading...</>}><NotFound /></Suspense></Shell>} />
                <Route path="/:lang/404" element={<Shell><Suspense fallback={<>Loading...</>}><NotFound /></Suspense></Shell>} />
                <Route path="*" element={<Shell><Suspense fallback={<>Loading...</>}><NotFound /></Suspense></Shell>} />
              </Routes>
            </StabilizedAppBootstrap>
          </I18nextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
