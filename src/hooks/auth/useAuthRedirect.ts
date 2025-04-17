
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
  loading: boolean,
  isInitialLoad: boolean = false
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect if still loading authentication state
    if (loading) {
      console.log("⏳ Auth state loading, skipping redirect check");
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = ["/login", "/register"].includes(currentPath);
    const isProfilePage = currentPath === "/profile";
    
    console.log("🔄 Redirect check:", {
      path: currentPath,
      user: !!user,
      profile: !!profile,
      isAuthPage,
      isProfilePage,
      hasError: !!location.state?.profileError
    });

    // When we have a logged-in user
    if (user) {
      // Case 1: User is on auth page (login/register) but already authenticated
      if (isAuthPage) {
        const redirectTo = profile
          ? getRoleBasedRedirectPath(profile.role)
          : "/profile";
        console.log("✅ Auth page redirect:", redirectTo);
        navigate(redirectTo, { replace: true });
        return;
      }
      
      // Case 2: User doesn't have a profile or profile is incomplete
      // Only redirect if not already on the profile page to prevent loops
      if (!isProfilePage && (!profile || isProfileIncomplete(profile))) {
        console.log("⚠️ Profile missing or incomplete, redirecting to /profile");
        navigate("/profile", { 
          replace: true,
          state: { 
            from: location,  // Preserve original destination
            reason: "incomplete_profile" 
          }
        });
        return;
      }
    } 
    // When user is not logged in
    else {
      // Only redirect if on a protected route and not already on an auth page
      if (!isPublicRoute(currentPath) && !isAuthPage) {
        console.log("🔒 Protected route access denied → /login");
        navigate("/login", { 
          state: { from: location }, 
          replace: true 
        });
        return;
      }
    }
  }, [user, profile, loading, location, navigate, isInitialLoad]);
}
