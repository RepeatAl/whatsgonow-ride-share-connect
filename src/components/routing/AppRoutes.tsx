import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import DashboardAdmin from '@/pages/DashboardAdmin';
import DashboardCM from '@/pages/DashboardCM';
import DashboardDriver from '@/pages/DashboardDriver';
import DashboardSender from '@/pages/DashboardSender';
import CreateOrder from '@/pages/CreateOrder';
import FindTransport from '@/pages/FindTransport';
import OfferTransport from '@/pages/OfferTransport';
import Admin from '@/pages/Admin';
import ValidationAdmin from '@/pages/ValidationAdmin';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import CompleteProfile from '@/pages/CompleteProfile';
import RegisterSuccess from '@/pages/RegisterSuccess';
import Deal from '@/pages/Deal';
import Faq from '@/pages/Faq';
import FeedbackAdmin from '@/pages/FeedbackAdmin';
import Feedback from '@/pages/Feedback';
import Orders from '@/pages/Orders';
import DraftEdit from '@/pages/orders/DraftEdit';
import DraftList from '@/pages/orders/DraftList';
import MyOrders from '@/pages/orders/MyOrders';
import Legal from '@/pages/Legal';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import PaymentStatus from '@/pages/PaymentStatus';
import DeliveryConfirmationPage from '@/pages/DeliveryConfirmationPage';
import InvoiceDownload from '@/pages/InvoiceDownload';
import MobileUpload from '@/pages/MobileUpload';
import UploadComplete from '@/pages/UploadComplete';
import AdminAnalytics from '@/pages/AdminAnalytics';
import CommunityManager from '@/pages/CommunityManager';
import DataDeletion from '@/pages/DataDeletion';
import EmailTest from '@/pages/EmailTest';
import AdminInvoiceTest from '@/pages/AdminInvoiceTest';
import Tracking from '@/pages/Tracking';
import RLSTest from '@/pages/RLSTest';
import ItemUploadDemoPage from '@/pages/ItemUploadDemoPage';
import Inbox from '@/pages/Inbox';
import Messages from '@/pages/Messages';
import CreateOrderWithItemsTest from '@/pages/CreateOrderWithItemsTest';
import TrustManagement from '@/pages/TrustManagement';
import ShadcnDemo from '@/pages/ShadcnDemo';
import UsersPage from '@/pages/admin/users';
import PreRegistrationsPage from '@/pages/admin/PreRegistrationsPage';
import Support from '@/pages/Support';

// Neu importierte Seiten
import TranslationFeedbackAdmin from '@/pages/admin/TranslationFeedbackAdmin';
import TranslationFeedbackDetail from '@/pages/admin/TranslationFeedbackDetail';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
      <Route path="/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
      <Route path="/faq" element={<PublicRoute><Faq /></PublicRoute>} />
      <Route path="/support" element={<PublicRoute><Support /></PublicRoute>} />
      <Route path="/mobile-upload/:sessionId" element={<PublicRoute><MobileUpload /></PublicRoute>} />
      <Route path="/upload-complete" element={<PublicRoute><UploadComplete /></PublicRoute>} />
      <Route path="/delivery/:token" element={<PublicRoute><DeliveryConfirmationPage /></PublicRoute>} />
      <Route path="/invoice-download/:token" element={<PublicRoute><InvoiceDownload /></PublicRoute>} />
      <Route path="/legal" element={<PublicRoute><Legal /></PublicRoute>} />
      <Route path="/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
      <Route path="/payment/status" element={<PublicRoute><PaymentStatus /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardAdmin /></ProtectedRoute>} />
      <Route path="/dashboard/cm" element={<ProtectedRoute allowedRoles={['cm']}><DashboardCM /></ProtectedRoute>} />
      <Route path="/dashboard/driver" element={<ProtectedRoute allowedRoles={['driver']}><DashboardDriver /></ProtectedRoute>} />
      <Route path="/dashboard/sender" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DashboardSender /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/orders/drafts" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftList /></ProtectedRoute>} />
      <Route path="/orders/drafts/:draftId/edit" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftEdit /></ProtectedRoute>} />
      <Route path="/orders/mine" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/create-order" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><CreateOrder /></ProtectedRoute>} />
      <Route path="/deal/:orderId" element={<ProtectedRoute><Deal /></ProtectedRoute>} />
      <Route path="/find-transport" element={<ProtectedRoute><FindTransport /></ProtectedRoute>} />
      <Route path="/offer-transport" element={<ProtectedRoute allowedRoles={['driver']}><OfferTransport /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="/community-manager" element={<ProtectedRoute allowedRoles={['cm']}><CommunityManager /></ProtectedRoute>} />
      <Route path="/data-deletion" element={<ProtectedRoute><DataDeletion /></ProtectedRoute>} />
      <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
      <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="/trust-management" element={<ProtectedRoute><TrustManagement /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Admin /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/validation" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ValidationAdmin /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><FeedbackAdmin /></ProtectedRoute>} />
      <Route path="/admin/pre-registrations" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PreRegistrationsPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UsersPage /></ProtectedRoute>} />
      <Route path="/admin/invoice-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminInvoiceTest /></ProtectedRoute>} />
      
      {/* Neue Translation Feedback Admin Routes */}
      <Route path="/admin/translation-feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackAdmin /></ProtectedRoute>} />
      <Route path="/admin/translation-feedback/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackDetail /></ProtectedRoute>} />

      {/* Development routes */}
      <Route path="/email-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EmailTest /></ProtectedRoute>} />
      <Route path="/rls-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><RLSTest /></ProtectedRoute>} />
      <Route path="/item-upload-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ItemUploadDemoPage /></ProtectedRoute>} />
      <Route path="/create-order-with-items-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateOrderWithItemsTest /></ProtectedRoute>} />
      <Route path="/shadcn-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShadcnDemo /></ProtectedRoute>} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
