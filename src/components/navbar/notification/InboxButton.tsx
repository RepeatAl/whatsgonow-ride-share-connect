
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface InboxButtonProps {
  unreadMessagesCount: number;
}

const InboxButton = ({ unreadMessagesCount }: InboxButtonProps) => {
  const { t } = useTranslation();
  
  return (
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
  );
};

export default InboxButton;
