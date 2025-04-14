
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Legal = () => {
  return (
    <Layout>
      <div className="container max-w-4xl px-4 py-8">
        <Link to="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">Rechtliche Informationen</h1>
        
        <Tabs defaultValue="terms">
          <TabsList className="mb-8">
            <TabsTrigger value="terms">AGB</TabsTrigger>
            <TabsTrigger value="privacy">Datenschutz</TabsTrigger>
            <TabsTrigger value="imprint">Impressum</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terms" className="space-y-6">
            <h2 className="text-2xl font-semibold">Allgemeine Geschäftsbedingungen</h2>
            <p className="text-gray-700">
              Stand: 14.04.2025
            </p>
            
            <div className="prose prose-gray max-w-none">
              <h3>1. Geltungsbereich</h3>
              <p>
                Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung der Whatsgonow-Plattform, 
                die von der Whatsgonow GmbH betrieben wird. Durch die Nutzung unserer Dienste erklären 
                Sie sich mit diesen Bedingungen einverstanden.
              </p>
              
              <h3>2. Leistungsbeschreibung</h3>
              <p>
                Whatsgonow ist eine Crowdlogistik-Plattform, die Transportanfragen zwischen privaten oder 
                kleingewerblichen Auftraggebern und mobilen Fahrern vermittelt. Wir stellen die technische 
                Infrastruktur zur Verfügung, sind jedoch nicht selbst Vertragspartner der vermittelten Transporte.
              </p>
              
              <h3>3. Registrierung und Nutzerkonto</h3>
              <p>
                Für die Nutzung der Plattform ist eine Registrierung erforderlich. Sie sind verpflichtet, 
                wahrheitsgemäße Angaben zu machen und Ihre Zugangsdaten geheim zu halten.
              </p>
              
              <h3>4. Preise und Zahlungen</h3>
              <p>
                Die Preise für Transporte werden individuell zwischen Auftraggeber und Fahrer vereinbart. 
                Whatsgonow erhebt eine Servicepauschale in Höhe von 10% des vereinbarten Transportpreises.
              </p>
              
              <h3>5. Haftung</h3>
              <p>
                Wir übernehmen keine Haftung für die ordnungsgemäße Durchführung der vermittelten Transporte. 
                Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.
              </p>
              
              <h3>6. Datenschutz</h3>
              <p>
                Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer 
                Datenschutzerklärung.
              </p>
              
              <h3>7. Schlussbestimmungen</h3>
              <p>
                Es gilt deutsches Recht. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <h2 className="text-2xl font-semibold">Datenschutzerklärung</h2>
            <p className="text-gray-700">
              Stand: 14.04.2025
            </p>
            
            <div className="prose prose-gray max-w-none">
              <p>
                Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Diese 
                Datenschutzerklärung informiert Sie über die Verarbeitung Ihrer Daten bei der 
                Nutzung unserer Plattform.
              </p>
              
              <h3>1. Verantwortlicher</h3>
              <p>
                Verantwortlich für die Datenverarbeitung ist die Whatsgonow GmbH, Musterstraße 123, 
                10115 Berlin, Deutschland.
              </p>
              
              <h3>2. Welche Daten wir erheben</h3>
              <p>
                Wir erheben folgende personenbezogene Daten:
              </p>
              <ul>
                <li>Registrierungsdaten (Name, E-Mail, Passwort)</li>
                <li>Profildaten (Adresse, Telefonnummer, optional: Profilbild)</li>
                <li>Standortdaten bei Nutzung der App</li>
                <li>Zahlungsdaten</li>
                <li>Kommunikationsdaten mit anderen Nutzern</li>
              </ul>
              
              <h3>3. Zwecke der Verarbeitung</h3>
              <p>
                Wir verarbeiten Ihre Daten zur Bereitstellung unserer Dienste, zur Abwicklung von 
                Zahlungen, zur Kommunikation mit Ihnen und zur Verbesserung unseres Angebots.
              </p>
              
              <h3>4. Rechtsgrundlagen</h3>
              <p>
                Die Verarbeitung erfolgt zur Vertragserfüllung, aufgrund Ihrer Einwilligung oder 
                aufgrund unserer berechtigten Interessen.
              </p>
              
              <h3>5. Speicherdauer</h3>
              <p>
                Wir speichern Ihre Daten, solange Sie ein Nutzerkonto bei uns haben und darüber 
                hinaus zur Erfüllung gesetzlicher Aufbewahrungspflichten.
              </p>
              
              <h3>6. Ihre Rechte</h3>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der 
                Verarbeitung, Datenübertragbarkeit und Widerspruch.
              </p>
            </div>
            
            <div className="mt-6">
              <Button asChild>
                <Link to="/data-deletion">Daten löschen lassen</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="imprint" className="space-y-6">
            <h2 className="text-2xl font-semibold">Impressum</h2>
            
            <div className="prose prose-gray max-w-none">
              <h3>Angaben gemäß § 5 TMG:</h3>
              <p>
                Whatsgonow GmbH<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                Deutschland
              </p>
              
              <h3>Vertreten durch:</h3>
              <p>
                Max Mustermann, Geschäftsführer
              </p>
              
              <h3>Kontakt:</h3>
              <p>
                Telefon: +49 (0) 30 123456789<br />
                E-Mail: info@whatsgonow.com
              </p>
              
              <h3>Registereintrag:</h3>
              <p>
                Eintragung im Handelsregister.<br />
                Registergericht: Amtsgericht Berlin-Charlottenburg<br />
                Registernummer: HRB 123456
              </p>
              
              <h3>Umsatzsteuer-ID:</h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                DE123456789
              </p>
              
              <h3>Streitschlichtung:</h3>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                https://ec.europa.eu/consumers/odr/.<br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Legal;
