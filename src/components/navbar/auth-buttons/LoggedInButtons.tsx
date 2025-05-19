
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LayoutDashboard } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import LogoutButton from "@/components/auth/LogoutButton";
import { useTranslation } from "react-i18next";

const LoggedInButtons = () => {
  const { t } = useTranslation();
  
  return (
    <>
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
    </>
  );
};

export default LoggedInButtons;
