
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export const FaqSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Häufig gestellte Fragen</CardTitle>
        <CardDescription>
          Schnelle Antworten auf häufige Fragen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Wie kann ich mein Paket verfolgen?</h3>
            <p className="text-gray-600 text-sm">
              Sie können Ihr Paket auf der Tracking-Seite mit Ihrer Auftrags-ID verfolgen. Es werden Echtzeitupdates bereitgestellt.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Welche Zahlungsmethoden akzeptieren Sie?</h3>
            <p className="text-gray-600 text-sm">
              Wir akzeptieren alle gängigen Kreditkarten, PayPal und Banküberweisungen für sichere Zahlungen.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Wie kann ich Transportanbieter werden?</h3>
            <p className="text-gray-600 text-sm">
              Besuchen Sie die Seite 'Transport anbieten', um sich als Anbieter zu registrieren. Sie müssen Ihre Identität verifizieren und Ihr Profil einrichten.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link to="/faq">Alle FAQs anzeigen</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
