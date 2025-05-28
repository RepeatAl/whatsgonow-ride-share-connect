
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

export const useAdminGuard = () => {
  const { profile } = useSimpleAuth();
  
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isCM = profile?.role === 'cm';
  const isAdminOrCM = isAdmin || isCM;
  
  return {
    isAdmin,
    isCM,
    isAdminOrCM,
    canManageVideos: isAdmin,
    canViewVideos: isAdminOrCM
  };
};
