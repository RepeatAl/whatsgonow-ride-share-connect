
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "@/routes/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  public?: boolean;
}

export const AppRoutes = () => {
  const { user, profile, loading, isInitialLoad } = useAuth();
  
  // Use auth redirect hook at the top level
  useAuthRedirect(user, profile, loading, isInitialLoad);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.protected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                <PublicRoute>{route.element}</PublicRoute>
              )
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
};
