
import React, { useMemo } from 'react';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { languageCodes } from '@/config/supportedLanguages';
import { determineBestLanguage } from '@/utils/languageUtils';
import { LanguageMCP } from '@/mcp/language/LanguageMCP';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

// Import page components
import Landing from '@/pages/Landing';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Faq from '@/pages/Faq';
import Support from '@/pages/Support';
import Legal from '@/pages/Legal';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import CompleteProfile from '@/pages/CompleteProfile';
import Orders from '@/pages/Orders';
import CreateOrder from '@/pages/CreateOrder';
import Deal from '@/pages/Deal';
import FindTransport from '@/pages/FindTransport';
import OfferTransport from '@/pages/OfferTransport';
import Feedback from '@/pages/Feedback';
import CommunityManager from '@/pages/CommunityManager';
import DataDeletion from '@/pages/DataDeletion';
import Inbox from '@/pages/Inbox';
import Messages from '@/pages/Messages';
import Tracking from '@/pages/Tracking';
import TrustManagement from '@/pages/TrustManagement';
import Admin from '@/pages/Admin';
import AdminAnalytics from '@/pages/AdminAnalytics';
import ValidationAdmin from '@/pages/ValidationAdmin';
import FeedbackAdmin from '@/pages/FeedbackAdmin';
import PreRegistrationsPage from '@/pages/admin/PreRegistrationsPage';
import UsersPage from '@/pages/admin/users';
import AdminInvoiceTest from '@/pages/AdminInvoiceTest';
import TranslationFeedbackAdmin from '@/pages/admin/TranslationFeedbackAdmin';
import TranslationFeedbackDetail from '@/pages/admin/TranslationFeedbackDetail';
import MobileUpload from '@/pages/MobileUpload';
import UploadComplete from '@/pages/UploadComplete';
import DeliveryConfirmationPage from '@/pages/DeliveryConfirmationPage';
import InvoiceDownload from '@/pages/InvoiceDownload';
import PaymentStatus from '@/pages/PaymentStatus';
import DashboardAdmin from '@/pages/DashboardAdmin';
import DashboardCM from '@/pages/DashboardCM';
import DashboardDriver from '@/pages/DashboardDriver';
import DashboardSender from '@/pages/DashboardSender';
import DraftList from '@/pages/orders/DraftList';
import DraftEdit from '@/pages/orders/DraftEdit';
import MyOrders from '@/pages/orders/MyOrders';
import EmailTest from '@/pages/EmailTest';
import RLSTest from '@/pages/RLSTest';
import ItemUploadDemoPage from '@/pages/ItemUploadDemoPage';
import CreateOrderWithItemsTest from '@/pages/CreateOrderWithItemsTest';
import ShadcnDemo from '@/pages/ShadcnDemo';
import NotFound from '@/pages/NotFound';

/**
 * Unified MCP Router - Single Source of Truth
 * Handles language detection AND all routing with proper guards
 */
export const MCPRouter: React.FC = () => {
  const location = useLocation();

  console.log('[MCP-ROUTER] === UNIFIED ROUTER START ===');
  console.log('[MCP-ROUTER] Current path:', location.pathname);

  // Language extraction and redirect logic
  const { language, shouldRedirect, redirectPath } = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    console.log('[MCP-ROUTER] Path segments:', pathSegments);
    
    const firstSegment = pathSegments[0];
    const isValidLanguage = languageCodes.includes(firstSegment);
    
    if (isValidLanguage) {
      console.log('[MCP-ROUTER] Valid language found:', firstSegment);
      return {
        language: firstSegment,
        shouldRedirect: false,
        redirectPath: null
      };
    }
    
    // Only redirect from exact root path
    if (location.pathname === '/' || location.pathname === '') {
      const bestLanguage = determineBestLanguage(
        navigator.language?.split('-')[0],
        localStorage.getItem('i18nextLng')
      );
      
      console.log('[MCP-ROUTER] Redirecting from root to:', bestLanguage);
      return {
        language: bestLanguage,
        shouldRedirect: true,
        redirectPath: `/${bestLanguage}`
      };
    }

    // For any other path, use default language without redirect
    const defaultLang = 'de';
    console.log('[MCP-ROUTER] Using default language for path:', location.pathname);
    return {
      language: defaultLang,
      shouldRedirect: false,
      redirectPath: null
    };
  }, [location.pathname]);

  console.log('[MCP-ROUTER] Final language:', language);

  // Handle redirect only from root
  if (shouldRedirect && redirectPath) {
    console.log('[MCP-ROUTER] Performing redirect to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Unified routing with LanguageMCP
  return (
    <LanguageMCP initialLanguage={language}>
      <Routes>
        {/* Debug route */}
        <Route path="/debug" element={
          <div style={{ padding: '20px' }}>
            <h1>Debug Info</h1>
            <p>Current Language: {language}</p>
            <p>Current Path: {location.pathname}</p>
            <p>Path Segments: {JSON.stringify(location.pathname.split('/').filter(Boolean))}</p>
          </div>
        } />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={`/${language}`} replace />} />
        
        {/* Public routes with language prefix */}
        <Route path="/de" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/en" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/ar" element={<PublicRoute><Landing /></PublicRoute>} />
        
        <Route path="/de/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
        <Route path="/en/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
        <Route path="/ar/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
        
        <Route path="/de/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
        <Route path="/en/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
        <Route path="/ar/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
        
        <Route path="/de/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/en/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/ar/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        <Route path="/de/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/en/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/ar/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route path="/de/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
        <Route path="/en/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
        <Route path="/ar/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
        
        <Route path="/de/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/en/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/ar/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        <Route path="/de/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/en/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/ar/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        
        <Route path="/de/faq" element={<PublicRoute><Faq /></PublicRoute>} />
        <Route path="/en/faq" element={<PublicRoute><Faq /></PublicRoute>} />
        <Route path="/ar/faq" element={<PublicRoute><Faq /></PublicRoute>} />
        
        <Route path="/de/support" element={<PublicRoute><Support /></PublicRoute>} />
        <Route path="/en/support" element={<PublicRoute><Support /></PublicRoute>} />
        <Route path="/ar/support" element={<PublicRoute><Support /></PublicRoute>} />
        
        <Route path="/de/legal" element={<PublicRoute><Legal /></PublicRoute>} />
        <Route path="/en/legal" element={<PublicRoute><Legal /></PublicRoute>} />
        <Route path="/ar/legal" element={<PublicRoute><Legal /></PublicRoute>} />
        
        <Route path="/de/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/en/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/ar/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />

        {/* Public utility routes */}
        <Route path="/mobile-upload/:sessionId" element={<PublicRoute><MobileUpload /></PublicRoute>} />
        <Route path="/upload-complete" element={<PublicRoute><UploadComplete /></PublicRoute>} />
        <Route path="/delivery/:token" element={<PublicRoute><DeliveryConfirmationPage /></PublicRoute>} />
        <Route path="/invoice-download/:token" element={<PublicRoute><InvoiceDownload /></PublicRoute>} />
        <Route path="/payment/status" element={<PublicRoute><PaymentStatus /></PublicRoute>} />

        {/* Protected routes with language prefix */}
        <Route path="/de/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/en/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ar/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/de/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/en/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/ar/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardAdmin /></ProtectedRoute>} />
        
        <Route path="/de/dashboard/cm" element={<ProtectedRoute allowedRoles={['cm']}><DashboardCM /></ProtectedRoute>} />
        <Route path="/en/dashboard/cm" element={<ProtectedRoute allowedRoles={['cm']}><DashboardCM /></ProtectedRoute>} />
        <Route path="/ar/dashboard/cm" element={<ProtectedRoute allowedRoles={['cm']}><DashboardCM /></ProtectedRoute>} />
        
        <Route path="/de/dashboard/driver" element={<ProtectedRoute allowedRoles={['driver']}><DashboardDriver /></ProtectedRoute>} />
        <Route path="/en/dashboard/driver" element={<ProtectedRoute allowedRoles={['driver']}><DashboardDriver /></ProtectedRoute>} />
        <Route path="/ar/dashboard/driver" element={<ProtectedRoute allowedRoles={['driver']}><DashboardDriver /></ProtectedRoute>} />
        
        <Route path="/de/dashboard/sender" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DashboardSender /></ProtectedRoute>} />
        <Route path="/en/dashboard/sender" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DashboardSender /></ProtectedRoute>} />
        <Route path="/ar/dashboard/sender" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DashboardSender /></ProtectedRoute>} />
        
        <Route path="/de/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/en/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/ar/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        <Route path="/de/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path="/en/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path="/ar/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />

        {/* Order routes */}
        <Route path="/de/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/en/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/ar/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        
        <Route path="/de/orders/drafts" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftList /></ProtectedRoute>} />
        <Route path="/en/orders/drafts" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftList /></ProtectedRoute>} />
        <Route path="/ar/orders/drafts" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftList /></ProtectedRoute>} />
        
        <Route path="/de/orders/drafts/:draftId/edit" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftEdit /></ProtectedRoute>} />
        <Route path="/en/orders/drafts/:draftId/edit" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftEdit /></ProtectedRoute>} />
        <Route path="/ar/orders/drafts/:draftId/edit" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftEdit /></ProtectedRoute>} />
        
        <Route path="/de/orders/mine" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/en/orders/mine" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/ar/orders/mine" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        
        <Route path="/de/create-order" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><CreateOrder /></ProtectedRoute>} />
        <Route path="/en/create-order" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><CreateOrder /></ProtectedRoute>} />
        <Route path="/ar/create-order" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><CreateOrder /></ProtectedRoute>} />
        
        <Route path="/de/deal/:orderId" element={<ProtectedRoute><Deal /></ProtectedRoute>} />
        <Route path="/en/deal/:orderId" element={<ProtectedRoute><Deal /></ProtectedRoute>} />
        <Route path="/ar/deal/:orderId" element={<ProtectedRoute><Deal /></ProtectedRoute>} />

        {/* Transport routes */}
        <Route path="/de/find-transport" element={<ProtectedRoute><FindTransport /></ProtectedRoute>} />
        <Route path="/en/find-transport" element={<ProtectedRoute><FindTransport /></ProtectedRoute>} />
        <Route path="/ar/find-transport" element={<ProtectedRoute><FindTransport /></ProtectedRoute>} />
        
        <Route path="/de/offer-transport" element={<ProtectedRoute allowedRoles={['driver']}><OfferTransport /></ProtectedRoute>} />
        <Route path="/en/offer-transport" element={<ProtectedRoute allowedRoles={['driver']}><OfferTransport /></ProtectedRoute>} />
        <Route path="/ar/offer-transport" element={<ProtectedRoute allowedRoles={['driver']}><OfferTransport /></ProtectedRoute>} />

        {/* User features */}
        <Route path="/de/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/en/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/ar/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        
        <Route path="/de/community-manager" element={<ProtectedRoute allowedRoles={['cm']}><CommunityManager /></ProtectedRoute>} />
        <Route path="/en/community-manager" element={<ProtectedRoute allowedRoles={['cm']}><CommunityManager /></ProtectedRoute>} />
        <Route path="/ar/community-manager" element={<ProtectedRoute allowedRoles={['cm']}><CommunityManager /></ProtectedRoute>} />
        
        <Route path="/de/data-deletion" element={<ProtectedRoute><DataDeletion /></ProtectedRoute>} />
        <Route path="/en/data-deletion" element={<ProtectedRoute><DataDeletion /></ProtectedRoute>} />
        <Route path="/ar/data-deletion" element={<ProtectedRoute><DataDeletion /></ProtectedRoute>} />
        
        <Route path="/de/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/en/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/ar/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        
        <Route path="/de/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/en/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/ar/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        
        <Route path="/de/tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        <Route path="/en/tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        <Route path="/ar/tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        
        <Route path="/de/trust-management" element={<ProtectedRoute><TrustManagement /></ProtectedRoute>} />
        <Route path="/en/trust-management" element={<ProtectedRoute><TrustManagement /></ProtectedRoute>} />
        <Route path="/ar/trust-management" element={<ProtectedRoute><TrustManagement /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/de/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Admin /></ProtectedRoute>} />
        <Route path="/en/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Admin /></ProtectedRoute>} />
        <Route path="/ar/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Admin /></ProtectedRoute>} />
        
        <Route path="/de/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/en/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/ar/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAnalytics /></ProtectedRoute>} />
        
        <Route path="/de/admin/validation" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ValidationAdmin /></ProtectedRoute>} />
        <Route path="/en/admin/validation" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ValidationAdmin /></ProtectedRoute>} />
        <Route path="/ar/admin/validation" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ValidationAdmin /></ProtectedRoute>} />
        
        <Route path="/de/admin/feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><FeedbackAdmin /></ProtectedRoute>} />
        <Route path="/en/admin/feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><FeedbackAdmin /></ProtectedRoute>} />
        <Route path="/ar/admin/feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><FeedbackAdmin /></ProtectedRoute>} />
        
        <Route path="/de/admin/pre-registrations" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PreRegistrationsPage /></ProtectedRoute>} />
        <Route path="/en/admin/pre-registrations" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PreRegistrationsPage /></ProtectedRoute>} />
        <Route path="/ar/admin/pre-registrations" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PreRegistrationsPage /></ProtectedRoute>} />
        
        <Route path="/de/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="/en/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="/ar/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UsersPage /></ProtectedRoute>} />
        
        <Route path="/de/admin/invoice-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminInvoiceTest /></ProtectedRoute>} />
        <Route path="/en/admin/invoice-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminInvoiceTest /></ProtectedRoute>} />
        <Route path="/ar/admin/invoice-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminInvoiceTest /></ProtectedRoute>} />
        
        <Route path="/de/admin/translation-feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackAdmin /></ProtectedRoute>} />
        <Route path="/en/admin/translation-feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackAdmin /></ProtectedRoute>} />
        <Route path="/ar/admin/translation-feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackAdmin /></ProtectedRoute>} />
        
        <Route path="/de/admin/translation-feedback/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackDetail /></ProtectedRoute>} />
        <Route path="/en/admin/translation-feedback/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackDetail /></ProtectedRoute>} />
        <Route path="/ar/admin/translation-feedback/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackDetail /></ProtectedRoute>} />

        {/* Development routes */}
        <Route path="/de/email-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EmailTest /></ProtectedRoute>} />
        <Route path="/en/email-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EmailTest /></ProtectedRoute>} />
        <Route path="/ar/email-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EmailTest /></ProtectedRoute>} />
        
        <Route path="/de/rls-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><RLSTest /></ProtectedRoute>} />
        <Route path="/en/rls-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><RLSTest /></ProtectedRoute>} />
        <Route path="/ar/rls-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><RLSTest /></ProtectedRoute>} />
        
        <Route path="/de/item-upload-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ItemUploadDemoPage /></ProtectedRoute>} />
        <Route path="/en/item-upload-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ItemUploadDemoPage /></ProtectedRoute>} />
        <Route path="/ar/item-upload-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ItemUploadDemoPage /></ProtectedRoute>} />
        
        <Route path="/de/create-order-with-items-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateOrderWithItemsTest /></ProtectedRoute>} />
        <Route path="/en/create-order-with-items-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateOrderWithItemsTest /></ProtectedRoute>} />
        <Route path="/ar/create-order-with-items-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateOrderWithItemsTest /></ProtectedRoute>} />
        
        <Route path="/de/shadcn-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShadcnDemo /></ProtectedRoute>} />
        <Route path="/en/shadcn-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShadcnDemo /></ProtectedRoute>} />
        <Route path="/ar/shadcn-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShadcnDemo /></ProtectedRoute>} />

        {/* Error handling */}
        <Route path="/de/404" element={<NotFound />} />
        <Route path="/en/404" element={<NotFound />} />
        <Route path="/ar/404" element={<NotFound />} />
        
        {/* Catch all unknown routes */}
        <Route path="*" element={
          <div style={{ padding: '20px' }}>
            <h1>404 - Route not found</h1>
            <p>Current path: {location.pathname}</p>
            <p>Language: {language}</p>
            <p>Available routes:</p>
            <ul>
              <li>/de, /en, /ar (Landing pages)</li>
              <li>/de/pre-register, /en/pre-register, /ar/pre-register</li>
              <li>/debug (Debug info)</li>
            </ul>
          </div>
        } />
      </Routes>
    </LanguageMCP>
  );
};

export default MCPRouter;
