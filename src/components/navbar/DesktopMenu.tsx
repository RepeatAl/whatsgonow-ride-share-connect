
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, MessageSquare, PlusCircle, Route, Package } from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useTranslation } from "react-i18next";
import ThemeLanguageControls from "./ThemeLanguageControls";

interface DesktopMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ user, userRole, unreadMessagesCount }) => {
  const { signOut } = useSimpleAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  const { t } = useTranslation(['landing', 'common']);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(getLocalizedUrl("/"));
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <ThemeLanguageControls />
        
        {/* Login Button */}
        <Link to={getLocalizedUrl("/login")}>
          <Button variant="ghost" size="sm">
            {t('landing:nav.login', 'Anmelden')}
          </Button>
        </Link>
        
        {/* Register Button - Primary */}
        <Link to={getLocalizedUrl("/register")}>
          <Button variant="brand" size="sm">
            {t('landing:nav.register', 'Registrieren')}
          </Button>
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Bestimme rollenspezifische Action Buttons
  const getRoleSpecificButtons = () => {
    switch (userRole) {
      case 'driver':
        return (
          <div className="flex items-center space-x-2">
            <Link to={getLocalizedUrl("/rides")}>
              <Button variant="ghost" size="sm">
                <Route className="h-4 w-4 mr-2" />
                Meine Fahrten
              </Button>
            </Link>
            <Link to={getLocalizedUrl("/rides/create")}>
              <Button variant="default" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Fahrt einstellen
              </Button>
            </Link>
          </div>
        );
      case 'sender_private':
      case 'sender_business':
        return (
          <div className="flex items-center space-x-2">
            <Link to={getLocalizedUrl("/orders")}>
              <Button variant="ghost" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Aufträge
              </Button>
            </Link>
            <Link to={getLocalizedUrl("/create-order")}>
              <Button variant="default" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Auftrag erstellen
              </Button>
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <ThemeLanguageControls />
      
      {/* Role-specific Action Buttons */}
      {getRoleSpecificButtons()}

      {/* Inbox Button */}
      <Link to={getLocalizedUrl("/inbox")}>
        <Button variant="ghost" size="sm" className="relative">
          <MessageSquare className="h-4 w-4" />
          {unreadMessagesCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadMessagesCount}
            </Badge>
          )}
        </Button>
      </Link>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.name || ""} />
              <AvatarFallback>
                {getInitials(user?.name || user?.email || "U")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user?.name || user?.email}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={getLocalizedUrl("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={getLocalizedUrl("/dashboard")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Abmelden</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DesktopMenu;
