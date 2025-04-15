import { lazy } from "react";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import CreateOrder from "@/pages/CreateOrder";
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
import RLSTest from "@/pages/RLSTest";
import InvoiceDownload from "@/pages/InvoiceDownload";
import AdminInvoiceTest from "@/pages/AdminInvoiceTest";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Faq from "@/pages/Faq";
import AdminAnalytics from "@/pages/AdminAnalytics";
import FeedbackAdmin from "@/pages/FeedbackAdmin";

const Inbox = lazy(() => import("@/pages/Inbox"));

export interface RouteConfig {
  path: string;
  element: JSX.Element;
  protected?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { path: "/", element: <Index />, public: true },
  { path: "/login", element: <Login />, public: true },
  { path: "/register", element: <Register />, public: true },
  { path: "/admin/invoice-test", element: <AdminInvoiceTest />, public: true },
  { path: "/invoice-download/:token", element: <InvoiceDownload />, public: true },
  { path: "/dashboard", element: <Dashboard />, protected: true },
  { path: "/orders", element: <Orders />, protected: true },
  { path: "/create-order", element: <CreateOrder />, protected: true },
  { path: "/profile", element: <Profile />, protected: true },
  { path: "/community-manager", element: <CommunityManager />, protected: true },
  { path: "/admin", element: <Admin />, protected: true },
  { path: "/admin-dashboard", element: <AdminDashboard />, protected: true },
  { path: "/deal/:orderId", element: <Deal />, protected: true },
  { path: "/delivery/:token", element: <DeliveryConfirmationPage />, public: true },
  { path: "/inbox", element: <Inbox />, protected: true },
  { path: "/inbox/:orderId", element: <Inbox />, protected: true },
  { path: "/rls-test", element: <RLSTest />, protected: true },
  { path: "/admin/validation", element: <ValidationAdmin />, protected: true },
  { path: "/admin/analytics", element: <AdminAnalytics />, protected: true },
  { path: "/admin/feedback", element: <FeedbackAdmin />, protected: true },
  { path: "/forgot-password", element: <ForgotPassword />, public: true },
  { path: "/reset-password", element: <ResetPassword />, public: true },
  { path: "/faq", element: <Faq />, public: true },
  { path: "*", element: <NotFound />, public: true }
];
