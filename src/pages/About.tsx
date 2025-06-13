
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Truck, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <Layout 
      title="Über uns - Whatsgonow" 
      description="Erfahren Sie mehr über Whatsgonow, die Crowdlogistik-Plattform für Transport und Mobilität"
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
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Über Whatsgonow</h1>
          </div>
          
          <p className="text-muted-foreground">
            Die Crowdlogistik-Plattform für spontane und geplante Transporte
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Unsere Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Whatsgonow verbindet private und geschäftliche Auftraggeber mit verifizierten 
              Fahrern in Echtzeit. Wir schaffen eine nachhaltige, effiziente und 
              community-getriebene Lösung für Transportbedürfnisse aller Art.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Wie wir arbeiten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🤝 Community-First</h4>
                <p className="text-sm text-muted-foreground">
                  Verifizierte Community Manager sorgen für Qualität und Vertrauen
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🔒 Sicherheit</h4>
                <p className="text-sm text-muted-foreground">
                  Vollständige Verifizierung, Treuhand-System und Bewertungen
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🌱 Nachhaltigkeit</h4>
                <p className="text-sm text-muted-foreground">
                  Optimale Auslastung reduziert CO2-Emissionen und Verkehr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link to="/register">
              Jetzt Teil der Community werden
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default About;
