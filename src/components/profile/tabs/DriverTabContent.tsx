
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Calendar, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DriverTabContentProps {
  profile: any;
}

export function DriverTabContent({ profile }: DriverTabContentProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Fahrerprofil</CardTitle>
        <CardDescription>Verwalte deine Fahrerinformationen und verfügbaren Transporte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-muted/50 border-muted-foreground/20">
          <Navigation className="h-4 w-4 mr-2" />
          <AlertDescription>
            Schnellzugriff: Nutze den <span className="font-medium">"Transport anbieten"</span> Button in der Hauptnavigation, um direkt eine Transportmöglichkeit anzubieten.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mein Fahrzeug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Noch nicht konfiguriert</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Fahrzeug hinzufügen
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Verfügbare Strecken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Keine aktiven Strecken</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Strecke hinzufügen
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-50 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transportplan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Keine geplanten Transporte</span>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Transport planen
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="brand" asChild className="mt-4">
            <Link to="/offer-transport">
              Neuen Transport anbieten
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
