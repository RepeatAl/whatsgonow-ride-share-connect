
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Car, 
  User, 
  MessageCircle,
  LayoutDashboard,
  Shield,
  Database,
  LogIn,
  Inbox
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import LogoutButton from "@/components/auth/LogoutButton";
import NavLink from "./NavLink";

interface DesktopMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const DesktopMenu = ({ user, userRole, unreadMessagesCount }: DesktopMenuProps) => {
  const navLinks = [
    { 
      name: "Find Transport", 
      path: "/find-transport", 
      icon: <Package className="h-5 w-5 mr-2" />, 
      tooltip: "Browse available transports" 
    },
    { 
      name: "Offer Transport", 
      path: "/offer-transport", 
      icon: <Car className="h-5 w-5 mr-2" />, 
      tooltip: "Offer your transport services" 
    },
    { 
      name: "Messages", 
      path: "/inbox", 
      icon: <MessageCircle className="h-5 w-5 mr-2" />, 
      tooltip: "View your messages",
      badge: unreadMessagesCount
    },
  ];

  const adminLinks = [
    { 
      name: "User Management", 
      path: "/admin", 
      icon: <Shield className="h-5 w-5 mr-2" />, 
      tooltip: "Manage users" 
    },
    { 
      name: "Admin Dashboard", 
      path: "/admin/dashboard", 
      icon: <Database className="h-5 w-5 mr-2" />, 
      tooltip: "View logs and transactions" 
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path}
              icon={link.icon}
              name={link.name}
              tooltip={link.tooltip}
              badge={link.badge}
            />
          ))}
          
          {userRole === 'admin' && (
            <>
              <div className="h-6 border-l mx-1"></div>
              {adminLinks.map((link) => (
                <NavLink 
                  key={link.path}
                  to={link.path}
                  icon={link.icon}
                  name={link.name}
                  tooltip={link.tooltip}
                />
              ))}
            </>
          )}
          
          <div className="h-6 border-l mx-1"></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/inbox">
                <Button variant="ghost" size="icon" className="relative" aria-label="Messages">
                  <Inbox className="h-5 w-5" />
                  {unreadMessagesCount > 0 && (
                    <div 
                      className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-primary" 
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Messages ({unreadMessagesCount} unread)</p>
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
  );
};

export default DesktopMenu;
