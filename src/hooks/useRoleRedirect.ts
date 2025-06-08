
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

/**
 * STABILIZED: Role redirect hook with prevent infinite loops
 * Only redirects from exact /dashboard path to avoid conflicts
 */
export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // STABILIZED: Don't redirect while loading or if already redirected
    if (loading || hasRedirectedRef.current) {
      return;
    }

    // No profile means user needs to login/complete profile - handled by ProtectedRoute
    if (!profile) {
      return;
    }

    // CRITICAL: Only redirect from exact generic dashboard path
    const currentPath = location.pathname;
    const isGenericDashboard = currentPath.endsWith('/dashboard') && 
                              !currentPath.includes('/dashboard/');
    
    console.debug("🔄 useRoleRedirect:", {
      currentPath,
      isGenericDashboard,
      role: profile.role,
      hasRedirected: hasRedirectedRef.current
    });
    
    if (!isGenericDashboard) {
      console.debug("🔄 useRoleRedirect: Not on generic dashboard, skipping redirect");
      return;
    }

    // STABILIZED: Prevent multiple redirects
    hasRedirectedRef.current = true;

    // Role-based dashboard redirect
    switch (profile.role) {
      case "sender_private":
      case "sender_business":
        console.debug("🔄 useRoleRedirect: Redirecting sender to /dashboard/sender");
        navigate(getLocalizedUrl("/dashboard/sender"), { replace: true });
        break;
      case "driver":
        console.debug("🔄 useRoleRedirect: Redirecting driver to /dashboard/driver");
        navigate(getLocalizedUrl("/dashboard/driver"), { replace: true });
        break;
      case "cm":
        console.debug("🔄 useRoleRedirect: Redirecting CM to /dashboard/cm");
        navigate(getLocalizedUrl("/dashboard/cm"), { replace: true });
        break;
      case "admin":
      case "super_admin":
        console.debug("🔄 useRoleRedirect: Redirecting admin to /dashboard/admin");
        navigate(getLocalizedUrl("/dashboard/admin"), { replace: true });
        break;
      default:
        console.debug("🔄 useRoleRedirect: Unknown role, staying on generic dashboard");
        hasRedirectedRef.current = false; // Allow future redirects for unknown roles
    }
  }, [profile?.role, loading, navigate, location.pathname, getLocalizedUrl]);

  // Reset redirect flag when leaving dashboard area
  useEffect(() => {
    if (!location.pathname.includes('/dashboard')) {
      hasRedirectedRef.current = false;
    }
  }, [location.pathname]);
};
