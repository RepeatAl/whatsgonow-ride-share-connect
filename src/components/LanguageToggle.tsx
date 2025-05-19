
import { GlobeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

export const LanguageToggle = () => {
  const { changeLanguage, currentLanguage, loading } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = async (lang: string) => {
    if (currentLanguage === lang) return;
    
    try {
      await changeLanguage(lang);
      toast({
        description: lang === 'de' ? 
          "Sprache wurde auf Deutsch geändert" : 
          "Language changed to English",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: lang === 'de' ? 
          "Fehler beim Ändern der Sprache" : 
          "Error changing language",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={loading}
          className="flex items-center gap-2 h-9 px-3 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Change language"
        >
          {currentLanguage === 'de' ? (
            <>
              <span className="mr-1">🇩🇪</span>
              <span className="hidden sm:inline">Deutsch</span>
            </>
          ) : (
            <>
              <span className="mr-1">🇬🇧</span>
              <span className="hidden sm:inline">English</span>
            </>
          )}
          {loading && (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent ml-1" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] bg-background">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('de')}
          className={`cursor-pointer ${currentLanguage === 'de' ? 'bg-accent' : ''}`}
        >
          <span className="mr-2">🇩🇪</span>
          Deutsch 
          {currentLanguage === 'de' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={`cursor-pointer ${currentLanguage === 'en' ? 'bg-accent' : ''}`}
        >
          <span className="mr-2">🇬🇧</span>
          English
          {currentLanguage === 'en' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
