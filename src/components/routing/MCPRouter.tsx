import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

// Import pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import Dashboard from '@/pages/Dashboard';
import DashboardSender from '@/pages/DashboardSender';
import Profile from '@/pages/Profile';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ESGDashboard from '@/pages/ESGDashboard';
import Faq from '@/pages/Faq';

// Import dashboard pages
import DashboardDriver from '@/pages/dashboard/DashboardDriver';
import DashboardCM from '@/pages/dashboard/DashboardCM';
import DashboardAdmin from '@/pages/dashboard/DashboardAdmin';

// Import route guards
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

const MCPRouter = () => {
  const { currentLanguage } = useLanguageMCP();
  
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
      
      {/* Language-specific routes */}
      <Route path="/:lang" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/:lang/about" element={<PublicRoute><About /></PublicRoute>} />
      <Route path="/:lang/faq" element={<PublicRoute><Faq /></PublicRoute>} />
      <Route path="/:lang/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/:lang/register" element={<PublicRoute><Register /></PublicRoute>} />
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
      
      {/* Other protected routes */}
      <Route path="/:lang/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to={`/${currentLanguage}`} replace />} />
    </Routes>
  );
};

export default MCPRouter;
