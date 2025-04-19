
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
  children?: RouteConfig[];
}

export const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  // Use auth redirect hook at the top level - using only the expected 3 arguments
  useAuthRedirect(user, profile, loading);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </Suspense>
  );
};

// Helper function to recursively render routes with nested children
const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    // If route has children, render them recursively
    if (route.children) {
      return (
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
        >
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    // Regular route without children
    return (
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
    );
  });
};
