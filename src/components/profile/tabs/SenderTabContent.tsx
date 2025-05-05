
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, ExternalLink, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SenderTabContentProps {
  profile: any;
}

export function SenderTabContent({ profile }: SenderTabContentProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Versenderprofil</CardTitle>
        <CardDescription>Verwalte deine Transporte und Aufträge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-muted/50 border-muted-foreground/20">
          <Navigation className="h-4 w-4 mr-2" />
          <AlertDescription>
            Schnellzugriff: Nutze den <span className="font-medium">"Neuer Auftrag"</span> Button in der Hauptnavigation, um direkt einen Transportauftrag zu erstellen.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Meine Aufträge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Keine aktiven Aufträge</span>
              </div>
              <Button variant="outline" size="sm" asChild className="mt-2">
                <Link to="/orders">Aufträge anzeigen</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Letzte Transporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Keine abgeschlossenen Transporte</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Link to="/orders">Verlauf anzeigen</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-50 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Geplante Transporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Keine geplanten Transporte</span>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <Link to="/orders">Zeitplan anzeigen</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="brand" asChild className="mt-4">
            <Link to="/create-order" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Neuen Auftrag erstellen
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
