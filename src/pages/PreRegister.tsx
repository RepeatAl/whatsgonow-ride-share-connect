
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";
import { StableLoading } from "@/components/ui/stable-loading";
import { useAppInitialization } from "@/hooks/useAppInitialization";

const PreRegisterContent = () => {
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

        <PreRegistrationForm />
      </div>
    </Layout>
  );
};

export default function PreRegister() {
  const appState = useAppInitialization(['pre_register', 'errors', 'common']);
  
  if (!appState.isReady) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <StableLoading variant="form" />
        </div>
      </Layout>
    );
  }

  return (
    <Suspense fallback={
      <Layout>
        <StableLoading variant="page" message="Seite wird geladen..." />
      </Layout>
    }>
      <PreRegisterContent />
    </Suspense>
  );
}
