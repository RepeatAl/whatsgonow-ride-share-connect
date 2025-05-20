
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ThemeLanguageControls = () => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <LanguageSwitcher variant="outline" />
    </div>
  );
};

export default ThemeLanguageControls;
