
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Table } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PreRegistrationsTable } from "@/components/admin/pre-registrations/PreRegistrationsTable";
import { PreRegistrationsFilters } from "@/components/admin/pre-registrations/PreRegistrationsFilters";
import { PreRegistrationsExport } from "@/components/admin/pre-registrations/PreRegistrationsExport";
import { usePreRegistrations } from "@/hooks/admin/usePreRegistrations";

const PreRegistrationsPage = () => {
  const { profile, loading: authLoading } = useSimpleAuth();
  const navigate = useNavigate();
  
  const {
    registrations,
    loading: dataLoading,
    searchTerm,
    setSearchTerm,
    filterDrivers,
    setFilterDrivers,
    filterCM,
    setFilterCM,
    filterSender,
    setFilterSender,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refresh
  } = usePreRegistrations();

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "admin")) {
      navigate("/dashboard");
    }
  }, [profile, authLoading, navigate]);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="pl-0" 
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Vorregistrierungen</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filter und Export</CardTitle>
          </CardHeader>
          <CardContent>
            <PreRegistrationsFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterDrivers={filterDrivers}
              onFilterDriversChange={setFilterDrivers}
              filterCM={filterCM}
              onFilterCMChange={setFilterCM}
              filterSender={filterSender}
              onFilterSenderChange={setFilterSender}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
            />
            <div className="flex justify-end mt-4">
              <PreRegistrationsExport registrations={registrations} />
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex gap-2 p-4 border-b bg-slate-50">
            <Button variant="ghost" size="sm" onClick={refresh} disabled={dataLoading}>
              <Table className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
            <div className="flex-1"></div>
            <div className="text-sm text-muted-foreground">
              {registrations.length} Einträge
            </div>
          </div>
          
          <PreRegistrationsTable
            registrations={registrations}
            isLoading={dataLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PreRegistrationsPage;
