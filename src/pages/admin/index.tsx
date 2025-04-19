
import { LayoutDashboard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminHome = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="bg-background/60 backdrop-blur-lg rounded-lg border p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Willkommen im Admin-Bereich</h1>
        <p className="text-muted-foreground">
          Hier können Sie alle administrativen Aufgaben der Whatsgonow-Plattform verwalten.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">0</CardTitle>
            <p className="text-sm text-muted-foreground">Aktive Nutzer</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">0</CardTitle>
            <p className="text-sm text-muted-foreground">Offene Pre-Registrierungen</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">0</CardTitle>
            <p className="text-sm text-muted-foreground">Feedback heute</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">0</CardTitle>
            <p className="text-sm text-muted-foreground">Aktive Fahrer</p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
