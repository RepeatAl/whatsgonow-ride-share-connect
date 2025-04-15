
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserActivityTable from '@/components/admin/dashboard/UserActivityTable';
import KPICards from '@/components/admin/dashboard/KPICards';
import TransactionsTable from '@/components/admin/dashboard/TransactionsTable';
import LogsTable from '@/components/admin/dashboard/LogsTable';
import FilterOptions from '@/components/admin/dashboard/FilterOptions';
import { 
  BarChart3, 
  ChevronRight, 
  ClipboardCheck, 
  MessageSquareWarning,
  FileBarChart,
  FileSpreadsheet,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminLogs } from '@/hooks/use-admin-logs';

const AdminDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const {
    logs,
    transactions,
    userSummaries,
    stats,
    timeRange,
    setTimeRange,
    selectedRegion,
    setSelectedRegion,
    loading: dataLoading
  } = useAdminLogs(30);
  
  const loading = authLoading || dataLoading;
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Redirect if not admin
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard.title', 'Admin Dashboard')}</h1>
        
        {/* KPI Cards Row */}
        <KPICards stats={stats} timeRange={parseInt(timeRange)} />
        
        {/* Admin Tools Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Admin-Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
                  KYC-Validierung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Überprüfung von Nutzeridentitäten und Dokumenten für die Plattform.
                </p>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/admin/validation">
                    Validierung durchführen
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  Platform-Analysen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Umfassende Analysen zur Plattformnutzung und Geschäftsentwicklung.
                </p>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/admin/analytics">
                    Analysen anzeigen
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquareWarning className="mr-2 h-5 w-5 text-primary" />
                  Feedback-Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Verwaltung und Beantwortung von Nutzerfeedback und Anfragen.
                </p>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/admin/feedback">
                    Feedback verwalten
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileBarChart className="mr-2 h-5 w-5 text-primary" />
                  Feedback-Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detaillierte Auswertungen und Visualisierungen aller Nutzer-Feedbacks.
                </p>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/admin/feedback-analytics">
                    Analytics öffnen
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                  Rechnungsverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Prüfung und Validierung von Rechnungen, XRechnungs-Export.
                </p>
                <Button variant="outline" className="w-full justify-between" disabled>
                  In Entwicklung
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 text-primary" />
                  Nutzerverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Verwaltung von Nutzerkonten, Rollen und Berechtigungen.
                </p>
                <Button variant="outline" className="w-full justify-between" disabled>
                  In Entwicklung
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Filter Options */}
        <div className="mt-8">
          <FilterOptions 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            userSummaries={userSummaries}
          />
        </div>
        
        {/* Data Tables */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <UserActivityTable userSummaries={userSummaries} />
            
            <div className="h-6"></div>
            
            <TransactionsTable transactions={transactions} timeRange={parseInt(timeRange)} />
          </div>
          
          <div className="lg:col-span-4">
            <LogsTable logs={logs} timeRange={parseInt(timeRange)} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
