
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

export const DealNotFound = () => {
  const { t } = useTranslation("common");
  const { getLocalizedUrl } = useLanguageMCP();
  
  return (
    <div className="flex-grow flex flex-col justify-center items-center p-6">
      <div className="text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">{t("deal_not_found")}</h2>
        <p className="text-muted-foreground mb-8">{t("deal_not_found_desc")}</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="default" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("go_back")}
          </Button>
          
          <Button 
            variant="outline" 
            asChild
          >
            <a href={getLocalizedUrl("/orders")}>
              {t("browse_orders")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealNotFound;
