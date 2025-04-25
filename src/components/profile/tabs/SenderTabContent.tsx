
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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
                Verlauf anzeigen
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
              Zeitplan anzeigen
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="brand" asChild className="mt-4">
            <Link to="/create-order">Neuen Auftrag erstellen</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
