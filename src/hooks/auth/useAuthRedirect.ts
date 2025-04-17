
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { UserProfile } from "@/types/auth";

export function useAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  loading: boolean
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;
    const isAuthPage = ["/login", "/register"].includes(currentPath);
    const isProfilePage = currentPath === "/profile";
    
    console.log("🔄 Redirect check:", {
      path: currentPath,
      user: !!user,
      profile: !!profile,
      isAuthPage,
      isProfilePage
    });

    if (user) {
      // If no profile exists or profile is incomplete, redirect to profile page
      // unless we're already on the profile page
      if (!isProfilePage && (!profile || isProfileIncomplete(profile))) {
        console.log("⚠️ Profile missing or incomplete, redirecting to /profile");
        navigate("/profile", { 
          replace: true,
          state: { from: location }  // Preserve original destination
        });
        return;
      }

      if (isAuthPage) {
        const redirectTo = profile
          ? getRoleBasedRedirectPath(profile.role)
          : "/dashboard";
        console.log("✅ Auth page redirect:", redirectTo);
        navigate(redirectTo, { replace: true });
        return;
      }
    } else {
      if (!isPublicRoute(currentPath) && !isAuthPage) {
        console.log("🔒 Protected route access denied → /login");
        navigate("/login", { 
          state: { from: location }, 
          replace: true 
        });
        return;
      }
    }
  }, [user, profile, loading, location, navigate]);
}
