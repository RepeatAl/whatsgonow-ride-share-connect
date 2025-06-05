
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import DesktopMenu from "./navbar/DesktopMenu";
import MobileMenu from "./navbar/MobileMenu";
import NavbarLogo from "./navbar/NavbarLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Navbar = React.memo(() => {
  const { theme } = useTheme();
  const { user, profile, loading } = useSimpleAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Memoize user existence check
  const isAuthenticated = useMemo(() => {
    return !!user && !loading;
  }, [user, loading]);

  // This would be replaced with actual unread messages logic
  useEffect(() => {
    if (isAuthenticated) {
      setUnreadMessagesCount(2);
    } else {
      setUnreadMessagesCount(0);
    }
  }, [isAuthenticated]);

  return (
    <nav className="w-full py-4 px-4 md:px-6 border-b shadow-sm fixed top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavbarLogo />
        
        <div className="flex items-center space-x-4">
          {/* Language Switcher - always visible */}
          <LanguageSwitcher variant="outline" />
          
          {/* Emergency Home Button */}
          <Link to={getLocalizedUrl("/")}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-brand-orange border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="hidden md:flex">
                <DesktopMenu unreadMessagesCount={unreadMessagesCount} />
              </div>
              
              <div className="md:hidden">
                <MobileMenu unreadMessagesCount={unreadMessagesCount} />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
