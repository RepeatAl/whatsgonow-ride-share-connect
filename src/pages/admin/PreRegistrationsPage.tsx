
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Table } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PreRegistrationsTable } from "@/components/admin/pre-registrations/PreRegistrationsTable";
import { PreRegistrationsFilters } from "@/components/admin/pre-registrations/PreRegistrationsFilters";
import { PreRegistrationsExport } from "@/components/admin/pre-registrations/PreRegistrationsExport";
import type { PreRegistration } from "@/types/pre-registration";

const PreRegistrationsPage = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [preRegistrations, setPreRegistrations] = useState<PreRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<PreRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterDrivers, setFilterDrivers] = useState(false);
  const [filterCM, setFilterCM] = useState(false);
  const [filterSender, setFilterSender] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (!loading) {
      if (!profile || profile.role !== "admin") {
        navigate("/dashboard");
        return;
      }
      
      fetchPreRegistrations();
    }
  }, [profile, loading, navigate]);

  const fetchPreRegistrations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("pre_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData = data.map(item => ({
        ...item,
        vehicle_types: typeof item.vehicle_types === 'string' 
          ? JSON.parse(item.vehicle_types) 
          : item.vehicle_types
      }));

      setPreRegistrations(formattedData);
      setFilteredRegistrations(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Fehler beim Laden der Vorregistrierungen:", error);
      toast({
        title: "Fehler",
        description: "Die Vorregistrierungen konnten nicht geladen werden.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...preRegistrations];
    
    // Apply date filters
    if (startDate) {
      filtered = filtered.filter(reg => 
        new Date(reg.created_at) >= startDate
      );
    }
    
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(reg => 
        new Date(reg.created_at) <= endOfDay
      );
    }
    
    // Apply role filters
    if (filterDrivers || filterCM || filterSender) {
      filtered = filtered.filter(reg => 
        (filterDrivers && reg.wants_driver) || 
        (filterCM && reg.wants_cm) || 
        (filterSender && reg.wants_sender)
      );
    }
    
    // Apply search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        reg =>
          reg.first_name.toLowerCase().includes(term) ||
          reg.last_name.toLowerCase().includes(term) ||
          reg.email.toLowerCase().includes(term) ||
          reg.postal_code.toLowerCase().includes(term)
      );
    }
    
    setFilteredRegistrations(filtered);
  }, [preRegistrations, searchTerm, filterDrivers, filterCM, filterSender, startDate, endDate]);

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
              <PreRegistrationsExport registrations={filteredRegistrations} />
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex gap-2 p-4 border-b bg-slate-50">
            <Button variant="ghost" size="sm" onClick={fetchPreRegistrations} disabled={isLoading}>
              <Table className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
            <div className="flex-1"></div>
            <div className="text-sm text-muted-foreground">
              {filteredRegistrations.length} von {preRegistrations.length} Einträgen
            </div>
          </div>
          
          <PreRegistrationsTable
            registrations={filteredRegistrations}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PreRegistrationsPage;
