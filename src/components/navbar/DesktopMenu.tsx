
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
  Inbox,
  PlusCircle,
  FileText
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import LogoutButton from "@/components/auth/LogoutButton";
import NavLink from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

interface DesktopMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const DesktopMenu = ({ user, userRole, unreadMessagesCount }: DesktopMenuProps) => {
  const isSender = userRole?.startsWith('sender_');

  const navLinks = [
    { 
      name: "Transport finden", 
      path: "/find-transport", 
      icon: <Package className="h-5 w-5 mr-2" />, 
      tooltip: "Verfügbare Transporte durchsuchen" 
    },
    { 
      name: "Transport anbieten", 
      path: "/offer-transport", 
      icon: <Car className="h-5 w-5 mr-2" />, 
      tooltip: "Deine Transportdienste anbieten" 
    },
    { 
      name: "Nachrichten", 
      path: "/inbox", 
      icon: <MessageCircle className="h-5 w-5 mr-2" />, 
      tooltip: "Deine Nachrichten ansehen",
      badge: unreadMessagesCount
    },
  ];

  // Add create order link for senders
  if (isSender) {
    navLinks.push({
      name: "Neuer Auftrag",
      path: "/create-order",
      icon: <FileText className="h-5 w-5 mr-2" />,
      tooltip: "Neuen Transportauftrag erstellen"
    });
  }

  const adminLinks = [
    { 
      name: "Admin", 
      path: "/admin", 
      icon: <Shield className="h-5 w-5 mr-2" />, 
      tooltip: "Admin Panel" 
    }
  ];

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <LanguageToggle />
      
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
          
          {(userRole === 'admin' || userRole === 'admin_limited') && (
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
              <p>Nachrichten ({unreadMessagesCount} ungelesen)</p>
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
                  <span>Profil</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dein Profil ansehen</p>
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

          {/* Highlight new order button for senders */}
          {isSender && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/create-order">
                  <Button 
                    variant="brand" 
                    className="gap-2"
                    aria-label="Neuer Auftrag"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Neuer Auftrag</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transportauftrag erstellen</p>
              </TooltipContent>
            </Tooltip>
          )}
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
