
import React from "react";
import Navbar from "./Navbar";
import NavbarLogo from "./navbar/NavbarLogo";
import Footer from "./Footer";
import { useTheme } from "@/contexts/ThemeContext";
import { BackButton } from "./navigation/BackButton";

interface LayoutProps {
  children: React.ReactNode;
  /** Optional flag to disable navigation/footer for special pages */
  minimal?: boolean;
}

const Layout = ({ children, minimal = false }: LayoutProps) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      <div className="flex flex-col min-h-screen scroll-smooth">
        {minimal ? (
          <div className="p-4">
            <NavbarLogo />
          </div>
        ) : (
          <Navbar />
        )}
        
        <main className="flex-grow w-full px-4 sm:px-6 lg:px-8">
          <BackButton />
          {children}
        </main>

        {!minimal && <Footer />}
      </div>

      {/* Placeholder for future cookie consent banner */}
      <div id="cookie-consent-portal" />
      
      {/* Placeholder for future modals and overlays */}
      <div id="modal-portal" />
    </div>
  );
};

export default Layout;
