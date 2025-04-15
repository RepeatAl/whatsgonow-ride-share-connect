
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "@/routes/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const AppRoutes = () => {
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
