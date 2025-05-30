
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface CreateOrderButtonProps {
  isSender: boolean;
}

const CreateOrderButton = ({ isSender }: CreateOrderButtonProps) => {
  const { t } = useTranslation('dashboard');
  
  if (!isSender) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to="/create-order">
          <Button 
            variant="brand" 
            className="gap-2"
            aria-label={t('newOrder')}
          >
            <PlusCircle className="h-5 w-5" />
            <span>{t('newOrder')}</span>
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('newOrder')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CreateOrderButton;
