
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";

export default function PreRegister() {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('pre_register.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('pre_register.subtitle')}
          </p>
        </div>

        <PreRegistrationForm />
      </div>
    </Layout>
  );
}
