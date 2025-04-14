import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Package, 
  Car, 
  MessageCircle,
  User, 
  LayoutDashboard,
  Shield, 
  Database,
  LogIn, 
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";

interface MobileMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const MobileMenu = ({ user, userRole, unreadMessagesCount }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Find Transport", path: "/find-transport", icon: <Package className="h-5 w-5 mr-2" /> },
    { name: "Offer Transport", path: "/offer-transport", icon: <Car className="h-5 w-5 mr-2" /> },
    { name: "Messages", path: "/inbox", icon: <MessageCircle className="h-5 w-5 mr-2" /> },
  ];

  const adminLinks = [
    { name: "User Management", path: "/admin", icon: <Shield className="h-5 w-5 mr-2" /> },
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: <Database className="h-5 w-5 mr-2" /> },
  ];

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={toggleTheme}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "light" ? (
              <>
                <Moon className="h-5 w-5 mr-2" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="h-5 w-5 mr-2" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          {!user ? (
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogIn className="h-5 w-5 mr-2" />
              <span>Anmelden</span>
            </Link>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {link.path === "/inbox" && unreadMessagesCount > 0 && (
                    <div className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </div>
                  )}
                </Link>
              ))}
              
              {userRole === 'admin' && (
                <>
                  <div className="border-t my-2"></div>
                  <div className="px-3 py-1 text-sm font-semibold text-gray-500 dark:text-gray-400">Admin</div>
                  {adminLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </>
              )}
              
              <div className="border-t my-2"></div>
              <Link 
                to="/profile"
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="h-5 w-5 mr-2" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                <span>Dashboard</span>
              </Link>
              
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Abmelden</span>
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
