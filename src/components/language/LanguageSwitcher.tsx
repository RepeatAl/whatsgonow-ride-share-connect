
import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Check, Globe, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImplementedLanguages, getPlannedLanguages, isImplementedLanguage } from "@/utils/languageUtils";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "compact";
  showLabel?: boolean;
}

export const LanguageSwitcher = ({
  variant = "default",
  showLabel = true,
}: LanguageSwitcherProps) => {
  const { 
    currentLanguage, 
    setLanguageByCode, 
    languageLoading, 
    supportedLanguages,
    isMobileDevice 
  } = useLanguageMCP();
  const { toast } = useToast();
  const { t, ready } = useTranslation("common");
  const [isChanging, setIsChanging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current language metadata
  const currentLangMeta = supportedLanguages.find(l => l.code === currentLanguage) || 
    { code: 'de', name: 'Deutsch', localName: 'Deutsch', flag: '🇩🇪', rtl: false, implemented: true };

  // Mobile-specific touch handling
  useEffect(() => {
    if (!isMobileDevice) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, [isDropdownOpen, isMobileDevice]);

  // Handle language change with mobile optimization
  const handleLanguageChange = async (langCode: string) => {
    if (currentLanguage === langCode || isChanging || languageLoading) {
      console.log('[LanguageSwitcher] Skipping language change - already in progress or same language');
      return;
    }
    
    try {
      setIsChanging(true);
      setIsDropdownOpen(false); // Close dropdown immediately on mobile
      
      console.log('[LanguageSwitcher] Changing language to:', langCode);
      
      // Show loading toast immediately for mobile feedback
      if (isMobileDevice) {
        toast({
          description: "Sprache wird geändert...",
          duration: 1500,
        });
      }
      
      await setLanguageByCode(langCode);
      
      // Success feedback
      const languageName = supportedLanguages.find(l => l.code === langCode)?.name || langCode;
      toast({
        description: t("language_changed", { 
          language: languageName
        }) || `Sprache geändert zu ${languageName}`,
        duration: 2000,
      });
      
    } catch (error) {
      console.error('[LANG-SWITCH] Error changing language:', error);
      toast({
        variant: "destructive",
        description: t("language_change_error") || "Fehler beim Ändern der Sprache",
        duration: 3000,
      });
    } finally {
      // Add extra delay for mobile to prevent rapid successive changes
      const delay = isMobileDevice ? 500 : 200;
      setTimeout(() => setIsChanging(false), delay);
    }
  };

  // Get available and future languages
  const availableLanguages = getImplementedLanguages();
  const futureLanguages = getPlannedLanguages();

  // If translations aren't ready yet, show a loading state
  if (!ready) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        disabled
        className="h-9 opacity-70"
      >
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    );
  }

  const isLoading = languageLoading || isChanging;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === "compact" ? "ghost" : variant === "outline" ? "outline" : "default"}
          size={variant === "compact" ? "icon" : "sm"}
          className={`${variant === "compact" ? "w-8 h-8 p-0" : "h-9 px-3 gap-2"} ${
            isMobileDevice ? "touch-manipulation" : ""
          }`}
          disabled={isLoading}
          aria-label={t("change_language") || "Sprache ändern"}
          onTouchEnd={(e) => {
            // Prevent double-tap zoom on mobile
            if (isMobileDevice) {
              e.preventDefault();
            }
          }}
        >
          {variant === "compact" ? (
            <Globe className="h-4 w-4" />
          ) : (
            <>
              <span className="mr-1">{currentLangMeta.flag}</span>
              {showLabel && <span className="hidden sm:inline">{currentLangMeta.name}</span>}
              {isLoading && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent ml-1" />
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        ref={dropdownRef}
        align="end" 
        className={`min-w-[180px] max-h-[70vh] overflow-auto ${
          isMobileDevice ? "z-[9999]" : "z-50"
        }`}
        sideOffset={isMobileDevice ? 8 : 4}
      >
        <DropdownMenuLabel>{t("select_language") || "Sprache wählen"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="max-h-[50vh]">
          {/* Available Languages */}
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              onTouchEnd={(e) => {
                // Prevent event bubbling on mobile
                if (isMobileDevice) {
                  e.stopPropagation();
                  handleLanguageChange(lang.code);
                }
              }}
              className={`cursor-pointer flex items-center justify-between ${
                currentLanguage === lang.code ? "bg-accent" : ""
              } ${isMobileDevice ? "py-3 touch-manipulation" : ""}`}
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <span className="mr-1">{lang.flag}</span>
                <span className={lang.rtl ? "font-rtl" : ""}>{lang.name}</span>
                {lang.code !== 'de' && lang.code !== 'en' && !isImplementedLanguage(lang.code) && (
                  <span className="text-xs text-muted-foreground ml-1">{t("partial") || "Teilweise"}</span>
                )}
              </div>
              {currentLanguage === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}

          {/* Separator for future languages */}
          {futureLanguages.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("coming_soon") || "Demnächst verfügbar"}
              </DropdownMenuLabel>
            </>
          )}

          {/* Future Languages (Coming Soon) */}
          {futureLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              disabled
              className={`cursor-not-allowed opacity-50 ${
                isMobileDevice ? "py-3" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="mr-1">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
