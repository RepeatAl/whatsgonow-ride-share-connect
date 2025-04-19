
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, FileText, Table } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table as UITable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type PreRegistration = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  postal_code: string;
  wants_driver: boolean;
  wants_cm: boolean;
  wants_sender: boolean;
  vehicle_types: string[] | null;
  created_at: string;
  notification_sent: boolean;
};

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

      // Parse the JSON vehicle_types array if it exists
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
    // Apply filters
    let filtered = [...preRegistrations];
    
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
  }, [preRegistrations, searchTerm, filterDrivers, filterCM, filterSender]);

  const downloadCSV = () => {
    try {
      // Create CSV header
      let csvContent = "First Name,Last Name,Email,Postal Code,Driver,CM,Sender,Vehicle Types,Registration Date,Notification Sent\n";
      
      // Add data rows
      filteredRegistrations.forEach(reg => {
        const vehicleTypes = reg.vehicle_types ? JSON.stringify(reg.vehicle_types).replace(/"/g, '""') : '';
        const row = [
          `"${reg.first_name.replace(/"/g, '""')}"`,
          `"${reg.last_name.replace(/"/g, '""')}"`,
          `"${reg.email.replace(/"/g, '""')}"`,
          `"${reg.postal_code.replace(/"/g, '""')}"`,
          reg.wants_driver ? "Ja" : "Nein",
          reg.wants_cm ? "Ja" : "Nein",
          reg.wants_sender ? "Ja" : "Nein",
          `"${vehicleTypes}"`,
          new Date(reg.created_at).toLocaleString('de-DE'),
          reg.notification_sent ? "Ja" : "Nein"
        ].join(",");
        csvContent += row + "\n";
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `whatsgonow-registrierungen-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download gestartet",
        description: `${filteredRegistrations.length} Vorregistrierungen wurden als CSV exportiert.`
      });
    } catch (error) {
      console.error("Fehler beim Erstellen der CSV-Datei:", error);
      toast({
        title: "Export fehlgeschlagen",
        description: "Die CSV-Datei konnte nicht erstellt werden.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Suche nach Name, Email, PLZ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-drivers"
                    checked={filterDrivers}
                    onCheckedChange={(checked) => setFilterDrivers(!!checked)}
                  />
                  <label htmlFor="filter-drivers" className="text-sm">Fahrer</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-cm"
                    checked={filterCM}
                    onCheckedChange={(checked) => setFilterCM(!!checked)}
                  />
                  <label htmlFor="filter-cm" className="text-sm">Community Manager</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-sender"
                    checked={filterSender}
                    onCheckedChange={(checked) => setFilterSender(!!checked)}
                  />
                  <label htmlFor="filter-sender" className="text-sm">Versender</label>
                </div>
              </div>
              
              <div className="flex-1"></div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV Export
                </Button>
              </div>
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
          
          <div className="overflow-x-auto">
            <UITable>
              {isLoading ? (
                <TableCaption>Lade Vorregistrierungen...</TableCaption>
              ) : filteredRegistrations.length === 0 ? (
                <TableCaption>Keine Vorregistrierungen gefunden</TableCaption>
              ) : null}
              
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>PLZ</TableHead>
                  <TableHead>Rollen</TableHead>
                  <TableHead>Fahrzeugtypen</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Benachrichtigt</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Keine Vorregistrierungen gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell>
                        <div className="font-medium">{reg.first_name} {reg.last_name}</div>
                      </TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.postal_code}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {reg.wants_driver && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                              Fahrer
                            </span>
                          )}
                          {reg.wants_cm && (
                            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                              CM
                            </span>
                          )}
                          {reg.wants_sender && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                              Versender
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {reg.vehicle_types && reg.vehicle_types.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {reg.vehicle_types.map(type => (
                              <span 
                                key={type} 
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(reg.created_at)}</TableCell>
                      <TableCell>
                        {reg.notification_sent ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Ja
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                            Nein
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </UITable>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreRegistrationsPage;
