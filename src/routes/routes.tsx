import { RouteConfig } from "@/components/routing/AppRoutes";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy loaded components
const Home = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const RegisterSuccess = lazy(() => import("@/pages/RegisterSuccess"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Faq = lazy(() => import("@/pages/Faq"));
const Support = lazy(() => import("@/pages/Support"));
const DeliveryConfirmationPage = lazy(() => import("@/pages/DeliveryConfirmationPage"));
const InvoiceDownload = lazy(() => import("@/pages/InvoiceDownload"));
const Profile = lazy(() => import("@/pages/Profile"));
const Orders = lazy(() => import("@/pages/Orders"));
const CreateOrder = lazy(() => import("@/pages/CreateOrder"));
const Deal = lazy(() => import("@/pages/Deal"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const PreRegister = lazy(() => import("@/pages/PreRegister"));
const PreRegisterSuccess = lazy(() => import("@/pages/PreRegisterSuccess"));
const DashboardSender = lazy(() => import("@/pages/dashboard/DashboardSender"));
const DashboardDriver = lazy(() => import("@/pages/dashboard/DashboardDriver"));
const DashboardCM = lazy(() => import("@/pages/dashboard/DashboardCM"));
const DashboardAdmin = lazy(() => import("@/pages/dashboard/DashboardAdmin"));
const CommunityManager = lazy(() => import("@/pages/CommunityManager"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ValidationAdmin = lazy(() => import("@/pages/ValidationAdmin"));
const FeedbackAdmin = lazy(() => import("@/pages/FeedbackAdmin"));
const AdminInvoiceTest = lazy(() => import("@/pages/AdminInvoiceTest"));
const EmailTest = lazy(() => import("@/pages/EmailTest"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const OfferTransport = lazy(() => import("@/pages/OfferTransport"));
const PreRegistrationsPage = lazy(() => import("@/pages/admin/PreRegistrationsPage"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminHome = lazy(() => import("@/pages/admin/index"));
const UsersPage = lazy(() => import("@/pages/admin/users"));
const CompleteProfile = lazy(() => import("@/pages/CompleteProfile"));
const MobileUpload = lazy(() => import("@/pages/MobileUpload"));
const UploadComplete = lazy(() => import("@/pages/UploadComplete"));
const DraftList = lazy(() => import("@/pages/orders/DraftList"));
const DraftEdit = lazy(() => import("@/pages/orders/DraftEdit"));
const MyOrders = lazy(() => import("@/pages/orders/MyOrders"));
const Inbox = lazy(() => import("@/pages/Inbox"));
const Messages = lazy(() => import("@/pages/Messages"));
const FindDriverPage = lazy(() => import("@/pages/find-driver"));
const OrderPreviewPage = lazy(() => import("@/pages/driver/OrderPreviewPage"));

export const routes: RouteConfig[] = [
  // Public routes
  { path: "/", element: <Home />, public: true },
  { path: "/login", element: <Login />, public: true },
  { path: "/register", element: <Register />, public: true },
  { path: "/register/success", element: <RegisterSuccess />, public: true },
  { path: "/forgot-password", element: <ForgotPassword />, public: true },
  { path: "/reset-password", element: <ResetPassword />, public: true },
  { path: "/faq", element: <Faq />, public: true },
  { path: "/support", element: <Support />, public: true },
  { path: "/delivery/:token", element: <DeliveryConfirmationPage />, public: true },
  { path: "/invoice-download/:token", element: <InvoiceDownload />, public: true },
  { path: "/pre-register", element: <PreRegister />, public: true },
  { path: "/pre-register/success", element: <PreRegisterSuccess />, public: true },
  { 
    path: "/mobile-upload/:sessionId", 
    element: <MobileUpload />, 
    public: true 
  },
  { 
    path: "/upload-complete", 
    element: <UploadComplete />, 
    public: true 
  },
  { path: "/chat", element: <Navigate to="/inbox" replace />, public: true },
  { path: "/inbox", element: <Inbox />, public: true },
  { path: "/messages", element: <Messages />, public: true },

  // Dashboard redirect entry (evaluates role)
  { path: "/dashboard", element: <DashboardSender />, protected: true },
  
  // Role-specific dashboards
  { path: "/dashboard/sender", element: <DashboardSender />, protected: true },
  { path: "/dashboard/driver", element: <DashboardDriver />, protected: true },
  { path: "/dashboard/cm", element: <DashboardCM />, protected: true },
  { path: "/dashboard/admin", element: <DashboardAdmin />, protected: true },

  // Protected application routes
  { path: "/profile", element: <Profile />, protected: true },
  { path: "/orders", element: <Orders />, protected: true },
  { path: "/orders/drafts", element: <DraftList />, protected: true },
  { path: "/orders/drafts/:draftId/edit", element: <DraftEdit />, protected: true },
  { path: "/orders/mine", element: <MyOrders />, protected: true },
  { path: "/create-order", element: <CreateOrder />, protected: true },
  { path: "/deal/:orderId", element: <Deal />, protected: true },
  { path: "/feedback", element: <Feedback />, protected: true },
  { 
    path: "/offer-transport", 
    element: <OfferTransport />, 
    protected: true 
  },
  { 
    path: "/complete-profile", 
    element: <CompleteProfile />, 
    protected: true 
  },

  // Admin & CM tools
  { path: "/community-manager", element: <CommunityManager />, protected: true },
  { path: "/admin", element: <Admin />, protected: true },
  { path: "/admin/dashboard", element: <AdminDashboard />, protected: true },
  { path: "/admin/validation", element: <ValidationAdmin />, protected: true },
  { path: "/admin/feedback", element: <FeedbackAdmin />, protected: true },
  { path: "/admin/invoice-test", element: <AdminInvoiceTest />, protected: true },
  { path: "/admin/pre-registrations", element: <PreRegistrationsPage />, protected: true },
  { path: "/email-test", element: <EmailTest />, protected: true },

  // Admin routes with nested structure
  {
    path: "/admin",
    element: <AdminLayout />,
    protected: true,
    children: [
      { path: "", element: <AdminHome /> },
      { path: "dashboard", element: <DashboardAdmin /> },
      { path: "pre-registrations", element: <PreRegistrationsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "feedback", element: <FeedbackAdmin /> },
    ]
  },

  // 404 - last
  { path: "*", element: <NotFound />, public: true },
  
  // Add new routes
  {
    path: "/find-driver",
    element: <FindDriverPage />,
    protected: true,
  },
  {
    path: "/find-driver/all",
    element: <FindDriverPage />,
    protected: true,
  },
  {
    path: "/driver/order-preview",
    element: <OrderPreviewPage />,
    protected: true,
  },
];
