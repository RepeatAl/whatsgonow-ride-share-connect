
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { ProfileCheck } from "@/components/profile/ProfileCheck";
import { routes } from "@/routes/routes";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  public?: boolean;
  protected?: boolean;
  children?: RouteConfig[];
}

export const AppRoutes = () => {
  return (
    <Routes>
      {routes.map(({ path, element, public: isPublic, protected: isProtected }) => {
        if (isPublic) {
          // Public routes are accessible without authentication
          return <Route key={path} path={path} element={<PublicRoute>{element}</PublicRoute>} />;
        }
        
        // Protected routes need authentication and profile check
        return (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <ProfileCheck>{element}</ProfileCheck>
              </ProtectedRoute>
            }
          />
        );
      })}
    </Routes>
  );
};
