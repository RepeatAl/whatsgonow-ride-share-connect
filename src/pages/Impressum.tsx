
// 🚨 LOCKED FILE – Do not edit without explicit CTO approval! (Stand: 13.06.2025)
// Änderungen an Footer, Legal, Privacy oder Map-Consent NUR nach schriftlicher Freigabe durch Christiane!

import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Impressum = () => {
  return (
    <Layout 
      title="Impressum - Whatsgonow" 
      description="Impressum und Anbieterkennzeichnung gemäß § 5 TMG"
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
            <Building className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Impressum</h1>
          </div>
          
          <p className="text-muted-foreground">
            Anbieterkennzeichnung gemäß § 5 TMG
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Anbieter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Whatsgonow</strong><br />
                München, Deutschland<br />
                Verantwortlich: Whatsgonow Team
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Kontakt</h4>
              <p className="text-sm text-muted-foreground">
                E-Mail: <span className="text-blue-600 select-all">admin[at]whatsgonow[dot]com</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Bitte [at] durch @ und [dot] durch . ersetzen.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Rechtliche Hinweise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Haftung für Inhalte</h4>
              <p className="text-sm text-muted-foreground">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte 
                auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach 
                §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der 
                Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu 
                überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Haftung für Links</h4>
              <p className="text-sm text-muted-foreground">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren 
                Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden 
                Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten 
                verantwortlich.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Streitschlichtung</h4>
              <p className="text-sm text-muted-foreground">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren 
                vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Kontakt per E-Mail:
            </p>
            <span className="text-blue-600 select-all font-mono">
              admin[at]whatsgonow[dot]com
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Bitte [at] durch @ und [dot] durch . ersetzen.
            </p>
          </div>
        </div>

        <div className="mt-8 text-sm text-muted-foreground text-center">
          <p>Stand: 13. Juni 2025</p>
        </div>
      </div>
    </Layout>
  );
};

export default Impressum;
