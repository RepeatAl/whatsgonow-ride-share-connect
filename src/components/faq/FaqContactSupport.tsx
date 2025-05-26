
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { Mail, MessageCircle } from "lucide-react";

const FaqContactSupport = () => {
  const { t } = useTranslation('faq');
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Card className="mt-8 border-brand-orange/20 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-brand-orange">
          <MessageCircle className="h-6 w-6" />
          {t('contact_support.title', 'Weitere Fragen?')}
        </CardTitle>
        <CardDescription>
          {t('contact_support.description', 'Falls du deine Frage hier nicht findest, helfen wir gerne weiter.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
            <Link to={getLocalizedUrl("/support")}>
              <Mail className="mr-2 h-4 w-4" />
              {t('contact_support.contact_button', 'Support kontaktieren')}
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="text-brand-orange hover:bg-brand-orange/10">
            <Link to={getLocalizedUrl("/feedback")}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Feedback geben
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaqContactSupport;
