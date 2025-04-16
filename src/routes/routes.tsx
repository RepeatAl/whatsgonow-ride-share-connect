
import { lazy } from "react";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import CommunityManager from "@/pages/CommunityManager";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import ValidationAdmin from "@/pages/ValidationAdmin";
import Deal from "@/pages/Deal";
import DeliveryConfirmationPage from "@/pages/DeliveryConfirmationPage";
import NotFound from "@/pages/NotFound";
import InvoiceDownload from "@/pages/InvoiceDownload";
import AdminInvoiceTest from "@/pages/AdminInvoiceTest";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Faq from "@/pages/Faq";
import Support from "@/pages/Support";
import EmailTest from "@/pages/EmailTest";
import CreateOrder from "@/pages/CreateOrder";
import Feedback from "@/pages/Feedback";
import FeedbackAdmin from "@/pages/FeedbackAdmin";

export interface RouteConfig {
  path: string;
  element: JSX.Element;
  protected?: boolean;
  public?: boolean;
}

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
  
  // Protected routes
  { path: "/dashboard", element: <Dashboard />, protected: true },
  { path: "/orders", element: <Orders />, protected: true },
  { path: "/create-order", element: <CreateOrder />, protected: true },
  { path: "/profile", element: <Profile />, protected: true },
  { path: "/feedback", element: <Feedback />, protected: true },
  { path: "/deal/:orderId", element: <Deal />, protected: true },
  
  // Admin routes
  { path: "/admin", element: <Admin />, protected: true },
  { path: "/admin/dashboard", element: <AdminDashboard />, protected: true },
  { path: "/admin/validation", element: <ValidationAdmin />, protected: true },
  { path: "/admin/feedback", element: <FeedbackAdmin />, protected: true },
  { path: "/admin/invoice-test", element: <AdminInvoiceTest />, protected: true },
  { path: "/community-manager", element: <CommunityManager />, protected: true },
  { path: "/email-test", element: <EmailTest />, protected: true },
  
  // 404 route - must be last
  { path: "*", element: <NotFound />, public: true }
];
