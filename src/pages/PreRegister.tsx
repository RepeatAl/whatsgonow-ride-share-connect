
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";
import { StableLoading } from "@/components/ui/stable-loading";
import { StabilizedAppBootstrap } from "@/components/StabilizedAppBootstrap";

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
  return (
    <StabilizedAppBootstrap 
      requiredNamespaces={['pre_register', 'errors', 'common']} 
      requireAuth={false}
    >
      <Suspense fallback={
        <Layout>
          <StableLoading variant="page" message="Seite wird geladen..." />
        </Layout>
      }>
        <PreRegisterContent />
      </Suspense>
    </StabilizedAppBootstrap>
  );
}
