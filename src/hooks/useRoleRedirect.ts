
// src/hooks/useRoleRedirect.ts
// This file follows the conventions from /docs/conventions/roles_and_ids.md
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

/**
 * Hook to redirect users to their role-specific dashboard
 * Usage: Place in a component mounted at /dashboard
 * FIXED: Only redirect from exact /dashboard path to avoid conflicts
 */
export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useOptimizedAuth();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      navigate("/login");
      return;
    }

    // FIXED: Only redirect from exact /dashboard path, not subpaths
    const currentPath = location.pathname;
    console.log("🔄 useRoleRedirect: Current path:", currentPath, "Role:", profile.role);
    
    // Only redirect if we're on the generic dashboard route
    if (!currentPath.endsWith('/dashboard')) {
      console.log("🔄 useRoleRedirect: Not on generic dashboard, skipping redirect");
      return;
    }

    switch (profile.role) {
      case "sender_private":
      case "sender_business":
        console.log("🔄 useRoleRedirect: Redirecting sender to /dashboard/sender");
        navigate("/dashboard/sender", { replace: true });
        break;
      case "driver":
        console.log("🔄 useRoleRedirect: Redirecting driver to /dashboard/driver");
        navigate("/dashboard/driver", { replace: true });
        break;
      case "cm":
        console.log("🔄 useRoleRedirect: Redirecting CM to /dashboard/cm");
        navigate("/dashboard/cm", { replace: true });
        break;
      case "admin":
      case "super_admin":
        console.log("🔄 useRoleRedirect: Redirecting admin to /dashboard/admin");
        navigate("/dashboard/admin", { replace: true });
        break;
      default:
        console.log("🔄 useRoleRedirect: Unknown role, staying on /dashboard");
        // Stay on generic dashboard for unknown roles
    }
  }, [profile, loading, navigate, location.pathname]);
};
