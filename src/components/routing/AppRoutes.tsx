
import { Routes, Route } from "react-router-dom";
import { ProfileCheck } from "@/components/profile/ProfileCheck";
import { routes } from "@/routes/routes";

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
