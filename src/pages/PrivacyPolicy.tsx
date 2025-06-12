
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Users, CreditCard, FileText, Mail, Phone, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicy = () => {
  const lastUpdated = "12. Juni 2025";
  const effectiveDate = "12. Juni 2025";

  return (
    <Layout 
      title="Datenschutzerklärung - Whatsgonow" 
      description="DSGVO-konforme Datenschutzerklärung der Whatsgonow Crowdlogistik-Plattform"
    >
      <div className="container max-w-4xl px-4 py-8">
        {/* Header Navigation */}
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
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">Stand: {lastUpdated}</Badge>
            <Badge variant="outline">DSGVO-konform</Badge>
            <Badge variant="outline">GoBD-ready</Badge>
          </div>
          
          <p className="text-muted-foreground">
            Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der 
            Verarbeitung von personenbezogenen Daten auf unserer Crowdlogistik-Plattform „Whatsgonow".
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Verantwortlicher */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Verantwortlicher für die Datenverarbeitung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Whatsgonow GmbH</h4>
                <p className="text-sm text-muted-foreground">
                  Musterstraße 123<br />
                  10115 Berlin<br />
                  Deutschland
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:privacy@whatsgonow.com" className="text-primary hover:underline">
                    privacy@whatsgonow.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+49 30 123456789</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Datenschutzbeauftragter</h4>
                <p className="text-sm">
                  Bei Fragen zum Datenschutz wenden Sie sich direkt an unseren 
                  Datenschutzbeauftragten: <a href="mailto:dpo@whatsgonow.com" className="text-primary hover:underline">dpo@whatsgonow.com</a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Erhobene Daten - Whatsgonow-spezifisch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                2. Welche Daten wir erheben und verarbeiten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Grunddaten für alle Nutzer</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Name, Vorname, E-Mail-Adresse</li>
                  <li>Telefonnummer (für Verifizierung und Kommunikation)</li>
                  <li>Postleitzahl und Region (für Matching-Algorithmus)</li>
                  <li>Nutzerrolle (Fahrer, Privat-/Geschäftssender, Community Manager)</li>
                  <li>Spracheinstellung und Lokalisierungsdaten</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Zusätzliche Daten nach Nutzerrolle</h4>
                
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2 text-blue-700">👤 Fahrer</h5>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Vollständige Adresse (für Lieferungen)</li>
                      <li>Fahrzeugdaten (Typ, Größe, Kapazität, Fotos)</li>
                      <li>Führerschein-Verifizierung und KYC-Daten</li>
                      <li>GPS-Standortdaten (während aktiver Fahrten)</li>
                      <li>Bankkonto-/Zahlungsdaten für Auszahlungen</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2 text-green-700">📦 Versender (Privat)</h5>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Abhol- und Lieferadressen</li>
                      <li>Artikel-/Paketbeschreibungen und Fotos</li>
                      <li>Zahlungsdaten (PayPal, Kreditkarte)</li>
                      <li>Adressbuch-Einträge (optional)</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2 text-purple-700">🏢 Versender (Geschäftlich)</h5>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Alle Privat-Versender-Daten plus:</li>
                      <li>Firmendaten und Handelsregisternummer</li>
                      <li>USt-IdNr. für Rechnungsstellung</li>
                      <li>Mehrere Standorte und Team-Verwaltung</li>
                      <li>Analytics- und BI-Daten</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2 text-orange-700">🛡️ Community Manager & Admins</h5>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Erweiterte Nutzer-/Auftragsdaten (für Moderation)</li>
                      <li>Audit-Logs und System-Zugriffsdaten</li>
                      <li>Kommunikationsverläufe (für Support)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Technische Daten</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>IP-Adresse, Browser-Informationen, Gerätedaten</li>
                  <li>Session-IDs und Cookies</li>
                  <li>Nutzungsstatistiken und Plattform-Analytics</li>
                  <li>Transaktions- und Zahlungsverläufe</li>
                  <li>Chat-Nachrichten zwischen Nutzern</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 3. Sichtbarkeitslogik - "Wer sieht was" */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                3. „Wer sieht was" – Sichtbarkeitslogik Ihrer Daten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  <AlertTriangle className="inline h-4 w-4 mr-2 text-primary" />
                  Wichtig: Je nach Nutzerrolle und Beziehung sehen andere Nutzer unterschiedliche Daten von Ihnen.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">🌍 Öffentlich sichtbar (für alle Nutzer)</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Vorname, Region/PLZ-Bereich</li>
                    <li>Profilbild und Verifizierungs-Status</li>
                    <li>Bewertungen und Durchschnittsbewertung</li>
                    <li>Fahrzeugtyp (bei Fahrern)</li>
                    <li>Aktive Transport-Angebote (anonymisiert)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">🤝 Bei aktiver Transaktion sichtbar</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Vollständiger Name und Telefonnummer</li>
                    <li>Vollständige Lieferadresse</li>
                    <li>Chat-Kommunikation</li>
                    <li>Transaktionsdetails und Status</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">🛡️ Nur für Community Manager & Admins</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Vollständige Profil- und Adressdaten</li>
                    <li>Audit-Logs und Aktivitätsverlauf</li>
                    <li>Trust-Score und Moderation-Historie</li>
                    <li>Zahlungsverläufe (anonymisiert)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">🔒 Nur für Sie selbst</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Vollständige Zahlungsdaten</li>
                    <li>Private Nachrichten und E-Mails</li>
                    <li>Persönliche Analytics und BI-Daten</li>
                    <li>Gespeicherte Adressen und Kontakte</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Kontrolle:</strong> Sie können in Ihren Profil-Einstellungen festlegen, 
                  welche Daten für andere Nutzer sichtbar sind. Bei Geschäftstransaktionen 
                  werden bestimmte Daten automatisch geteilt, um den Service zu ermöglichen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Verarbeitungszwecke */}
          <Card>
            <CardHeader>
              <CardTitle>4. Zwecke der Datenverarbeitung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🚚 Plattform-Services</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Vermittlung zwischen Fahrern und Versendern</li>
                    <li>Matching-Algorithmus basierend auf Standort und Anforderungen</li>
                    <li>Echtzeit-Tracking und Statusupdates</li>
                    <li>Qualitätssicherung und Bewertungssystem</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">💳 Zahlungsabwicklung</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Sichere Zahlungsverarbeitung über PayPal und Stripe</li>
                    <li>Treuhand-Service für Transaktionen</li>
                    <li>Auszahlung von Fahrer-Provisionen</li>
                    <li>Rechnungsstellung (insbesondere XRechnung für B2B)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🤖 KI und Automatisierung</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Automatische Artikel-Erkennung durch Bildanalyse</li>
                    <li>Preisempfehlungen basierend auf Marktdaten</li>
                    <li>Routenoptimierung und Zeitschätzungen</li>
                    <li>Betrugserkennung und Risikobewertung</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🛡️ Sicherheit und Compliance</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Know Your Customer (KYC) und Identitätsverifikation</li>
                    <li>Betrugsvermeidung und Geldwäsche-Prävention</li>
                    <li>Community-Moderation und Nutzer-Support</li>
                    <li>Rechtliche Compliance und Audit-Trails</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Rechtsgrundlagen */}
          <Card>
            <CardHeader>
              <CardTitle>5. Rechtsgrundlagen (DSGVO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</h4>
                  <p className="text-sm text-muted-foreground">
                    Durchführung von Transportaufträgen, Zahlungsabwicklung, 
                    Nutzer-Kommunikation, Platform-Services
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</h4>
                  <p className="text-sm text-muted-foreground">
                    Marketing-Kommunikation, erweiterte Analytics, 
                    Cookies und Tracking, HERE Maps Integration
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold">Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse)</h4>
                  <p className="text-sm text-muted-foreground">
                    Betrugsvermeidung, Platform-Sicherheit, 
                    technische Systemwartung, Geschäftsanalyse
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold">Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung)</h4>
                  <p className="text-sm text-muted-foreground">
                    Steuerliche Aufbewahrungspflichten, AML/KYC-Compliance, 
                    Handelsrechtliche Dokumentation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Externe Dienste */}
          <Card>
            <CardHeader>
              <CardTitle>6. Externe Dienste und Drittanbieter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Zahlungsdienstleister
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>PayPal (Europe) S.à r.l. et Cie, S.C.A.</strong><br />
                      <span className="text-muted-foreground">
                        Zahlungsabwicklung und Treuhand-Service
                      </span><br />
                      <a href="https://www.paypal.com/privacy" className="text-primary hover:underline">
                        PayPal Datenschutzerklärung →
                      </a>
                    </div>
                    <div>
                      <strong>Stripe, Inc.</strong><br />
                      <span className="text-muted-foreground">
                        Kreditkarten-Zahlungen und Auszahlungen
                      </span><br />
                      <a href="https://stripe.com/privacy" className="text-primary hover:underline">
                        Stripe Datenschutzerklärung →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🗺️ Kartendienste</h4>
                  <div className="text-sm">
                    <strong>HERE Global B.V.</strong><br />
                    <span className="text-muted-foreground">
                      Interaktive Karten, Routenplanung, Standort-Services
                    </span><br />
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Nur mit expliziter Einwilligung
                    </span><br />
                    <a href="https://legal.here.com/privacy" className="text-primary hover:underline">
                      HERE Datenschutzerklärung →
                    </a>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">☁️ Cloud-Infrastructure</h4>
                  <div className="text-sm">
                    <strong>Supabase, Inc.</strong><br />
                    <span className="text-muted-foreground">
                      Datenbank, Authentication, File Storage
                    </span><br />
                    <a href="https://supabase.com/privacy" className="text-primary hover:underline">
                      Supabase Datenschutzerklärung →
                    </a>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📧 E-Mail-Services</h4>
                  <div className="text-sm">
                    <strong>Resend, Inc.</strong><br />
                    <span className="text-muted-foreground">
                      Transaktions-E-Mails, Benachrichtigungen
                    </span><br />
                    <a href="https://resend.com/privacy" className="text-primary hover:underline">
                      Resend Datenschutzerklärung →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Datenübertragung</h4>
                <p className="text-sm">
                  Alle Drittanbieter-Services erfüllen DSGVO-Standards. 
                  Bei Übertragungen in Drittländer bestehen Angemessenheitsbeschlüsse 
                  oder Standardvertragsklauseln (SCC) zur Datensicherheit.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Speicherdauer und Löschung */}
          <Card>
            <CardHeader>
              <CardTitle>7. Speicherdauer und Datenlöschung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Automatische Löschfristen</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span>Gast-Upload-Sessions</span>
                      <Badge variant="outline">48 Stunden</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span>Chat-Nachrichten (inaktive Aufträge)</span>
                      <Badge variant="outline">2 Jahre</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span>Transaktionsdaten</span>
                      <Badge variant="outline">10 Jahre (GoBD)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span>Inaktive Nutzerkonten</span>
                      <Badge variant="outline">3 Jahre</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span>Marketing-Einwilligungen</span>
                      <Badge variant="outline">Bis zum Widerruf</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Löschung auf Anfrage</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sie können jederzeit die Löschung Ihrer Daten beantragen. 
                    Ausnahmen bestehen nur bei gesetzlichen Aufbewahrungspflichten.
                  </p>
                  <Button asChild>
                    <Link to="/data-deletion">
                      Datenlöschung beantragen →
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Ihre Rechte */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                8. Ihre Datenschutzrechte nach DSGVO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium">📋 Recht auf Auskunft (Art. 15)</h4>
                    <p className="text-sm text-muted-foreground">
                      Übersicht über alle von Ihnen gespeicherten Daten
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-medium">✏️ Recht auf Berichtigung (Art. 16)</h4>
                    <p className="text-sm text-muted-foreground">
                      Korrektur unrichtiger oder unvollständiger Daten
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-3">
                    <h4 className="font-medium">🗑️ Recht auf Löschung (Art. 17)</h4>
                    <p className="text-sm text-muted-foreground">
                      "Recht auf Vergessenwerden" unter bestimmten Voraussetzungen
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-3">
                    <h4 className="font-medium">⏸️ Recht auf Einschränkung (Art. 18)</h4>
                    <p className="text-sm text-muted-foreground">
                      Sperrung der Verarbeitung unter bestimmten Umständen
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-500 pl-3">
                    <h4 className="font-medium">📦 Recht auf Datenübertragbarkeit (Art. 20)</h4>
                    <p className="text-sm text-muted-foreground">
                      Export Ihrer Daten in einem strukturierten Format
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <h4 className="font-medium">🚫 Widerspruchsrecht (Art. 21)</h4>
                    <p className="text-sm text-muted-foreground">
                      Widerspruch gegen bestimmte Verarbeitungen
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-cyan-500 pl-3">
                    <h4 className="font-medium">↩️ Widerruf von Einwilligungen (Art. 7)</h4>
                    <p className="text-sm text-muted-foreground">
                      Rücknahme erteilter Einwilligungen jederzeit möglich
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-pink-500 pl-3">
                    <h4 className="font-medium">⚖️ Recht auf Beschwerde</h4>
                    <p className="text-sm text-muted-foreground">
                      Beschwerde bei der zuständigen Aufsichtsbehörde
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">📞 So können Sie Ihre Rechte ausüben</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Direkte Kontaktaufnahme:</strong><br />
                    <a href="mailto:privacy@whatsgonow.com" className="text-primary hover:underline">
                      privacy@whatsgonow.com
                    </a>
                  </div>
                  <div>
                    <strong>Datenlöschung online:</strong><br />
                    <Link to="/data-deletion" className="text-primary hover:underline">
                      Löschformular verwenden →
                    </Link>
                  </div>
                  <div>
                    <strong>Profil-Einstellungen:</strong><br />
                    <span className="text-muted-foreground">
                      Sichtbarkeit direkt im Dashboard anpassen
                    </span>
                  </div>
                  <div>
                    <strong>Support-Ticket:</strong>
                    <br />
                    <a href="mailto:support@whatsgonow.com" className="text-primary hover:underline">
                      support@whatsgonow.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 9. Cookies und Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>9. Cookies und Tracking-Technologien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Verwendete Cookie-Kategorien</h4>
                  <div className="grid gap-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">🔧 Technisch notwendige Cookies</h5>
                        <Badge variant="default">Immer aktiv</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Session-Management, Authentication, Spracheinstellungen, 
                        Warenkorb-Funktionalität
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">📊 Analytics-Cookies</h5>
                        <Badge variant="outline">Mit Einwilligung</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nutzungsstatistiken, Performance-Monitoring, 
                        A/B-Testing (anonymisiert)
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">🎯 Marketing-Cookies</h5>
                        <Badge variant="outline">Mit Einwilligung</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Personalisierte Werbung, Conversion-Tracking, 
                        Social Media Integration
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Lokale Speicherung</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>LocalStorage: Spracheinstellungen, Theme-Präferenzen</li>
                    <li>SessionStorage: Temporäre Upload-Sessions</li>
                    <li>IndexedDB: Offline-Funktionalität (optional)</li>
                  </ul>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Cookie-Kontrolle:</strong> Sie können Ihre Cookie-Einstellungen 
                    jederzeit über den Banner am unteren Bildschirmrand oder in den 
                    Browser-Einstellungen anpassen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 10. Internationale Datenübertragungen */}
          <Card>
            <CardHeader>
              <CardTitle>10. Internationale Datenübertragungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Einige unserer Dienstleister haben Ihren Sitz außerhalb der EU/EWR. 
                  Wir gewährleisten dennoch ein angemessenes Datenschutzniveau durch:
                </p>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">✅ Angemessenheitsbeschlüsse</h4>
                    <p className="text-sm text-muted-foreground">
                      USA (für PayPal, Stripe): EU-US Data Privacy Framework
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">📄 Standardvertragsklauseln (SCC)</h4>
                    <p className="text-sm text-muted-foreground">
                      Für alle anderen Drittländer-Übertragungen
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium">🔐 Zusätzliche Sicherheitsmaßnahmen</h4>
                    <p className="text-sm text-muted-foreground">
                      End-to-End-Verschlüsselung, Pseudonymisierung, Zugriffsbeschränkungen
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 11. Beschwerdestellen */}
          <Card>
            <CardHeader>
              <CardTitle>11. Aufsichtsbehörden und Beschwerdestellen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">🏛️ Zuständige Aufsichtsbehörde (Deutschland)</h4>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <strong>Berliner Beauftragte für Datenschutz und Informationsfreiheit</strong><br />
                  <span className="text-sm">
                    Friedrichstr. 219, 10969 Berlin<br />
                    Telefon: +49 30 13 889 0<br />
                    E-Mail: mailbox@datenschutz-berlin.de<br />
                    <a href="https://www.datenschutz-berlin.de" className="text-primary hover:underline">
                      Website →
                    </a>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">🇪🇺 Europäische Datenschutzbehörden</h4>
                <p className="text-sm text-muted-foreground">
                  Bei grenzüberschreitenden Datenschutzproblemen können Sie sich auch an 
                  die Datenschutzbehörde Ihres EU-Wohnsitzlandes wenden.
                </p>
                <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_de" 
                   className="text-primary hover:underline text-sm">
                  Liste aller EU-Datenschutzbehörden →
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 12. Aktualisierungen */}
          <Card>
            <CardHeader>
              <CardTitle>12. Änderungen dieser Datenschutzerklärung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren, 
                  um Änderungen in unseren Services oder rechtlichen Anforderungen zu berücksichtigen.
                </p>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📧 Benachrichtigung über Änderungen</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Wesentliche Änderungen werden per E-Mail kommuniziert</li>
                    <li>• Aktuelle Version ist stets auf dieser Seite verfügbar</li>
                    <li>• Versionsnummer und Datum finden Sie am Seitenanfang</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div>
                  <strong>Aktuelle Version:</strong> v2.1<br />
                  <span className="text-sm text-muted-foreground">
                    Letzte Aktualisierung: {lastUpdated}<br />
                    Inkrafttreten: {effectiveDate}
                  </span>
                </div>
                <Badge variant="outline">Aktuelle Version</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Footer - Quick Links */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-lg">Haben Sie Fragen zu Ihrem Datenschutz?</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild variant="default">
                    <a href="mailto:privacy@whatsgonow.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Datenschutz-Team kontaktieren
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/data-deletion">
                      <FileText className="mr-2 h-4 w-4" />
                      Daten löschen lassen
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/legal">
                      <Shield className="mr-2 h-4 w-4" />
                      Weitere rechtliche Infos
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
