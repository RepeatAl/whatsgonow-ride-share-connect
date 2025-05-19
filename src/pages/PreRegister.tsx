
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function PreRegister() {
  const { t } = useTranslation('pre_register');
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <Suspense fallback={<LoadingScreen variant="inline" />}>
          <PreRegistrationForm />
        </Suspense>
      </div>
    </Layout>
  );
}
