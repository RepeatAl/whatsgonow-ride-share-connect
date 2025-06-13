
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ConsentBanner from "./ConsentBanner";
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
      
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        
        <main className="pt-20 flex-grow">
          {loading && pageType === "authenticated" ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            children
          )}
        </main>
        
        {/* Global GDPR/DSGVO Consent Banner */}
        <ConsentBanner />
        
        {/* Footer at bottom of all pages */}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
