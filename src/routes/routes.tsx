import { RouteConfig } from "@/components/routing/AppRoutes";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Faq from "@/pages/Faq";
import Support from "@/pages/Support";
import DeliveryConfirmationPage from "@/pages/DeliveryConfirmationPage";
import InvoiceDownload from "@/pages/InvoiceDownload";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import CreateOrder from "@/pages/CreateOrder";
import Deal from "@/pages/Deal";
import Feedback from "@/pages/Feedback";
import PreRegister from "@/pages/PreRegister";
import PreRegisterSuccess from "@/pages/PreRegisterSuccess";
import DashboardSender from "@/pages/dashboard/DashboardSender";
import DashboardDriver from "@/pages/dashboard/DashboardDriver";
import DashboardCM from "@/pages/dashboard/DashboardCM";
import DashboardAdmin from "@/pages/dashboard/DashboardAdmin";
import CommunityManager from "@/pages/CommunityManager";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import ValidationAdmin from "@/pages/ValidationAdmin";
import FeedbackAdmin from "@/pages/FeedbackAdmin";
import AdminInvoiceTest from "@/pages/AdminInvoiceTest";
import EmailTest from "@/pages/EmailTest";
import NotFound from "@/pages/NotFound";

export const routes: RouteConfig[] = [
  // Public routes
  { path: "/", element: <Index />, public: true },
  { path: "/login", element: <Login />, public: true },
  { path: "/register", element: <Register />, public: true },
  { path: "/forgot-password", element: <ForgotPassword />, public: true },
  { path: "/reset-password", element: <ResetPassword />, public: true },
  { path: "/faq", element: <Faq />, public: true },
  { path: "/support", element: <Support />, public: true },
  { path: "/delivery/:token", element: <DeliveryConfirmationPage />, public: true },
  { path: "/invoice-download/:token", element: <InvoiceDownload />, public: true },
  { path: "/pre-register", element: <PreRegister />, public: true },
  { path: "/pre-register/success", element: <PreRegisterSuccess />, public: true },

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
  { path: "/create-order", element: <CreateOrder />, protected: true },
  { path: "/deal/:orderId", element: <Deal />, protected: true },
  { path: "/feedback", element: <Feedback />, protected: true },

  // Admin & CM tools
  { path: "/community-manager", element: <CommunityManager />, protected: true },
  { path: "/admin", element: <Admin />, protected: true },
  { path: "/admin/dashboard", element: <AdminDashboard />, protected: true },
  { path: "/admin/validation", element: <ValidationAdmin />, protected: true },
  { path: "/admin/feedback", element: <FeedbackAdmin />, protected: true },
  { path: "/admin/invoice-test", element: <AdminInvoiceTest />, protected: true },
  { path: "/email-test", element: <EmailTest />, protected: true },

  // 404 - last
  { path: "*", element: <NotFound />, public: true },
];
