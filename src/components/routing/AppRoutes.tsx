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

/**
 * Simplified App Routes - Phase 1 Stabilization
 * Clear route definitions with proper 404 handling
 * No complex language logic - handled by MCPRouter
 */
const AppRoutes: React.FC = () => {
  console.log('[APP-ROUTES] Rendering routes');

  return (
    <Routes>
      {/* Root route */}
      <Route path="" element={<PublicRoute><Landing /></PublicRoute>} />
      
      {/* Pre-register routes */}
      <Route path="pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
      <Route path="pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
      
      {/* Auth routes */}
      <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
      <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      
      {/* Public pages */}
      <Route path="faq" element={<PublicRoute><Faq /></PublicRoute>} />
      <Route path="support" element={<PublicRoute><Support /></PublicRoute>} />
      <Route path="legal" element={<PublicRoute><Legal /></PublicRoute>} />
      <Route path="privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
      
      {/* Public utility routes */}
      <Route path="mobile-upload/:sessionId" element={<PublicRoute><MobileUpload /></PublicRoute>} />
      <Route path="upload-complete" element={<PublicRoute><UploadComplete /></PublicRoute>} />
      <Route path="delivery/:token" element={<PublicRoute><DeliveryConfirmationPage /></PublicRoute>} />
      <Route path="invoice-download/:token" element={<PublicRoute><InvoiceDownload /></PublicRoute>} />
      <Route path="payment/status" element={<PublicRoute><PaymentStatus /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="dashboard/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardAdmin /></ProtectedRoute>} />
      <Route path="dashboard/cm" element={<ProtectedRoute allowedRoles={['cm']}><DashboardCM /></ProtectedRoute>} />
      <Route path="dashboard/driver" element={<ProtectedRoute allowedRoles={['driver']}><DashboardDriver /></ProtectedRoute>} />
      <Route path="dashboard/sender" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DashboardSender /></ProtectedRoute>} />
      <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />

      {/* Order routes */}
      <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="orders/drafts" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftList /></ProtectedRoute>} />
      <Route path="orders/drafts/:draftId/edit" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><DraftEdit /></ProtectedRoute>} />
      <Route path="orders/mine" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="create-order" element={<ProtectedRoute allowedRoles={['sender_private', 'sender_business']}><CreateOrder /></ProtectedRoute>} />
      <Route path="deal/:orderId" element={<ProtectedRoute><Deal /></ProtectedRoute>} />

      {/* Transport routes */}
      <Route path="find-transport" element={<ProtectedRoute><FindTransport /></ProtectedRoute>} />
      <Route path="offer-transport" element={<ProtectedRoute allowedRoles={['driver']}><OfferTransport /></ProtectedRoute>} />

      {/* User features */}
      <Route path="feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="community-manager" element={<ProtectedRoute allowedRoles={['cm']}><CommunityManager /></ProtectedRoute>} />
      <Route path="data-deletion" element={<ProtectedRoute><DataDeletion /></ProtectedRoute>} />
      <Route path="inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
      <Route path="messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="trust-management" element={<ProtectedRoute><TrustManagement /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Admin /></ProtectedRoute>} />
      <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="admin/validation" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ValidationAdmin /></ProtectedRoute>} />
      <Route path="admin/feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><FeedbackAdmin /></ProtectedRoute>} />
      <Route path="admin/pre-registrations" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><PreRegistrationsPage /></ProtectedRoute>} />
      <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UsersPage /></ProtectedRoute>} />
      <Route path="admin/invoice-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminInvoiceTest /></ProtectedRoute>} />
      <Route path="admin/translation-feedback" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackAdmin /></ProtectedRoute>} />
      <Route path="admin/translation-feedback/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TranslationFeedbackDetail /></ProtectedRoute>} />

      {/* Development routes */}
      <Route path="email-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EmailTest /></ProtectedRoute>} />
      <Route path="rls-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><RLSTest /></ProtectedRoute>} />
      <Route path="item-upload-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ItemUploadDemoPage /></ProtectedRoute>} />
      <Route path="create-order-with-items-test" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateOrderWithItemsTest /></ProtectedRoute>} />
      <Route path="shadcn-demo" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShadcnDemo /></ProtectedRoute>} />

      {/* Error handling - Fixed 404 route */}
      <Route path="404" element={<NotFound />} />
      
      {/* Catch all unknown routes - redirect to 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
