
import { useState, memo } from "react";
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
  LogIn, 
  LogOut, 
  Moon, 
  Sun, 
  FileText, 
  PlusCircle
} from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface MobileMenuProps {
  unreadMessagesCount?: number;
}

const MobileMenu = memo(({ unreadMessagesCount = 0 }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useSimpleAuth();
  const { t } = useTranslation(['landing', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();
  
  const userRole = profile?.role;
  const isSender = userRole?.startsWith('sender_');

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      console.log("[MobileMenu] Signed out");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = user ? [{
    name: t('landing:nav.find_transport', 'Transport finden'),
    path: "/find-transport",
    icon: <Package className="h-5 w-5 mr-2" />
  }, {
    name: t('landing:nav.offer_transport', 'Transport anbieten'),
    path: "/offer-transport",
    icon: <Car className="h-5 w-5 mr-2" />
  }, {
    name: t('landing:nav.messages', 'Nachrichten'),
    path: "/inbox",
    icon: <MessageCircle className="h-5 w-5 mr-2" />
  }] : [];

  if (isSender) {
    navLinks.push({
      name: t('common:dashboard.newOrder', 'Neuer Auftrag'),
      path: "/create-order",
      icon: <FileText className="h-5 w-5 mr-2" />
    });
  }

  const adminLinks = user && (userRole === 'admin' || userRole === 'admin_limited') ? [{
    name: t('landing:nav.admin', 'Admin'),
    path: "/admin",
    icon: <Shield className="h-5 w-5 mr-2" />
  }] : [];

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
            <LanguageSwitcher variant="compact" />
          </div>

          {!user ? (
            <>
              <div className="border-t my-2"></div>
              
              <Link to={getLocalizedUrl("/login")} onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <LogIn className="h-5 w-5 mr-2" />
                <span>{t('landing:nav.login', 'Anmelden')}</span>
              </Link>
              
              <Link 
                to={getLocalizedUrl("/register")} 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center py-2 px-3 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{t('landing:nav.register', 'Registrieren')}</span>
              </Link>
            </>
          ) : (
            <>
              {isSender && (
                <Link 
                  to={getLocalizedUrl("/create-order")} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center py-2 px-3 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">{t('common:dashboard.newOrder', 'Neuer Auftrag')}</span>
                </Link>
              )}

              {navLinks.map(link => (
                <Link key={link.path} to={getLocalizedUrl(link.path)} onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  {link.icon}
                  <span>{link.name}</span>
                  {link.path === "/inbox" && unreadMessagesCount > 0 && (
                    <div className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </div>
                  )}
                </Link>
              ))}
              
              {adminLinks.length > 0 && (
                <>
                  <div className="border-t my-2"></div>
                  <div className="px-3 py-1 text-sm font-semibold text-muted-foreground">Admin</div>
                  {adminLinks.map(link => (
                    <NavLink
                      key={link.path}
                      to={getLocalizedUrl(link.path)}
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
              <Link to={getLocalizedUrl("/profile")} onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="h-5 w-5 mr-2" />
                <span>{t('landing:nav.profile', 'Profil')}</span>
              </Link>
              <Link to={getLocalizedUrl("/dashboard")} onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                <span>{t('landing:nav.dashboard', 'Dashboard')}</span>
              </Link>
              
              <button onClick={handleSignOut} className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left">
                <LogOut className="h-5 w-5 mr-2" />
                <span>{t('common:auth.logout', 'Abmelden')}</span>
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
