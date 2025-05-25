
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Import all page components
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

// Pre-register pages
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';

// Auth success pages
import RegisterSuccess from '@/pages/RegisterSuccess';

// Public pages
import Faq from '@/pages/Faq';
import Support from '@/pages/Support';
import Legal from '@/pages/Legal';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

// Public utility pages
import MobileUpload from '@/pages/MobileUpload';
import UploadComplete from '@/pages/UploadComplete';
import DeliveryConfirmationPage from '@/pages/DeliveryConfirmationPage';
import InvoiceDownload from '@/pages/InvoiceDownload';
import PaymentStatus from '@/pages/PaymentStatus';

// Dashboard pages
import DashboardAdmin from '@/pages/DashboardAdmin';
import DashboardCM from '@/pages/DashboardCM';
import DashboardDriver from '@/pages/DashboardDriver';
import DashboardSender from '@/pages/DashboardSender';
import CompleteProfile from '@/pages/CompleteProfile';

// Order pages
import Orders from '@/pages/Orders';
import DraftList from '@/pages/orders/DraftList';
import DraftEdit from '@/pages/orders/DraftEdit';
import MyOrders from '@/pages/orders/MyOrders';
import CreateOrder from '@/pages/CreateOrder';
import Deal from '@/pages/Deal';

// Transport pages
import FindTransport from '@/pages/FindTransport';
import OfferTransport from '@/pages/OfferTransport';

// User feature pages
import Feedback from '@/pages/Feedback';
import CommunityManager from '@/pages/CommunityManager';
import DataDeletion from '@/pages/DataDeletion';
import Inbox from '@/pages/Inbox';
import Messages from '@/pages/Messages';
import Tracking from '@/pages/Tracking';
import TrustManagement from '@/pages/TrustManagement';

// Admin pages
import Admin from '@/pages/Admin';
import AdminAnalytics from '@/pages/AdminAnalytics';
import ValidationAdmin from '@/pages/ValidationAdmin';
import FeedbackAdmin from '@/pages/FeedbackAdmin';
import PreRegistrationsPage from '@/pages/admin/PreRegistrationsPage';
import UsersPage from '@/pages/admin/users';
import AdminInvoiceTest from '@/pages/AdminInvoiceTest';
import TranslationFeedbackAdmin from '@/pages/admin/TranslationFeedbackAdmin';
import TranslationFeedbackDetail from '@/pages/admin/TranslationFeedbackDetail';

// Development pages
import EmailTest from '@/pages/EmailTest';
import RLSTest from '@/pages/RLSTest';
import ItemUploadDemoPage from '@/pages/ItemUploadDemoPage';
import CreateOrderWithItemsTest from '@/pages/CreateOrderWithItemsTest';
import ShadcnDemo from '@/pages/ShadcnDemo';

/**
 * Legacy App Routes - NOW DEPRECATED
 * This component is kept for backward compatibility but should not be used.
 * All routing is now handled by MCPRouter which provides multilingual support.
 * 
 * @deprecated Use MCPRouter instead
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Legacy redirect to MCPRouter */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
