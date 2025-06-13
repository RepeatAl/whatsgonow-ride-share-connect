
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <Layout 
      title="Datenschutzerklärung - Whatsgonow" 
      description="Datenschutzerklärung und Informationen zur Datenverarbeitung bei Whatsgonow"
    >
      <div className="container max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
          </div>
          
          <p className="text-muted-foreground">
            Informationen zur Datenverarbeitung bei Whatsgonow gemäß DSGVO
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Verantwortlicher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Whatsgonow GmbH</strong><br />
                Musterstraße 123, 10115 Berlin<br />
                E-Mail: privacy@whatsgonow.com<br />
                Telefon: +49 (0) 30 123456789
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Datenschutzbeauftragter</h4>
              <p className="text-sm text-muted-foreground">
                Bei Fragen zum Datenschutz wenden Sie sich an: privacy@whatsgonow.com
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Datenverarbeitung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Registrierung und Nutzung</h4>
              <ul className="list-disc ml-6 text-sm space-y-1">
                <li>E-Mail-Adresse und Passwort für Account-Erstellung</li>
                <li>Profilinformationen zur Plattform-Nutzung</li>
                <li>Transportdaten für Vermittlungsdienstleistung</li>
                <li>Kommunikationsdaten für Support und Abwicklung</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">HERE Maps Integration</h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Externe Kartenintegration:</strong>
                </p>
                <ul className="list-disc ml-6 text-xs text-blue-700 space-y-1">
                  <li>Nutzung erfolgt nur nach expliziter Einwilligung</li>
                  <li>IP-Adresse wird an HERE Global B.V. übertragen</li>
                  <li>Standortdaten für Kartendarstellung</li>
                  <li>Einwilligung jederzeit widerrufbar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Ihre Rechte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="border rounded-lg p-3">
                <h5 className="font-medium mb-1">Auskunftsrecht (Art. 15 DSGVO)</h5>
                <p className="text-sm text-muted-foreground">
                  Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-medium mb-1">Löschung (Art. 17 DSGVO)</h5>
                <p className="text-sm text-muted-foreground">
                  Sie können die Löschung Ihrer Daten verlangen
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-medium mb-1">Datenportabilität (Art. 20 DSGVO)</h5>
                <p className="text-sm text-muted-foreground">
                  Sie können Ihre Daten in einem strukturierten Format erhalten
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button asChild>
                <a href="mailto:privacy@whatsgonow.com">
                  Datenschutz-Anfrage stellen
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-muted-foreground text-center">
          <p>Stand: 12. Juni 2025</p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
