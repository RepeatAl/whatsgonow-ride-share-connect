
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  pageType?: "public" | "authenticated" | "admin" | "profile";
}

const Layout = ({ 
  children, 
  title = "Whatsgonow", 
  description = "Crowdlogistik-Plattform für Transport und Mobilität",
  pageType = "public"
}: LayoutProps) => {
  const { loading } = useOptimizedAuth();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        <main className="pt-20">
          {loading && pageType === "authenticated" ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </>
  );
};

export default Layout;
