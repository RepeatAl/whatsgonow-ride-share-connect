
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminTranslationFeedback } from '@/hooks/use-admin-translation-feedback';
import { TranslationFeedbackFilter } from '@/services/translation-feedback';
import Layout from '@/components/Layout';
import TranslationFeedbackTable from '@/components/translation/admin/TranslationFeedbackTable';
import TranslationFeedbackFilters from '@/components/translation/admin/TranslationFeedbackFilters';
import { useTranslation } from 'react-i18next';

const TranslationFeedbackAdmin: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { loadAllFeedback, loading } = useAdminTranslationFeedback();
  const { t } = useTranslation();
  
  const [filters, setFilters] = useState<TranslationFeedbackFilter>({});
  const [feedbackItems, setFeedbackItems] = useState<any[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  
  // Lade Feedbackdaten
  const fetchData = async () => {
    const data = await loadAllFeedback(filters);
    setFeedbackItems(data);
    
    // Extrahiere einzigartige Sprachen und Namespaces für Filter
    const uniqueLanguages = Array.from(new Set(data.map(item => item.language)));
    const uniqueNamespaces = Array.from(new Set(data.map(item => item.namespace)));
    
    setLanguages(uniqueLanguages as string[]);
    setNamespaces(uniqueNamespaces as string[]);
  };
  
  useEffect(() => {
    if (user && ['admin', 'super_admin'].includes(user.role)) {
      fetchData();
    }
  }, [user, filters]);
  
  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('translation.admin.title')}</h1>
          <p className="text-muted-foreground">{t('translation.admin.description')}</p>
        </div>
        
        <div className="space-y-6">
          <TranslationFeedbackFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={fetchData}
            languages={languages}
            namespaces={namespaces}
          />
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TranslationFeedbackTable 
              feedbackItems={feedbackItems} 
              onStatusChange={fetchData}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TranslationFeedbackAdmin;
