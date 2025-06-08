
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useGlobalLanguage } from '@/hooks/useGlobalLanguage';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Check, Globe, Loader2 } from 'lucide-react';

interface GlobalLanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'compact';
  showLabel?: boolean;
}

export const GlobalLanguageSwitcher = ({
  variant = 'default',
  showLabel = true,
}: GlobalLanguageSwitcherProps) => {
  const { 
    currentLanguage, 
    changeLanguage, 
    isChanging, 
    supportedLanguages,
    getLanguageInfo
  } = useGlobalLanguage();
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const currentLangMeta = getLanguageInfo(currentLanguage);

  const handleLanguageChange = async (langCode: string) => {
    if (currentLanguage === langCode || isChanging) return;
    
    const success = await changeLanguage(langCode);
    
    if (success) {
      const langName = getLanguageInfo(langCode).name;
      toast({
        description: t('language_changed', { language: langName }) || `Sprache zu ${langName} geändert`,
      });
    } else {
      toast({
        variant: "destructive",
        description: t('language_change_error') || 'Fehler beim Sprachwechsel',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === "compact" ? "ghost" : variant === "outline" ? "outline" : "default"}
          size={variant === "compact" ? "icon" : "sm"}
          className={variant === "compact" ? "w-8 h-8 p-0" : "h-9 px-3 gap-2"}
          disabled={isChanging}
          aria-label={t("change_language") || "Sprache ändern"}
        >
          {variant === "compact" ? (
            <Globe className="h-4 w-4" />
          ) : (
            <>
              <span className="mr-1">{currentLangMeta.flag}</span>
              {showLabel && <span className="hidden sm:inline">{currentLangMeta.name}</span>}
              {isChanging && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel>{t("select_language") || "Sprache wählen"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer flex items-center justify-between ${
              currentLanguage === lang.code ? "bg-accent" : ""
            }`}
            disabled={isChanging}
          >
            <div className="flex items-center gap-2">
              <span className="mr-1">{lang.flag}</span>
              <span className={lang.rtl ? "font-arabic" : ""}>{lang.localName}</span>
            </div>
            {currentLanguage === lang.code && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GlobalLanguageSwitcher;
