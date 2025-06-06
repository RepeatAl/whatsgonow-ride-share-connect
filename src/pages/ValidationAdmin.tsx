import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import ValidationDashboard from '@/components/admin/ValidationDashboard';
import { FeedbackFilters } from '@/components/feedback/admin/FeedbackFilters';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from "react-i18next";

const ValidationAdmin: React.FC = () => {
  const { user, loading } = useOptimizedAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("validation");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const { t } = useTranslation();

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Lade Benutzerinformationen...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0" 
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back_to_admin")}
          </Button>
          <h1 className="text-2xl font-bold">{t("admin.validation.title")}</h1>
        </div>

        <Tabs defaultValue="validation" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="validation">{t("admin.validation.tab")}</TabsTrigger>
            <TabsTrigger value="xrechnung">{t("admin.xrechnung.tab")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="validation">
            <FeedbackFilters
              selectedStatus={selectedStatus}
              selectedType={selectedType}
              onStatusChange={setSelectedStatus}
              onTypeChange={setSelectedType}
            />
            <ValidationDashboard />
          </TabsContent>
          
          <TabsContent value="xrechnung">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">XRechnung Email-Versand</h2>
              <p className="mb-6 text-gray-600">
                Überwachung des automatisierten Versands von XRechnungen an Behörden und öffentliche Auftraggeber.
                Der Versand wird automatisch ausgelöst, wenn eine Rechnung an eine E-Mail-Adresse mit einer behördlichen Domain gesendet wird.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-700">
                  <strong>Hinweis:</strong> XRechnungen werden nur an folgende behördliche Domains versendet:
                </p>
                <ul className="list-disc pl-5 mt-2 text-yellow-700">
                  <li>@bdr.de</li>
                  <li>@bund.de</li>
                  <li>@bundesregierung.de</li>
                  <li>@bundeswehr.org</li>
                  <li>@zoll.de</li>
                  <li>@bzst.de</li>
                  <li>@bafa.de</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Statistik und Überwachung</h3>
                <p>Diese Funktion wird demnächst implementiert.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ValidationAdmin;
