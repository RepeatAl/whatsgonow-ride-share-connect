
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

export default function PreRegister() {
  const { t } = useTranslation('pre_register');
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={getLocalizedUrl("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('back_to_home', { ns: 'common' })}
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <PreRegistrationForm />
        </div>

        {/* Footer text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('footer_text')}
          </p>
        </div>
      </div>
    </div>
  );
}
