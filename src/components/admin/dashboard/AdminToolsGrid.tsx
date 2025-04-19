
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck,
  ChevronRight,
  MessageSquareWarning,
  FileBarChart,
  FileSpreadsheet,
  UserCheck,
  FileText
} from 'lucide-react';

const AdminToolsGrid = () => {
  return (
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
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Vorregistrierungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Zugriff auf Vorregistrierungsdaten und Export der Informationen.
            </p>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link to="/admin/pre-registrations">
                Registrierungen anzeigen
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
  );
};

export default AdminToolsGrid;
