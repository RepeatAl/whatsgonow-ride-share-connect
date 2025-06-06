
import React from 'react';
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AccessDeniedMessage } from "./AccessDeniedMessage";
import { isAdmin } from "@/lib/admin-utils";

interface AdminTabGuardProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const AdminTabGuard: React.FC<AdminTabGuardProps> = ({ 
  children, 
  fallbackTitle,
  fallbackDescription 
}) => {
  const { profile, loading, isProfileLoading } = useOptimizedAuth();

  // Show loading spinner during auth or profile loading
  if (loading || isProfileLoading) {
    return <LoadingSpinner />;
  }

  // Check admin privileges
  if (!isAdmin(profile)) {
    return (
      <AccessDeniedMessage 
        title={fallbackTitle}
        description={fallbackDescription}
      />
    );
  }

  return <>{children}</>;
};

export default AdminTabGuard;
