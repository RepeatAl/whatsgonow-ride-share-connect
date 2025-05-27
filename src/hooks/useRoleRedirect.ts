
// src/hooks/useRoleRedirect.ts
// This file follows the conventions from /docs/conventions/roles_and_ids.md
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

/**
 * Hook to redirect users to their role-specific dashboard
 * Usage: Place in a component mounted at /dashboard
 */
export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const { profile, loading } = useSimpleAuth();

  useEffect(() => {
    if (loading) return;

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
      case "super_admin":
        navigate("/dashboard/admin", { replace: true });
        break;
      default:
        navigate("/profile", { replace: true });
    }
  }, [profile, loading, navigate]);
};
