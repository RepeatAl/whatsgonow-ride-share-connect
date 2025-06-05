import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

/**
 * DEPRECATED - This component is no longer used
 * All routing is now handled by MCPRouter
 * This file is kept only for legacy compatibility and will be removed in future versions
 */
import HereMapDemo from "@/pages/HereMapDemo";

const AppRoutes = () => {
  console.warn('[DEPRECATED] AppRoutes is deprecated. Use MCPRouter instead.');
  return (
    <Routes>
      <Route path="/de" element={<Navigate to="/de" replace />} />
      
      {/* HERE Maps Demo Route */}
      <Route path="/here-maps-demo" element={<HereMapDemo />} />
      
      <Route path="*" element={<Navigate to="/de" replace />} />
    </Routes>
  );
};

export default AppRoutes;
