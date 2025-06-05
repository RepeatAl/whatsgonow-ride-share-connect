
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { useTranslation } from 'react-i18next';

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

// Language sync component
const LanguageSync = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const { currentLanguage, supportedLanguages } = useLanguageMCP();
  const { i18n } = useTranslation();

  useEffect(() => {
    console.log('[MCPRouter-LanguageSync] Route params:', { 
      lang, 
      currentLanguage, 
      pathname: location.pathname,
      i18nLang: i18n.language 
    });

    // Check if URL language is valid and different from current
    if (lang && supportedLanguages.some(l => l.code === lang)) {
      if (currentLanguage !== lang || i18n.language !== lang) {
        console.log('[MCPRouter-LanguageSync] Syncing language from URL:', lang);
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, currentLanguage, i18n, location.pathname, supportedLanguages]);

  return null;
};

const MCPRouter = () => {
  const { currentLanguage, supportedLanguages } = useLanguageMCP();
  
  console.log('[MCPRouter] Rendering with language:', currentLanguage);
  
  return (
    <Routes>
      {/* Root redirect to default language */}
      <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
      
      {/* Language-specific routes with sync component */}
      <Route path="/:lang/*" element={
        <>
          <LanguageSync />
          <Routes>
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/home" element={<Navigate to={`/${currentLanguage}`} replace />} />
            <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
            <Route path="/faq" element={<PublicRoute><Faq /></PublicRoute>} />
            
            {/* Auth routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/register/success" element={<PublicRoute><RegisterSuccess /></PublicRoute>} />
            <Route path="/pre-register" element={<PublicRoute><PreRegister /></PublicRoute>} />
            <Route path="/pre-register/success" element={<PublicRoute><PreRegisterSuccess /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            
            {/* Public ESG Dashboard */}
            <Route path="/esg-dashboard" element={<PublicRoute><ESGDashboard /></PublicRoute>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/sender" element={<ProtectedRoute><DashboardSender /></ProtectedRoute>} />
            <Route path="/dashboard/driver" element={<ProtectedRoute><DashboardDriver /></ProtectedRoute>} />
            <Route path="/dashboard/cm" element={<ProtectedRoute><DashboardCM /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
            
            <Route path="/admin-enhanced" element={
              <ProtectedRoute>
                <AdminRoute>
                  <DashboardAdminEnhanced />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/system-tests" element={
              <ProtectedRoute>
                <AdminRoute>
                  <SystemTests />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/rls-test" element={
              <ProtectedRoute>
                <AdminRoute>
                  <RlsTest />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          </Routes>
        </>
      } />
      
      {/* Catch legacy routes without language prefix and redirect */}
      <Route path="/login" element={<Navigate to={`/${currentLanguage}/login`} replace />} />
      <Route path="/register" element={<Navigate to={`/${currentLanguage}/register`} replace />} />
      <Route path="/dashboard" element={<Navigate to={`/${currentLanguage}/dashboard`} replace />} />
      <Route path="/profile" element={<Navigate to={`/${currentLanguage}/profile`} replace />} />
      <Route path="/system-tests" element={<Navigate to={`/${currentLanguage}/system-tests`} replace />} />
      <Route path="/rls-test" element={<Navigate to={`/${currentLanguage}/rls-test`} replace />} />
      
      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MCPRouter;
