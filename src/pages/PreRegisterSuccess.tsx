
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PreRegisterSuccess() {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            {t('pre_register.success.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {t('pre_register.success.description')}
            <br/>
            {t('pre_register.success.confirm_notice')}
            <br/>
            {t('pre_register.success.login_notice')}
          </p>
          <p className="text-base text-gray-500 mb-8">
            {t('pre_register.success.spam_notice')}
          </p>
          <Button asChild>
            <Link to="/">{t('pre_register.success.back_to_home')}</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
