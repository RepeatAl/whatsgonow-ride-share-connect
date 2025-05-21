
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import ROUTES from "@/routes/routes";
import { useLanguage } from "@/contexts/language";

// Lazy-loaded pages
const Landing = lazy(() => import("../../pages/Landing"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const RegisterSuccess = lazy(() => import("../../pages/RegisterSuccess"));
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../../pages/ResetPassword"));
const Faq = lazy(() => import("../../pages/Faq"));
const Support = lazy(() => import("../../pages/Support"));
const MobileUpload = lazy(() => import("../../pages/MobileUpload"));
const UploadComplete = lazy(() => import("../../pages/UploadComplete"));
const DeliveryConfirmation = lazy(() => import("../../pages/DeliveryConfirmationPage"));
const InvoiceDownload = lazy(() => import("../../pages/InvoiceDownload"));
const PreRegister = lazy(() => import("../../pages/PreRegister"));
const PreRegisterSuccess = lazy(() => import("../../pages/PreRegisterSuccess"));
const DataDeletion = lazy(() => import("../../pages/DataDeletion"));

// Dashboard and profile pages
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const SenderDashboard = lazy(() => import("../../pages/dashboard/DashboardSender"));
const DriverDashboard = lazy(() => import("../../pages/dashboard/DashboardDriver"));
const CommunityManagerDashboard = lazy(() => import("../../pages/dashboard/DashboardCM"));
const Profile = lazy(() => import("../../pages/Profile"));
const CompleteProfile = lazy(() => import("../../pages/CompleteProfile"));

// Order and transport pages
const Orders = lazy(() => import("../../pages/Orders"));
const OrderDrafts = lazy(() => import("../../pages/orders/DraftList"));
const OrderDraftEdit = lazy(() => import("../../pages/orders/DraftEdit"));
const MyOrders = lazy(() => import("../../pages/orders/MyOrders"));
const CreateOrder = lazy(() => import("../../pages/CreateOrder"));
const Deal = lazy(() => import("../../pages/Deal"));
const OfferTransport = lazy(() => import("../../pages/OfferTransport"));

// Feedback page
const FeedbackPage = lazy(() => import("../../pages/Feedback"));

// Admin and management pages
import Admin from "../../pages/Admin";
import AdminDashboard from "../../pages/AdminDashboard";
import ValidationAdmin from "../../pages/ValidationAdmin";
import FeedbackAdmin from "../../pages/FeedbackAdmin";
import PreRegistrationsPage from "../../pages/admin/PreRegistrationsPage";
import AdminUserManagement from "../../pages/admin/users";
import TrustManagement from "../../pages/TrustManagement";

// Dev/Test Pages
const InvoiceTest = lazy(() => import("../../pages/AdminInvoiceTest"));
const EmailTest = lazy(() => import("../../pages/EmailTest"));
const RlsTest = lazy(() => import("../../pages/RLSTest"));

// Error page
const NotFound = lazy(() => import("../../pages/NotFound"));

export const AppRoutes = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/faq" element={<PublicRoute><Faq /></PublicRoute>} />
      <Route path="/support" element={<PublicRoute><Support /></PublicRoute>} />
      <Route path="/mobile-upload/:sessionId" element={<PublicRoute><MobileUpload /></PublicRoute>} />
      <Route path="/upload-complete" element={<PublicRoute><UploadComplete /></PublicRoute>} />
      <Route path="/delivery/:token" element={<PublicRoute><DeliveryConfirmation /></PublicRoute>} />
      <Route path="/invoice-download/:token" element={<PublicRoute><InvoiceDownload /></PublicRoute>} />
      <Route path="/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
      <Route path="/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
      <Route path="/data-deletion" element={<PublicRoute><DataDeletion /></PublicRoute>} />
      <Route path="/404" element={<PublicRoute><NotFound /></PublicRoute>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/sender" element={<SenderDashboard />} />
        <Route path="/dashboard/driver" element={<DriverDashboard />} />
        <Route path="/dashboard/cm" element={<CommunityManagerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/drafts" element={<OrderDrafts />} />
        <Route path="/orders/drafts/:draftId/edit" element={<OrderDraftEdit />} />
        <Route path="/orders/mine" element={<MyOrders />} />
        <Route path="/create-order" element={<CreateOrder />} />
        <Route path="/deal/:orderId" element={<Deal />} />
        
        <Route path="/offer-transport" element={<OfferTransport />} />
        
        <Route path="/feedback" element={<FeedbackPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/validation" element={<ValidationAdmin />} />
        <Route path="/admin/feedback" element={<FeedbackAdmin />} />
        <Route path="/admin/pre-registrations" element={<PreRegistrationsPage />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/trust-management" element={<TrustManagement />} />
        
        {/* Dev/Test Routes */}
        <Route path="/admin/invoice-test" element={<InvoiceTest />} />
        <Route path="/email-test" element={<EmailTest />} />
        <Route path="/rls-test" element={<RlsTest />} />
      </Route>

      {/* Catch-all to NotFound page */}
      <Route path="*" element={<Navigate to={`/${currentLanguage}/404`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
