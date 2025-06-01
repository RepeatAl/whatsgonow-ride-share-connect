
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

// Import pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import Dashboard from '@/pages/Dashboard';
import DashboardSender from '@/pages/DashboardSender';
import Profile from '@/pages/Profile';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ESGDashboard from '@/pages/ESGDashboard';
import Faq from '@/pages/Faq';
import NotFound from '@/pages/NotFound';
import Feedback from '@/pages/Feedback';
import RlsTest from '@/pages/RLSTest';
import SystemTests from '@/pages/SystemTests';

// Import dashboard pages
import DashboardDriver from '@/pages/dashboard/DashboardDriver';
import DashboardCM from '@/pages/dashboard/DashboardCM';
import DashboardAdmin from '@/pages/dashboard/DashboardAdmin';
import DashboardAdminEnhanced from '@/pages/dashboard/DashboardAdminEnhanced';

// Import route guards
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const MCPRouter = () => {
  const { currentLanguage } = useLanguageMCP();
  
  console.log('[MCPRouter] Current language:', currentLanguage);
  
  return (
    <Routes>
      {/* Root redirect to default language */}
      <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
      
      {/* Language-specific routes */}
      <Route path="/:lang" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/:lang/home" element={<Navigate to={`/${currentLanguage}`} replace />} />
      <Route path="/:lang/about" element={<PublicRoute><About /></PublicRoute>} />
      <Route path="/:lang/faq" element={<PublicRoute><Faq /></PublicRoute>} />
      
      {/* Auth routes */}
      <Route path="/:lang/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/:lang/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/:lang/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
      <Route path="/:lang/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
      <Route path="/:lang/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
      <Route path="/:lang/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/:lang/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      
      {/* Public ESG Dashboard - accessible to everyone */}
      <Route path="/:lang/esg-dashboard" element={<PublicRoute><ESGDashboard /></PublicRoute>} />
      
      {/* Protected routes - Main Dashboard with role-based redirect */}
      <Route path="/:lang/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Protected routes - Role-specific Dashboards */}
      <Route path="/:lang/dashboard/sender" element={<ProtectedRoute><DashboardSender /></ProtectedRoute>} />
      <Route path="/:lang/dashboard/driver" element={<ProtectedRoute><DashboardDriver /></ProtectedRoute>} />
      <Route path="/:lang/dashboard/cm" element={<ProtectedRoute><DashboardCM /></ProtectedRoute>} />
      <Route path="/:lang/dashboard/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
      
      {/* Enhanced Admin Dashboard */}
      <Route path="/:lang/admin-enhanced" element={
        <ProtectedRoute>
          <AdminRoute>
            <DashboardAdminEnhanced />
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Admin Tools */}
      <Route path="/:lang/system-tests" element={
        <ProtectedRoute>
          <AdminRoute>
            <SystemTests />
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/:lang/rls-test" element={
        <ProtectedRoute>
          <AdminRoute>
            <RlsTest />
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Other protected routes */}
      <Route path="/:lang/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/:lang/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      
      {/* Catch legacy routes without language prefix and redirect */}
      <Route path="/login" element={<Navigate to={`/${currentLanguage}/login`} replace />} />
      <Route path="/register" element={<Navigate to={`/${currentLanguage}/register`} replace />} />
      <Route path="/dashboard" element={<Navigate to={`/${currentLanguage}/dashboard`} replace />} />
      <Route path="/profile" element={<Navigate to={`/${currentLanguage}/profile`} replace />} />
      <Route path="/system-tests" element={<Navigate to={`/${currentLanguage}/system-tests`} replace />} />
      <Route path="/rls-test" element={<Navigate to={`/${currentLanguage}/rls-test`} replace />} />
      
      {/* 404 fallback - show proper NotFound page instead of redirecting */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MCPRouter;
