
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { ArrowLeft, CheckCircle, Users, Globe, Truck, Heart } from "lucide-react";

const About = () => {
  const { t } = useTranslation(['landing', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout pageType="about">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header with back navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to={getLocalizedUrl("/")} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('common:back_to_home', 'Zurück zur Startseite')}
              </Link>
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Über Whatsgonow
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Wir verbinden Menschen und reduzieren Leerfahrten durch intelligente Transport-Vermittlung
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Unsere Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-4xl mx-auto">
              Whatsgonow revolutioniert den Transportsektor durch die Verbindung von privaten und gewerblichen Auftraggebern 
              mit mobilen Fahrern. Unser Ziel ist es, Leerfahrten zu reduzieren, nachhaltige Mobilität zu fördern und 
              gleichzeitig neue Einkommensquellen zu schaffen.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <Truck className="h-12 w-12 text-brand-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Effiziente Logistik</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimierung von Transportrouten durch intelligente Vermittlung zwischen Fahrern und Auftraggebern
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <Globe className="h-12 w-12 text-brand-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Nachhaltigkeit</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reduzierung von CO₂-Emissionen durch die Vermeidung von Leerfahrten und optimierte Routenplanung
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <Users className="h-12 w-12 text-brand-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Aufbau einer starken Gemeinschaft von Fahrern, Auftraggebern und Community Managern
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Unsere Werte</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparenz</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Vollständige Transparenz bei Preisen, Bewertungen und ESG-Daten für alle Nutzer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sicherheit</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ID-Verifizierung, Bewertungssystem und Versicherungsschutz für alle Transporte
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Heart className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fairness</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Faire Preise und Konditionen für alle Beteiligten in unserem Ökosystem
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Kontinuierliche Weiterentwicklung unserer Plattform für bessere Nutzererfahrung
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-brand-orange text-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit, Teil der Lösung zu werden?</h2>
            <p className="text-xl mb-6">
              Registriere dich jetzt und hilf uns dabei, Transport nachhaltiger und effizienter zu gestalten
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default" className="bg-white text-brand-orange hover:bg-gray-100">
                <Link to={getLocalizedUrl("/register")}>Jetzt registrieren</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to={getLocalizedUrl("/pre-register")}>Vorab registrieren</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
