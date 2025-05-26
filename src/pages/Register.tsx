
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Register = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout pageType="register">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t("auth:register", "Registrieren")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Erstelle dein Konto bei Whatsgonow
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Bereits ein Konto?{" "}
              <Link to={getLocalizedUrl("/login")} className="font-medium text-brand-orange hover:text-brand-orange/80">
                Hier anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
