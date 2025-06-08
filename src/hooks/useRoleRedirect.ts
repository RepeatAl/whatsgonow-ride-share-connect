
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

/**
 * FIXED: Stabilized role redirect hook to prevent infinite loops
 * Only redirects from exact /dashboard path to avoid conflicts
 */
export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useOptimizedAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // FIXED: Don't do anything while loading or if already redirected
    if (loading || hasRedirectedRef.current) return;

    if (!profile) {
      navigate("/login");
      return;
    }

    // FIXED: Only redirect from exact /dashboard path
    const currentPath = location.pathname;
    console.log("🔄 useRoleRedirect: Current path:", currentPath, "Role:", profile.role);
    
    if (!currentPath.endsWith('/dashboard')) {
      console.log("🔄 useRoleRedirect: Not on generic dashboard, skipping redirect");
      return;
    }

    // FIXED: Mark as redirected before navigation to prevent loops
    hasRedirectedRef.current = true;

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
        hasRedirectedRef.current = false; // Allow future redirects for unknown roles
    }
  }, [profile?.role, loading, navigate, location.pathname]);

  // FIXED: Reset redirect flag when leaving dashboard
  useEffect(() => {
    if (!location.pathname.includes('/dashboard')) {
      hasRedirectedRef.current = false;
    }
  }, [location.pathname]);
};
