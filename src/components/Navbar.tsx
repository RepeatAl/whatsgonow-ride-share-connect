
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import DesktopMenu from "./navbar/DesktopMenu";
import MobileMenu from "./navbar/MobileMenu";
import NavbarLogo from "./navbar/NavbarLogo";

const Navbar = React.memo(() => {
  const { theme } = useTheme();
  const { user, profile, loading } = useAuth();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Memoize user role to prevent unnecessary re-renders
  const userRole = useMemo(() => {
    return profile?.role || null;
  }, [profile?.role]);

  // Memoize user existence check
  const isAuthenticated = useMemo(() => {
    return !!user && !loading;
  }, [user, loading]);

  // This would be replaced with actual unread messages logic
  useEffect(() => {
    if (isAuthenticated) {
      // For demonstration purposes - replace with actual messages count logic
      setUnreadMessagesCount(2);
    } else {
      setUnreadMessagesCount(0);
    }
  }, [isAuthenticated]);

  // Don't render navbar during initial loading to prevent flickering
  if (loading) {
    return (
      <nav className="w-full py-4 px-4 md:px-6 border-b shadow-sm fixed top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavbarLogo />
          <div className="w-8 h-8 animate-pulse bg-muted rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full py-4 px-4 md:px-6 border-b shadow-sm fixed top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavbarLogo />
        
        <div className="hidden md:flex">
          <DesktopMenu 
            user={user} 
            userRole={userRole} 
            unreadMessagesCount={unreadMessagesCount} 
          />
        </div>
        
        <div className="md:hidden">
          <MobileMenu 
            user={user}
            userRole={userRole}
            unreadMessagesCount={unreadMessagesCount}
          />
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
