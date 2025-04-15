
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { loading } = useAuth();
  
  // Ein einfacher Wrapper für öffentliche Routen
  // Keine Weiterleitung erforderlich, da Public Routes für alle zugänglich sind
  return <>{!loading && children}</>;
};
