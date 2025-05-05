
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import DesktopMenu from "./navbar/DesktopMenu";
import MobileMenu from "./navbar/MobileMenu";
import NavbarLogo from "./navbar/NavbarLogo";

const Navbar = () => {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Set user role from profile
  useEffect(() => {
    if (profile) {
      setUserRole(profile.role);
    } else {
      setUserRole(null);
    }
  }, [profile]);

  // This would be replaced with actual unread messages logic
  useEffect(() => {
    if (user) {
      // For demonstration purposes - replace with actual messages count logic
      setUnreadMessagesCount(2);
    } else {
      setUnreadMessagesCount(0);
    }
  }, [user]);

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
};

export default Navbar;
