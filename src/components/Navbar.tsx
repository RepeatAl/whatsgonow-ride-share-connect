
import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import { LanguageToggle } from "@/components/LanguageToggle";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { NotificationProvider } from "@/contexts/NotificationContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <nav className="w-full py-4 px-4 md:px-6 border-b shadow-sm fixed top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/910fd168-e7e1-4688-bd5d-734fb140c7df.png" 
            alt="whatsgonow logo" 
            className="h-8 mr-2" 
          />
          <span className="text-xl font-bold text-slate-950 dark:text-white">
            whats<span className="text-brand-orange">go</span>now
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {user && (
            <NotificationProvider>
              <NotificationsDropdown>
                <NotificationBadge onClick={() => {}} />
              </NotificationsDropdown>
            </NotificationProvider>
          )}
          
          {user && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
