
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileCheck({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && profile && !profile.profile_complete && location.pathname !== "/complete-profile") {
      navigate("/complete-profile", { state: { from: location.pathname } });
    }
  }, [profile, loading, navigate, location]);

  if (loading) return null;

  return <>{children}</>;
}
