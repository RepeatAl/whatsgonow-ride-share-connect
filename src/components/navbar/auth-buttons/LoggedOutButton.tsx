
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const LoggedOutButton = () => {
  const { t } = useTranslation();
  
  return (
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
  );
};

export default LoggedOutButton;
