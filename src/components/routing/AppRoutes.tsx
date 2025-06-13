
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

// Import all page components
import Home from '@/pages/Home';
import Legal from '@/pages/Legal';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Faq from '@/pages/Faq';
import Support from '@/pages/Support';
import PreRegister from '@/pages/PreRegister';
import PreRegisterSuccess from '@/pages/PreRegisterSuccess';
import HereMapDemo from '@/pages/HereMapDemo';
import HereMapFeaturesDemo from '@/pages/HereMapFeaturesDemo';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  const { currentLanguage } = useLanguageMCP();

  return (
    <Routes>
      {/* Language-based routes */}
      <Route path={`/${currentLanguage}`} element={<Home />} />
      <Route path={`/${currentLanguage}/legal`} element={<Legal />} />
      <Route path={`/${currentLanguage}/privacy-policy`} element={<PrivacyPolicy />} />
      <Route path={`/${currentLanguage}/about`} element={<About />} />
      <Route path={`/${currentLanguage}/login`} element={<Login />} />
      <Route path={`/${currentLanguage}/register`} element={<Register />} />
      <Route path={`/${currentLanguage}/register/success`} element={<RegisterSuccess />} />
      <Route path={`/${currentLanguage}/forgot-password`} element={<ForgotPassword />} />
      <Route path={`/${currentLanguage}/reset-password`} element={<ResetPassword />} />
      <Route path={`/${currentLanguage}/faq`} element={<Faq />} />
      <Route path={`/${currentLanguage}/support`} element={<Support />} />
      <Route path={`/${currentLanguage}/pre-register`} element={<PreRegister />} />
      <Route path={`/${currentLanguage}/pre-register/success`} element={<PreRegisterSuccess />} />
      <Route path={`/${currentLanguage}/here-map-demo`} element={<HereMapDemo />} />
      <Route path={`/${currentLanguage}/here-maps-features`} element={<HereMapFeaturesDemo />} />
      
      {/* Root redirect to current language */}
      <Route path="/" element={<Navigate to={`/${currentLanguage}`} replace />} />
      
      {/* Fallback for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
