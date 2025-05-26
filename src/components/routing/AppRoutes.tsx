
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * DEPRECATED - This component is no longer used
 * All routing is now handled by MCPRouter
 * This file is kept only for legacy compatibility and will be removed in future versions
 */
const AppRoutes = () => {
  console.warn('[DEPRECATED] AppRoutes is deprecated. Use MCPRouter instead.');
  return <Navigate to="/de" replace />;
};

export default AppRoutes;
