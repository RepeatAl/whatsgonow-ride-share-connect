
import { Routes, Route } from "react-router-dom";
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
      {routes.map(({ path, element, public: isPublic }) => (
        <Route
          key={path}
          path={path}
          element={
            isPublic ? (
              element
            ) : (
              <ProfileCheck>{element}</ProfileCheck>
            )
          }
        />
      ))}
    </Routes>
  );
};
