
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useMemo } from "react";

export const useAdminGuard = () => {
  const { profile, loading } = useSimpleAuth();
  
  const permissions = useMemo(() => {
    if (loading || !profile) {
      return {
        isAdmin: false,
        isSuperAdmin: false,
        isCM: false,
        isAdminOrCM: false,
        canManageVideos: false,
        canViewVideos: false,
        canManageUsers: false,
        canManageEscalations: false
      };
    }

    const role = profile.role;
    const isAdmin = role === 'admin';
    const isSuperAdmin = role === 'super_admin';
    const isCM = role === 'cm';
    const isAdminOrCM = isAdmin || isSuperAdmin || isCM;

    return {
      isAdmin: isAdmin || isSuperAdmin,
      isSuperAdmin,
      isCM,
      isAdminOrCM,
      canManageVideos: isAdmin || isSuperAdmin,
      canViewVideos: isAdminOrCM,
      canManageUsers: isAdmin || isSuperAdmin,
      canManageEscalations: isAdmin || isSuperAdmin
    };
  }, [profile, loading]);

  return permissions;
};
