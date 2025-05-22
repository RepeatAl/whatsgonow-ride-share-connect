
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import AdminToolsGrid from '@/components/admin/dashboard/AdminToolsGrid';
import AdminToolCard from '@/components/admin/dashboard/tools/AdminToolCard';
import { useTranslation } from "react-i18next";
import { 
  Users, 
  ShieldCheck, 
  FileCheck, 
  MessageSquare, 
  UserCheck, 
  History,
  Globe
} from 'lucide-react';

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">{t("admin.loading")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">{t("admin.dashboard.title")}</h1>
        
        <AdminToolsGrid>
          <AdminToolCard 
            title={t("admin.tools.user_management")}
            description={t("admin.tools.user_management_desc")}
            icon={Users}
            href="/admin/users"
          />
          
          <AdminToolCard 
            title={t("admin.tools.validation")}
            description={t("admin.tools.validation_desc")}
            icon={ShieldCheck}
            href="/admin/validation"
          />
          
          <AdminToolCard 
            title={t("admin.tools.feedback")}
            description={t("admin.tools.feedback_desc")}
            icon={MessageSquare}
            href="/admin/feedback"
          />
          
          <AdminToolCard 
            title={t("admin.tools.pre_registrations")}
            description={t("admin.tools.pre_registrations_desc")}
            icon={UserCheck}
            href="/admin/pre-registrations"
          />
          
          <AdminToolCard 
            title={t("admin.tools.system_activity")}
            description={t("admin.tools.system_activity_desc")}
            icon={History}
            href="/admin/dashboard"
          />
          
          <AdminToolCard 
            title={t("admin.tools.invoice_testing")}
            description={t("admin.tools.invoice_testing_desc")}
            icon={FileCheck}
            href="/admin/invoice-test"
          />
          
          <AdminToolCard 
            title={t("admin.tools.translation_feedback")}
            description={t("admin.tools.translation_feedback_desc")}
            icon={Globe}
            href="/admin/translation-feedback"
            badge="New"
          />
        </AdminToolsGrid>
      </div>
    </Layout>
  );
};

export default Admin;
