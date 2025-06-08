
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Faq from '@/pages/Faq';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import Profile from '@/pages/Profile';
import CompleteProfile from '@/pages/CompleteProfile';
import Dashboard from '@/pages/Dashboard';
import DashboardAdmin from '@/pages/DashboardAdmin';
import DashboardCM from '@/pages/DashboardCM';
import DashboardSender from '@/pages/DashboardSender';
import Inbox from '@/pages/Inbox';
import MyRides from '@/pages/MyRides';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import SystemAuditPage from '@/pages/SystemAudit';
import AdminDashboard from '@/pages/AdminDashboard';

export const MCPRouter = () => {
  const { currentLanguage } = useLanguageMCP();
  const { user, profile, loading } = useOptimizedAuth();

  console.log('[MCPRouter] Current state:', { 
    currentLanguage, 
    hasUser: !!user, 
    hasProfile: !!profile, 
    userRole: profile?.role,
    loading 
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <Routes>
      {/* Language root redirect */}
      <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
      
      {/* Public routes */}
      <Route path={`/${currentLanguage}`} element={
        <PublicRoute>
          <Landing />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/about`} element={
        <PublicRoute>
          <About />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/faq`} element={
        <PublicRoute>
          <Faq />
        </PublicRoute>
      } />
      
      {/* Auth routes */}
      <Route path={`/${currentLanguage}/login`} element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/register`} element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/register/success`} element={
        <PublicRoute>
          <RegisterSuccess />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/forgot-password`} element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/reset-password`} element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/pre-register`} element={
        <PublicRoute>
          <PreRegister />
        </PublicRoute>
      } />
      
      <Route path={`/${currentLanguage}/pre-register/success`} element={
        <PublicRoute>
          <PreRegisterSuccess />
        </PublicRoute>
      } />
      
      {/* Protected routes */}
      <Route path={`/${currentLanguage}/profile`} element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path={`/${currentLanguage}/complete-profile`} element={
        <ProtectedRoute>
          <CompleteProfile />
        </ProtectedRoute>
      } />
      
      {/* UPDATED: Consolidated dashboard routes */}
      <Route path={`/${currentLanguage}/dashboard`} element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* REDIRECT: Old driver dashboard to main dashboard */}
      <Route path={`/${currentLanguage}/dashboard/driver`} element={
        <Navigate to={`/${currentLanguage}/dashboard`} replace />
      } />
      
      <Route path={`/${currentLanguage}/dashboard/admin`} element={
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <DashboardAdmin />
        </ProtectedRoute>
      } />
      
      <Route path={`/${currentLanguage}/dashboard/cm`} element={
        <ProtectedRoute allowedRoles={['cm', 'admin', 'super_admin']}>
          <DashboardCM />
        </ProtectedRoute>
      } />
      
      <Route path={`/${currentLanguage}/dashboard/sender`} element={
        <ProtectedRoute allowedRoles={['sender_private', 'sender_business', 'admin', 'super_admin']}>
          <DashboardSender />
        </ProtectedRoute>
      } />
      
      {/* NEW: Admin tools for system audit and management */}
      <Route path={`/${currentLanguage}/admin`} element={
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path={`/${currentLanguage}/admin/audit`} element={
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <SystemAuditPage />
        </ProtectedRoute>
      } />
      
      {/* Messages and communication */}
      <Route path={`/${currentLanguage}/inbox`} element={
        <ProtectedRoute>
          <Inbox />
        </ProtectedRoute>
      } />
      
      {/* Driver specific routes */}
      <Route path={`/${currentLanguage}/rides`} element={
        <ProtectedRoute allowedRoles={['driver', 'admin', 'super_admin']}>
          <MyRides />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={`/${currentLanguage}`} replace />} />
    </Routes>
  );
};

export default MCPRouter;
