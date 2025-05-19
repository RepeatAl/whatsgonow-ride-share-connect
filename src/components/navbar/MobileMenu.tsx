import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Sun, 
  FileText, 
  PlusCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const MobileMenu = ({ user, userRole, unreadMessagesCount }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isSender = userRole?.startsWith('sender_');

  const navLinks = [{
    name: t('landing.nav.find_transport'),
    path: "/find-transport",
    icon: <Package className="h-5 w-5 mr-2" />
  }, {
    name: t('landing.nav.offer_transport'),
    path: "/offer-transport",
    icon: <Car className="h-5 w-5 mr-2" />
  }, {
    name: t('landing.nav.messages'),
    path: "/inbox",
    icon: <MessageCircle className="h-5 w-5 mr-2" />
  }];

  // Add create order link for senders
  if (isSender) {
    navLinks.push({
      name: t('dashboard.newOrder'),
      path: "/create-order",
      icon: <FileText className="h-5 w-5 mr-2" />
    });
  }

  const adminLinks = [{
    name: t('landing.nav.admin'),
    path: "/admin",
    icon: <Shield className="h-5 w-5 mr-2" />
  }];

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
        <Button variant="ghost" size="icon" aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="text-orange-500">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === "light" ? <>
                <Moon className="h-5 w-5 mr-2" />
                <span>Dark Mode</span>
              </> : <>
                <Sun className="h-5 w-5 mr-2" />
                <span>Light Mode</span>
              </>}
            </button>
            <LanguageToggle />
          </div>

          {!user ? (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <LogIn className="h-5 w-5 mr-2" />
              <span>{t('auth.login')}</span>
            </Link>
          ) : (
            <>
              {/* Highlight New Order for senders */}
              {isSender && (
                <Link 
                  to="/create-order" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center py-2 px-3 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">{t('dashboard.newOrder')}</span>
                </Link>
              )}

              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  {link.icon}
                  <span>{link.name}</span>
                  {link.path === "/inbox" && unreadMessagesCount > 0 && <div className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </div>}
                </Link>
              ))}
              
              {(userRole === 'admin' || userRole === 'admin_limited') && (
                <>
                  <div className="border-t my-2"></div>
                  <div className="px-3 py-1 text-sm font-semibold text-muted-foreground">Admin</div>
                  {adminLinks.map(link => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === "/admin"}
                      className={({ isActive }) =>
                        `flex items-center py-2 px-3 rounded-md hover:bg-accent ${
                          isActive ? "text-primary font-medium" : "text-foreground"
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </>
              )}
              
              <div className="border-t my-2"></div>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="h-5 w-5 mr-2" />
                <span>{t('landing.nav.profile')}</span>
              </Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                <span>{t('landing.nav.dashboard')}</span>
              </Link>
              
              <button onClick={() => {
            setIsMenuOpen(false);
            signOut();
          }} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left">
                <LogOut className="h-5 w-5 mr-2" />
                <span>{t('auth.logout')}</span>
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
