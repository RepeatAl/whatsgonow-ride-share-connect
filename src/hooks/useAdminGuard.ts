
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useMemo } from "react";
import { isAdmin, isCommunityManager, hasElevatedPrivileges } from "@/lib/admin-utils";

export const useAdminGuard = () => {
  const { profile, loading } = useOptimizedAuth();
  
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
    const adminRole = isAdmin(profile);
    const isSuperAdmin = role === 'super_admin';
    const isCM = isCommunityManager(profile);
    const isAdminOrCM = hasElevatedPrivileges(profile);

    return {
      isAdmin: adminRole,
      isSuperAdmin,
      isCM,
      isAdminOrCM,
      canManageVideos: adminRole,
      canViewVideos: isAdminOrCM,
      canManageUsers: adminRole,
      canManageEscalations: adminRole
    };
  }, [profile, loading]);

  return permissions;
};
