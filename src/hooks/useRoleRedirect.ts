// src/hooks/useRoleRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to redirect users to their role-specific dashboard
 * Usage: Place in a component mounted at /dashboard
 */
export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const { profile, isInitialLoad } = useAuth();

  useEffect(() => {
    if (isInitialLoad) return;

    if (!profile) {
      navigate("/login");
      return;
    }

    switch (profile.role) {
      case "sender_private":
      case "sender_business":
        navigate("/dashboard/sender", { replace: true });
        break;
      case "driver":
        navigate("/dashboard/driver", { replace: true });
        break;
      case "cm":
        navigate("/dashboard/cm", { replace: true });
        break;
      case "admin":
      case "admin_limited":
        navigate("/dashboard/admin", { replace: true });
        break;
      default:
        navigate("/profile", { replace: true });
    }
  }, [profile, isInitialLoad, navigate]);
};
