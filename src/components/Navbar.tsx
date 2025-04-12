
import { useState } from "react";
import { Link } from "react-router-dom";
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
  LayoutDashboard
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    { name: "Find Transport", path: "/find-transport", icon: <Package className="h-5 w-5 mr-2" /> },
    { name: "Offer Transport", path: "/offer-transport", icon: <Car className="h-5 w-5 mr-2" /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle className="h-5 w-5 mr-2" /> },
  ];

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
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-primary"></span>
            </Button>
          </Link>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
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
                  to="/manager-dashboard"
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  <span>Manager Dashboard</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="h-6 border-l mx-1"></div>
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-primary"></span>
            </Button>
          </Link>
          <Link to="/profile">
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-brand-primary hover:text-white transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>
          </Link>
          <Link to="/manager-dashboard">
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-brand-primary hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
