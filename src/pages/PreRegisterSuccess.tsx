
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Mail, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PreRegisterSuccess = () => {
  const { t } = useTranslation(['pre_register', 'common']);
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<string>('success');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const statusParam = searchParams.get('status');
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    if (statusParam) {
      setStatus(statusParam);
    }
  }, [searchParams]);

  const getStatusConfig = () => {
    switch (status) {
      case 'email_failed':
        return {
          icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
          title: 'Vorregistrierung erfolgreich - E-Mail-Problem',
          description: 'Ihre Vorregistrierung wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht versendet werden.',
          variant: 'warning' as const,
          showEmailNote: true
        };
      case 'duplicate':
        return {
          icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
          title: 'E-Mail bereits registriert',
          description: 'Diese E-Mail-Adresse ist bereits für die Vorregistrierung angemeldet.',
          variant: 'info' as const,
          showEmailNote: false
        };
      default:
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: 'Vorregistrierung erfolgreich!',
          description: 'Vielen Dank für Ihre Vorregistrierung bei Whatsgonow.',
          variant: 'success' as const,
          showEmailNote: true
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  {statusConfig.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statusConfig.title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  {statusConfig.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {statusConfig.showEmailNote && status === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner.
                    </AlertDescription>
                  </Alert>
                )}

                {status === 'email_failed' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Die Bestätigungs-E-Mail konnte nicht versendet werden, aber Ihre Vorregistrierung wurde erfolgreich gespeichert. 
                      Sie können sich trotzdem jetzt vollständig registrieren.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    {status === 'duplicate' 
                      ? 'Sie können direkt zur vollständigen Registrierung wechseln:'
                      : 'Möchten Sie sich jetzt vollständig registrieren?'
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                      <Link to={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Jetzt registrieren
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="lg">
                      <Link to="/">
                        Zur Startseite
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Was passiert als nächstes?
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Sie erhalten eine Benachrichtigung, sobald Whatsgonow in Ihrer Region verfügbar ist</li>
                    <li>• Sie können sich jederzeit vollständig registrieren</li>
                    <li>• Ihre Daten sind sicher und DSGVO-konform gespeichert</li>
                  </ul>
                </div>

                {email && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Registriert mit: {email}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreRegisterSuccess;
