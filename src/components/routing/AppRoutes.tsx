
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
import DashboardSender from '@/pages/DashboardSender';
import DashboardAdmin from '@/pages/DashboardAdmin';
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
      {/* Language-aware routes - ONLY these routes are active */}
      <Route path="/:lang/*" element={<LanguageRouter><div /></LanguageRouter>} />
      
      {/* Single fallback route to German */}
      <Route path="/" element={<Home />} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
