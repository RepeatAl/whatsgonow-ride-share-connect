
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
import { useTranslation } from "react-i18next";

interface DesktopMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const DesktopMenu = ({ user, userRole, unreadMessagesCount }: DesktopMenuProps) => {
  const { t } = useTranslation();
  const isSender = userRole?.startsWith('sender_');

  const navLinks = [
    { 
      name: t('landing.nav.find_transport'), 
      path: "/find-transport", 
      icon: <Package className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.find_transport')
    },
    { 
      name: t('landing.nav.offer_transport'), 
      path: "/offer-transport", 
      icon: <Car className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.offer_transport')
    },
    { 
      name: t('landing.nav.messages'), 
      path: "/inbox", 
      icon: <MessageCircle className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.messages'),
      badge: unreadMessagesCount
    },
  ];

  // Add create order link for senders
  if (isSender) {
    navLinks.push({
      name: t('landing.nav.order'),
      path: "/create-order",
      icon: <FileText className="h-5 w-5 mr-2" />,
      tooltip: t('dashboard.newOrder')
    });
  }

  const adminLinks = [
    { 
      name: t('landing.nav.admin'), 
      path: "/admin", 
      icon: <Shield className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.admin')
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
                <Button variant="ghost" size="icon" className="relative" aria-label={t('landing.nav.messages')}>
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
              <p>{t('landing.nav.messages')} ({unreadMessagesCount} ungelesen)</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/profile">
                <Button 
                  variant="outline" 
                  className="gap-2 hover:bg-brand-primary hover:text-white transition-colors"
                  aria-label={t('landing.nav.profile')}
                >
                  <User className="h-5 w-5" />
                  <span>{t('landing.nav.profile')}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('dashboard.profile')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  className="gap-2 hover:bg-brand-primary hover:text-white transition-colors"
                  aria-label={t('landing.nav.dashboard')}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>{t('landing.nav.dashboard')}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('dashboard.title')}</p>
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
                    aria-label={t('dashboard.newOrder')}
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>{t('dashboard.newOrder')}</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('dashboard.newOrder')}</p>
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
                aria-label={t('auth.login')}
              >
                <LogIn className="h-5 w-5" />
                <span>{t('auth.login')}</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('auth.login')} {t('auth.register')}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default DesktopMenu;
