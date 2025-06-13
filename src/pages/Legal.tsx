import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, FileText, Shield, CreditCard, Users, AlertTriangle, Building, Gavel, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Legal = () => {
  const lastUpdated = "12. Juni 2025";
  const effectiveDate = "12. Juni 2025";

  return (
    <Layout 
      title="Rechtliche Informationen - Whatsgonow" 
      description="AGB, Nutzungsbedingungen und rechtliche Grundlagen der Whatsgonow Crowdlogistik-Plattform"
    >
      <div className="container max-w-5xl px-4 py-8">
        {/* Header Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Rechtliche Informationen</h1>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">Stand: {lastUpdated}</Badge>
            <Badge variant="outline">DSGVO-konform</Badge>
            <Badge variant="outline">GoBD-ready</Badge>
            <Badge variant="outline">Handelsrecht</Badge>
          </div>
          
          <p className="text-muted-foreground">
            Alle rechtlichen Grundlagen, Nutzungsbedingungen und Geschäftsbedingungen 
            für die Whatsgonow Crowdlogistik-Plattform.
          </p>
        </div>

        <Tabs defaultValue="agb" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agb">AGB & Nutzung</TabsTrigger>
            <TabsTrigger value="roles">Rollen & Rechte</TabsTrigger>
            <TabsTrigger value="payment">Zahlungen & Gebühren</TabsTrigger>
            <TabsTrigger value="impressum">Impressum</TabsTrigger>
          </TabsList>

          {/* AGB & Nutzungsbedingungen */}
          <TabsContent value="agb" className="space-y-8">
            {/* 1. Allgemeine Geschäftsbedingungen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  1. Allgemeine Geschäftsbedingungen (AGB)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1.1 Geltungsbereich</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Diese Allgemeinen Geschäftsbedingungen gelten für alle Nutzer der 
                    Whatsgonow-Plattform, einer Crowdlogistik-Plattform für Transportaufträge, 
                    Community-Aufbau und dynamische Mobilitätslösungen.
                  </p>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Geltung für alle registrierten und nicht-registrierten Nutzer</li>
                    <li>Bindung durch Nutzung der Plattform-Services</li>
                    <li>Änderungen werden mit angemessener Frist bekannt gegeben</li>
                    <li>Kontinuierliche Nutzung gilt als Zustimmung zu Änderungen</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">1.2 Vertragspartner</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Whatsgonow GmbH</strong><br />
                      Registergericht: Amtsgericht Berlin<br />
                      E-Mail: adminatwhatsgonowdotcom
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">1.3 Leistungsbeschreibung</h4>
                  <div className="grid gap-3">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">🚚 Hauptdienstleistung</h5>
                      <p className="text-sm text-muted-foreground">
                        Vermittlung zwischen privaten & geschäftlichen Auftraggebern und 
                        verifizierten Fahrern für Transportaufträge in Echtzeit.
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">🤖 KI-Services</h5>
                      <p className="text-sm text-muted-foreground">
                        Automatische Artikel-Erkennung, Preisempfehlungen, 
                        Routenoptimierung und Matching-Algorithmus.
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">🛡️ Community-Management</h5>
                      <p className="text-sm text-muted-foreground">
                        Qualitätskontrolle, Nutzerbetreuung und Moderation durch 
                        verifizierte Community Manager.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">1.4 Vertragsschluss</h4>
                  <ol className="list-decimal ml-6 text-sm space-y-2">
                    <li>Registrierung stellt ein Angebot des Nutzers dar</li>
                    <li>Annahme erfolgt durch Bestätigung der E-Mail-Adresse</li>
                    <li>Einzelne Transportaufträge kommen zwischen Fahrer und Versender zustande</li>
                    <li>Whatsgonow ist nur Vermittler, nicht Vertragspartei der Transporte</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* 2. Nutzerpflichten */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  2. Nutzerpflichten und Verhaltensregeln
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">2.1 Allgemeine Pflichten</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Wahrheitsgemäße Angaben bei Registrierung</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Aktualisierung von Profildaten bei Änderungen</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Schutz der Zugangsdaten vor Missbrauch</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Einhaltung der Plattform-Etikette und Community-Standards</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2.2 Verbotene Aktivitäten</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Identitätsfälschung oder Vorgabe falscher Daten</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Manipulation des Bewertungs- oder Matching-Systems</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Umgehung der Zahlungsabwicklung</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Belästigung, Diskriminierung oder respektloses Verhalten</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Nutzung für illegale Zwecke oder Transport verbotener Güter</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2.3 Konsequenzen bei Verstößen</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h5 className="font-medium">📝 Verwarnung</h5>
                      <p className="text-sm text-muted-foreground">
                        Bei ersten oder geringfügigen Verstößen erfolgt eine schriftliche Verwarnung
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-medium">⏸️ Temporäre Sperre</h5>
                      <p className="text-sm text-muted-foreground">
                        Bei wiederholten Verstößen: Sperrung für 7-30 Tage je nach Schwere
                      </p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h5 className="font-medium">🚫 Permanente Sperre</h5>
                      <p className="text-sm text-muted-foreground">
                        Bei schweren oder wiederholten Verstößen: Dauerhafte Kontosperrung
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Haftung und Gewährleistung */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  3. Haftung und Gewährleistung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">3.1 Haftungsausschluss für vermittelte Transporte</h4>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm">
                      <AlertTriangle className="inline h-4 w-4 mr-2 text-amber-600" />
                      <strong>Wichtiger Hinweis:</strong> Whatsgonow ist ausschließlich Vermittler zwischen 
                      Fahrern und Versendern. Wir übernehmen keine Haftung für die ordnungsgemäße 
                      Durchführung, Pünktlichkeit, Sicherheit oder Qualität der vermittelten Transporte.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3.2 Plattform-Haftung</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2 text-green-700">✅ Haftung für eigene Leistungen</h5>
                      <p className="text-sm text-muted-foreground">
                        Für die technische Bereitstellung der Plattform, Datenverarbeitung 
                        und eigene Services haften wir bei Vorsatz und grober Fahrlässigkeit unbeschränkt.
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2 text-orange-700">⚖️ Beschränkte Haftung</h5>
                      <p className="text-sm text-muted-foreground">
                        Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher 
                        Vertragspflichten, beschränkt auf den typischen, vorhersehbaren Schaden.
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2 text-red-700">❌ Haftungsausschluss</h5>
                      <p className="text-sm text-muted-foreground">
                        Keine Haftung für Drittinhalte, externe Links, Nutzerverhalten, 
                        höhere Gewalt oder unvorhersehbare technische Störungen.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3.3 Nutzer-Haftung</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Nutzer haften vollständig für alle durch sie verursachten Schäden und stellen 
                    Whatsgonow von Ansprüchen Dritter frei, die aufgrund ihres Verhaltens entstehen.
                  </p>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Schäden durch falsche oder irreführende Angaben</li>
                    <li>Verletzung von Rechten Dritter (Persönlichkeitsrechte, Urheberrechte)</li>
                    <li>Verstöße gegen geltendes Recht oder diese AGB</li>
                    <li>Schäden durch unsachgemäße Nutzung der Plattform</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 4. Geistiges Eigentum */}
            <Card>
              <CardHeader>
                <CardTitle>4. Geistiges Eigentum und Urheberrecht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">4.1 Plattform-Inhalte</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Alle Inhalte der Whatsgonow-Plattform (Design, Software, Texte, Logos, KI-Algorithmen) 
                    sind urheberrechtlich geschützt und Eigentum der Whatsgonow GmbH oder lizenziert.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4.2 Nutzer-Inhalte</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Durch das Hochladen von Inhalten (Fotos, Beschreibungen, Bewertungen) räumen 
                    Sie Whatsgonow ein einfaches, übertragbares Nutzungsrecht zur Bereitstellung 
                    der Services ein.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm">
                      <strong>Ihr Eigentum bleibt bestehen:</strong> Sie behalten alle Rechte an Ihren Inhalten. 
                      Das Nutzungsrecht dient nur der Funktionalität der Plattform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Kündigung und Löschung */}
            <Card>
              <CardHeader>
                <CardTitle>5. Kündigung und Account-Löschung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">5.1 Ordentliche Kündigung</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Nutzer können jederzeit ohne Angabe von Gründen kündigen</li>
                    <li>Kündigung per E-Mail an support@whatsgonow.com</li>
                    <li>Laufende Aufträge sind noch abzuwickeln</li>
                    <li>Datenlöschung nach gesetzlichen Aufbewahrungsfristen</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">5.2 Außerordentliche Kündigung</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Whatsgonow kann bei schweren Verstößen gegen diese AGB das Nutzerkonto 
                    mit sofortiger Wirkung sperren oder kündigen.
                  </p>
                </div>

                <div className="mt-4">
                  <Button asChild>
                    <Link to="/data-deletion">
                      Account löschen lassen →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 6. Schlussbestimmungen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  6. Schlussbestimmungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">6.1 Anwendbares Recht</h4>
                  <p className="text-sm text-muted-foreground">
                    Es gilt ausschließlich deutsches Recht unter Ausschluss des 
                    UN-Kaufrechts und des internationalen Privatrechts.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">6.2 Gerichtsstand</h4>
                  <p className="text-sm text-muted-foreground">
                    Ausschließlicher Gerichtsstand für alle Streitigkeiten ist Berlin, 
                    soweit gesetzlich zulässig.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">6.3 Salvatorische Klausel</h4>
                  <p className="text-sm text-muted-foreground">
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt 
                    die Wirksamkeit der übrigen Bestimmungen unberührt.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Letzte Aktualisierung:</strong> {lastUpdated}<br />
                    <strong>Inkrafttreten:</strong> {effectiveDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rollen & Rechte */}
          <TabsContent value="roles" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Nutzerrollen und Berechtigungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="default">Super Admin</Badge>
                      <h4 className="font-semibold">Systemadministrator</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Vollzugriff auf alle System- und Nutzerdaten</li>
                      <li>User-Management und Rollenvergabe</li>
                      <li>Kritische System-Migrationen und Updates</li>
                      <li>Globales Monitoring und Audit-Funktionen</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">Admin</Badge>
                      <h4 className="font-semibold">Regionaladministrator</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Management regionaler Nutzer und Aufträge</li>
                      <li>Rechnungsstellung und Dispute-Handling</li>
                      <li>Regionale Auswertungen und KPI-Monitoring</li>
                      <li>Eskalations-Management</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline">Community Manager</Badge>
                      <h4 className="font-semibold">Community-Betreuer</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Moderation und Nutzerbetreuung in zugewiesenen Regionen</li>
                      <li>Qualitätskontrolle und Trust-Score-Management</li>
                      <li>Nutzerfreischaltung nach KYC-Verfahren</li>
                      <li>Support-Tickets und Community-Guidelines-Durchsetzung</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-500">Fahrer</Badge>
                      <h4 className="font-semibold">Transportdienstleister</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Aufträge einsehen, annehmen und durchführen</li>
                      <li>Fahrzeug- und ID-Verifizierung erforderlich</li>
                      <li>Live-Tracking während aktiver Fahrten</li>
                      <li>Bewertungssystem und Trust-Score-Aufbau</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-green-500">Privater Sender</Badge>
                      <h4 className="font-semibold">Privatkunde</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Transportaufträge erstellen und verwalten</li>
                      <li>Fahrer suchen und bewerten</li>
                      <li>Persönliches Adressbuch und Favoriten</li>
                      <li>Chat-Kommunikation mit Fahrern</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-purple-500">Business Sender</Badge>
                      <h4 className="font-semibold">Geschäftskunde</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Alle Funktionen des privaten Senders plus:</li>
                      <li>Fahrerpool-Management und Multi-Standort-Verwaltung</li>
                      <li>Team-Management mit Rollenvergabe</li>
                      <li>Business Analytics und erweiterte Reporting-Funktionen</li>
                      <li>XRechnung-kompatible Rechnungsstellung</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline">Public (Gast)</Badge>
                      <h4 className="font-semibold">Anonyme Besucher</h4>
                    </div>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Landing Page und öffentliche Informationen</li>
                      <li>Aufträge und Fahrten einsehen (anonymisiert)</li>
                      <li>Pre-Registration und Wartelisten-Anmeldung</li>
                      <li>FAQ und How-to-Videos</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🔐 Rollenwechsel und Verifizierung</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Nutzer können unter bestimmten Voraussetzungen zusätzliche Rollen beantragen:
                  </p>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Fahrer-Rolle: KYC-Verfahren und Fahrzeugverifizierung erforderlich</li>
                    <li>Business-Account: Nachweis der gewerblichen Tätigkeit</li>
                    <li>Community Manager: Bewerbungsverfahren und regionale Zuteilung</li>
                    <li>Alle Rollenwechsel werden durch Community Manager geprüft</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community-Richtlinien und Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Trust-Score und Bewertungssystem</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <span className="text-sm">Vertrauenswürdige Nutzer (Trust-Score 80-100)</span>
                      <Badge className="bg-green-500">Premium-Funktionen</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <span className="text-sm">Durchschnittliche Nutzer (Trust-Score 50-79)</span>
                      <Badge variant="outline">Standard-Funktionen</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                      <span className="text-sm">Problematische Nutzer (Trust-Score &lt; 50)</span>
                      <Badge variant="destructive">Eingeschränkte Funktionen</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Moderationsmaßnahmen</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium">📝 Inhaltliche Moderation</h5>
                      <p className="text-sm text-muted-foreground">
                        Überprüfung von Profiltexten, Bewertungen und Chat-Nachrichten 
                        durch KI-Filter und Community Manager
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-medium">⚠️ Verhaltensmoderation</h5>
                      <p className="text-sm text-muted-foreground">
                        Überwachung von Nutzerverhalten, Transaktionsmustern und 
                        Community-Interaktionen zur Betrugsprävention
                      </p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h5 className="font-medium">🚫 Sanktionen</h5>
                      <p className="text-sm text-muted-foreground">
                        Stufenweise Maßnahmen von Verwarnungen über temporäre Sperren 
                        bis hin zu dauerhaften Account-Sperrungen
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zahlungen & Gebühren */}
          <TabsContent value="payment" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Zahlungen, Gebühren und Finanzabwicklung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Gebührenstruktur</h4>
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">💳 Service-Gebühren</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>Plattform-Provision</span>
                          <Badge>8% des Transportpreises</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Zahlungsabwicklung</span>
                          <Badge variant="outline">2,9% + 0,35€</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Business-Account (monatlich)</span>
                          <Badge variant="secondary">19,90€</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">🎯 Premium-Services</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>Prioritäts-Matching</span>
                          <Badge>2,50€ pro Auftrag</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Express-Verifizierung</span>
                          <Badge variant="outline">9,90€</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Analytics-Paket</span>
                          <Badge variant="secondary">4,90€/Monat</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <h5 className="font-medium mb-2 text-green-700">🆓 Kostenlose Services</h5>
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        <li>Basis-Registrierung und Profilerstellung</li>
                        <li>Standard-Matching und Auftragssuche</li>
                        <li>Chat-Kommunikation zwischen Nutzern</li>
                        <li>Grundlegende Bewertungs- und Trust-Score-Funktionen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Zahlungsabwicklung</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">💰 Treuhand-Service</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Alle Zahlungen laufen über ein sicheres Treuhand-System:
                      </p>
                      <ol className="list-decimal ml-6 text-sm space-y-1">
                        <li>Kunde zahlt bei Auftragsbestätigung</li>
                        <li>Geld wird sicher verwahrt bis zur Lieferung</li>
                        <li>Freigabe nach erfolgreicher Zustellung</li>
                        <li>Automatische Auszahlung an Fahrer (abzgl. Provision)</li>
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">🏦 Akzeptierte Zahlungsmethoden</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border rounded p-3 text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-2" />
                          <span className="text-sm">Kreditkarte</span>
                        </div>
                        <div className="border rounded p-3 text-center">
                          <div className="h-6 w-6 mx-auto mb-2 bg-blue-500 rounded" />
                          <span className="text-sm">PayPal</span>
                        </div>
                        <div className="border rounded p-3 text-center">
                          <div className="h-6 w-6 mx-auto mb-2 bg-green-500 rounded" />
                          <span className="text-sm">SEPA</span>
                        </div>
                        <div className="border rounded p-3 text-center">
                          <div className="h-6 w-6 mx-auto mb-2 bg-orange-500 rounded" />
                          <span className="text-sm">Business*</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        *Business-Kunden: Rechnung auf Firmenname, SEPA-Lastschrift, Kauf auf Rechnung
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Rechnungsstellung und Steuern</h4>
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">📄 GoBD-konforme Rechnungen</h5>
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        <li>Automatische Rechnungserstellung nach jedem Auftrag</li>
                        <li>10 Jahre Aufbewahrung gemäß GoBD-Richtlinien</li>
                        <li>Digitale Signatur für Rechtssicherheit</li>
                        <li>Export für Steuerberater (DATEV-Format)</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">🧾 XRechnung für Business-Kunden</h5>
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        <li>Elektronische Rechnungen im XRechnung-Standard</li>
                        <li>Direkte Übertragung an öffentliche Auftraggeber</li>
                        <li>Automatische USt-Berechnung und -Ausweisung</li>
                        <li>Integration in ERP-Systeme möglich</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                      <h5 className="font-medium mb-2 text-blue-700">💡 Steuerliche Hinweise</h5>
                      <p className="text-sm text-muted-foreground">
                        Fahrer sind für ihre steuerlichen Pflichten selbst verantwortlich. 
                        Wir stellen Ihnen alle notwendigen Unterlagen zur Verfügung, 
                        empfehlen aber die Beratung durch einen Steuerexperten.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Dispute-Management</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h5 className="font-medium">⚡ Sofortige Eskalation</h5>
                      <p className="text-sm text-muted-foreground">
                        Bei Problemen wird automatisch ein Community Manager benachrichtigt
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium">🔍 Untersuchung</h5>
                      <p className="text-sm text-muted-foreground">
                        Alle Beweise werden gesammelt: Chat-Verlauf, GPS-Daten, Fotos, Bewertungen
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-medium">⚖️ Entscheidung</h5>
                      <p className="text-sm text-muted-foreground">
                        Faire Lösung durch neutrale Moderation, ggf. anteilige Rückerstattung
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impressum */}
          <TabsContent value="impressum" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Impressum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Angaben gemäß § 5 TMG</h4>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="space-y-2">
                      <p><strong>Whatsgonow GmbH</strong></p>
                      <p>Deutschland</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Vertreten durch</h4>
                  <p className="text-sm">Max Mustermann, Geschäftsführer</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Kontakt</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>E-Mail:</strong> adminatwhatsgonowdotcom</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Registereintrag</h4>
                  <div className="text-sm space-y-1">
                    <p>Eintragung im Handelsregister</p>
                    <p><strong>Registergericht:</strong> Amtsgericht Berlin</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Umsatzsteuer-ID</h4>
                  <p className="text-sm">
                    Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:<br />
                    <strong>DE123456789</strong>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Berufsrechtliche Regelungen</h4>
                  <p className="text-sm text-muted-foreground">
                    Als Crowdlogistik-Plattform unterliegen wir den Bestimmungen des 
                    deutschen Handelsgesetzbuchs (HGB) sowie der EU-Verordnung für 
                    Plattform-Services (P2B-Verordnung).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Streitschlichtung</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                    </p>
                    <a 
                      href="https://ec.europa.eu/consumers/odr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                    <p className="text-sm text-muted-foreground">
                      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren 
                      vor einer Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Haftung für Inhalte</h4>
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
                  <h4 className="font-semibold mb-3">Haftung für Links</h4>
                  <p className="text-sm text-muted-foreground">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren 
                    Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden 
                    Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                    Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten 
                    verantwortlich.
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📞 Kontakt</h4>
                  <div className="text-sm">
                    <strong>E-Mail:</strong><br />
                    <span className="text-primary">adminatwhatsgonowdotcom</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-lg">Haben Sie Fragen zu den rechtlichen Bestimmungen?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="default">
                  <a href="mailto:adminatwhatsgonowdotcom">
                    <Scale className="mr-2 h-4 w-4" />
                    Rechtliche Fragen
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/privacy-policy">
                    <Shield className="mr-2 h-4 w-4" />
                    Datenschutzerklärung
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/support">
                    <Users className="mr-2 h-4 w-4" />
                    Support kontaktieren
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Legal;
