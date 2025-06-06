import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageRouter } from './LanguageRouter';

// Import all pages
import Home from '@/pages/Home';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import CompleteProfile from '@/pages/CompleteProfile';
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import CreateOrder from '@/pages/CreateOrder';
import FindTransport from '@/pages/FindTransport';
import OfferTransport from '@/pages/OfferTransport';
import MyRides from '@/pages/MyRides';
import CreateRide from '@/pages/CreateRide';
import Messages from '@/pages/Messages';
import Deal from '@/pages/Deal';
import Tracking from '@/pages/Tracking';
import PaymentStatus from '@/pages/PaymentStatus';
import DeliveryConfirmationPage from '@/pages/DeliveryConfirmationPage';
import UploadComplete from '@/pages/UploadComplete';
import MobileUpload from '@/pages/MobileUpload';
import Feedback from '@/pages/Feedback';
import Support from '@/pages/Support';
import Faq from '@/pages/Faq';
import Legal from '@/pages/Legal';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import DataDeletion from '@/pages/DataDeletion';
import HereMapDemo from '@/pages/HereMapDemo';
import HereMapFeatureDemo from '@/pages/HereMapFeatureDemo';

// Admin pages
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminInvoiceTest from '@/pages/AdminInvoiceTest';
import FeedbackAdmin from '@/pages/FeedbackAdmin';
import ValidationAdmin from '@/pages/ValidationAdmin';
import CommunityManager from '@/pages/CommunityManager';
import ManagerDashboard from '@/pages/ManagerDashboard';
import TrustManagement from '@/pages/TrustManagement';
import ESGDashboard from '@/pages/ESGDashboard';
import SubmitOffer from '@/pages/SubmitOffer';
import InvoiceDownload from '@/pages/InvoiceDownload';
import Inbox from '@/pages/Inbox';

// Test and development pages
import Debug from '@/pages/Debug';
import SystemTests from '@/pages/SystemTests';
import RLSTest from '@/pages/RLSTest';
import ShadcnDemo from '@/pages/ShadcnDemo';
import EmailTest from '@/pages/EmailTest';
import ItemUploadDemoPage from '@/pages/ItemUploadDemoPage';
import CreateOrderWithItemsTest from '@/pages/CreateOrderWithItemsTest';

// Protected route components
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Language-aware routes */}
      <Route path="/:lang/*" element={<LanguageRouter><div /></LanguageRouter>} />
      
      {/* Default routes (fallback to German) */}
      <Route path="/" element={<Home />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pre-register" element={<PreRegister />} />
      <Route path="/pre-register-success" element={<PreRegisterSuccess />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      
      {/* HERE Maps Demo Routes */}
      <Route path="/here-maps-demo" element={<HereMapDemo />} />
      <Route path="/here-maps-features" element={<HereMapFeatureDemo />} />
      
      {/* Protected routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/create-order" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
      <Route path="/find-transport" element={<ProtectedRoute><FindTransport /></ProtectedRoute>} />
      <Route path="/offer-transport" element={<ProtectedRoute><OfferTransport /></ProtectedRoute>} />
      <Route path="/my-rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
      <Route path="/create-ride" element={<ProtectedRoute><CreateRide /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
      <Route path="/deal/:dealId" element={<ProtectedRoute><Deal /></ProtectedRoute>} />
      <Route path="/tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="/payment-status/:orderId" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
      <Route path="/delivery-confirmation/:orderId" element={<ProtectedRoute><DeliveryConfirmationPage /></ProtectedRoute>} />
      <Route path="/upload-complete" element={<ProtectedRoute><UploadComplete /></ProtectedRoute>} />
      <Route path="/mobile-upload" element={<ProtectedRoute><MobileUpload /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="/submit-offer/:orderId" element={<ProtectedRoute><SubmitOffer /></ProtectedRoute>} />
      <Route path="/invoice-download/:invoiceId" element={<ProtectedRoute><InvoiceDownload /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/invoice-test" element={<AdminRoute><AdminInvoiceTest /></AdminRoute>} />
      <Route path="/admin/feedback" element={<AdminRoute><FeedbackAdmin /></AdminRoute>} />
      <Route path="/admin/validation" element={<AdminRoute><ValidationAdmin /></AdminRoute>} />
      <Route path="/admin/trust-management" element={<AdminRoute><TrustManagement /></AdminRoute>} />
      <Route path="/admin/esg-dashboard" element={<AdminRoute><ESGDashboard /></AdminRoute>} />
      
      {/* Community Manager routes */}
      <Route path="/community-manager" element={<ProtectedRoute><CommunityManager /></ProtectedRoute>} />
      <Route path="/manager-dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
      
      {/* Public pages */}
      <Route path="/support" element={<Support />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/about" element={<About />} />
      
      {/* Development and test routes */}
      <Route path="/debug" element={<Debug />} />
      <Route path="/system-tests" element={<SystemTests />} />
      <Route path="/rls-test" element={<AdminRoute><RLSTest /></AdminRoute>} />
      <Route path="/shadcn-demo" element={<ShadcnDemo />} />
      <Route path="/email-test" element={<AdminRoute><EmailTest /></AdminRoute>} />
      <Route path="/item-upload-demo" element={<ItemUploadDemoPage />} />
      <Route path="/create-order-items-test" element={<ProtectedRoute><CreateOrderWithItemsTest /></ProtectedRoute>} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
