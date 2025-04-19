
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PreRegistration } from "@/types/pre-registration";

interface PreRegistrationsExportProps {
  registrations: PreRegistration[];
}

export const PreRegistrationsExport = ({ registrations }: PreRegistrationsExportProps) => {
  const downloadCSV = () => {
    try {
      // Create CSV header
      let csvContent = "First Name,Last Name,Email,Postal Code,Driver,CM,Sender,Vehicle Types,Registration Date,Notification Sent\n";
      
      // Add data rows
      registrations.forEach(reg => {
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
        description: `${registrations.length} Vorregistrierungen wurden als CSV exportiert.`
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

  return (
    <Button variant="outline" onClick={downloadCSV}>
      <Download className="mr-2 h-4 w-4" />
      CSV Export
    </Button>
  );
};
