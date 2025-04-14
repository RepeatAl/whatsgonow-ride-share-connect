import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  Package, 
  Car, 
  User, 
  MessageCircle,
  Bell,
  LayoutDashboard,
  Shield,
  Database,
  LogIn,
  LogOut
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "./auth/LogoutButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user role:', error);
            return;
          }
          
          setUserRole(data?.role || null);
        } catch (error) {
          console.error('Error in Navbar role check:', error);
        }
      } else {
        setUserRole(null);
      }
    };
    
    checkUserRole();
  }, [location.pathname, user]);

  const navLinks = [
    { name: "Find Transport", path: "/find-transport", icon: <Package className="h-5 w-5 mr-2" />, tooltip: "Browse available transports" },
    { name: "Offer Transport", path: "/offer-transport", icon: <Car className="h-5 w-5 mr-2" />, tooltip: "Offer your transport services" },
    { name: "Messages", path: "/messages", icon: <MessageCircle className="h-5 w-5 mr-2" />, tooltip: "View your messages" },
  ];

  const adminLinks = [
    { name: "User Management", path: "/admin", icon: <Shield className="h-5 w-5 mr-2" />, tooltip: "Manage users" },
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: <Database className="h-5 w-5 mr-2" />, tooltip: "View logs and transactions" },
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
    <nav className="w-full py-4 px-4 md:px-6 flex items-center justify-between bg-white border-b shadow-sm fixed top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/910fd168-e7e1-4688-bd5d-734fb140c7df.png" 
            alt="whatsgonow logo" 
            className="h-10 mr-2" 
          />
          <span className="text-2xl font-bold">
            whats<span className="text-brand-orange">go</span>now
          </span>
        </Link>
      </div>

      {isMobile ? (
        <div className="flex items-center gap-2">
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true"></span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {!user ? (
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
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
                        className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    ))}
                    
                    {userRole === 'admin' && (
                      <>
                        <div className="border-t my-2"></div>
                        <div className="px-3 py-1 text-sm font-semibold text-gray-500">Admin</div>
                        {adminLinks.map((link) => (
                          <Link 
                            key={link.path} 
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
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
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                    >
                      <User className="h-5 w-5 mr-2" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-5 w-5 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      <span>Abmelden</span>
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Tooltip key={link.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.path}
                      className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              
              {userRole === 'admin' && (
                <>
                  <div className="h-6 border-l mx-1"></div>
                  {adminLinks.map((link) => (
                    <Tooltip key={link.path}>
                      <TooltipTrigger asChild>
                        <Link
                          to={link.path}
                          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                        >
                          {link.icon}
                          <span>{link.name}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{link.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </>
              )}
              
              <div className="h-6 border-l mx-1"></div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/notifications">
                    <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true"></span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/profile">
                    <Button 
                      variant="outline" 
                      className="gap-2 hover:bg-brand-primary hover:text-white transition-colors"
                      aria-label="Profile"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your profile</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/dashboard">
                    <Button 
                      variant="outline" 
                      className="gap-2 hover:bg-brand-primary hover:text-white transition-colors"
                      aria-label="Dashboard"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dashboard</p>
                </TooltipContent>
              </Tooltip>
              <LogoutButton variant="outline" className="gap-2 hover:bg-brand-primary hover:text-white transition-colors" />
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/login">
                  <Button 
                    variant="brand" 
                    className="gap-2"
                    aria-label="Login"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Anmelden</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Anmelden oder Registrieren</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
