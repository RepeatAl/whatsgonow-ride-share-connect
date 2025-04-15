
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
          variant="ghost" 
          size="icon"
          disabled={loading}
          className="relative hover:bg-accent hover:text-accent-foreground"
          aria-label="Change language"
        >
          <GlobeIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuItem onClick={() => handleLanguageChange('de')}>
          <span className="mr-2">🇩🇪</span>
          Deutsch 
          {currentLanguage === 'de' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          <span className="mr-2">🇬🇧</span>
          English
          {currentLanguage === 'en' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
