
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
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const LoggedOutButton = () => {
  const { t } = useTranslation('auth');
  const { getLocalizedUrl } = useLanguageMCP();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={getLocalizedUrl("/login")}>
          <Button 
            variant="brand" 
            className="gap-2"
            aria-label={t('login')}
          >
            <LogIn className="h-5 w-5" />
            <span>{t('login')}</span>
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('login')} {t('register')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LoggedOutButton;
