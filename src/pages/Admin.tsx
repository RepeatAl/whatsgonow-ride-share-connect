
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileSpreadsheet, 
  MessageSquareWarning, 
  FileBarChart, 
  ClipboardCheck, 
  FileText, 
  UserCheck, 
  TrendingUp 
} from "lucide-react";
import AdminToolCard from "@/components/admin/dashboard/tools/AdminToolCard";

const Admin = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Verwaltung und Überwachung der Whatsgonow-Plattform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminToolCard
          title="Nutzer-Validierung"
          description="KYC-Prozess und Identitätsprüfung für neue Nutzer."
          icon={ClipboardCheck}
          status="active"
          href="/admin/validation"
        />
        
        <AdminToolCard
          title="Vorregistrierungen"
          description="Verwaltung der Vorregistrierungsdaten und Lead-Generation."
          icon={FileText}
          status="active"
          href="/admin/pre-registrations"
        />
        
        <AdminToolCard
          title="Feedback-Management"
          description="Bearbeitung und Verwaltung von Nutzerfeedback."
          icon={MessageSquareWarning}
          status="active"
          href="/admin/feedback"
        />
        
        <AdminToolCard
          title="Analytics"
          description="Detaillierte Auswertungen und Plattform-Metriken."
          icon={FileBarChart}
          status="active"
          href="/admin/analytics"
        />
        
        <AdminToolCard
          title="Nutzerverwaltung"
          description="Verwaltung von Nutzerkonten und Berechtigungen."
          icon={UserCheck}
          status="inactive"
          disabled={true}
        />
        
        <AdminToolCard
          title="Rechnungswesen"
          description="Invoice-Management und XRechnung-Export."
          icon={FileSpreadsheet}
          status="inactive"
          disabled={true}
        />
        
        <AdminToolCard
          title="System-Monitoring"
          description="Überwachung der Plattform-Performance und -Verfügbarkeit."
          icon={TrendingUp}
          status="active"
          href="/admin/monitoring"
          badge="Beta"
        />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
            <CardDescription>Häufig verwendete Funktionen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/users">Alle Nutzer</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/logs">System-Logs</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/reports">Berichte</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/settings">Einstellungen</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
