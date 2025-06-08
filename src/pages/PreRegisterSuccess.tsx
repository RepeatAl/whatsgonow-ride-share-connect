
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Link } from 'react-router-dom';

const PreRegisterSuccess = () => {
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout pageType="public">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Vielen Dank für Ihr Interesse!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Sie wurden erfolgreich für unseren Launch vorregistriert.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Was passiert als nächstes?
                  </h3>
                  <ul className="text-blue-700 dark:text-blue-200 space-y-2 text-left">
                    <li>• Sie erhalten eine Bestätigungs-E-Mail</li>
                    <li>• Wir informieren Sie über unseren Launch</li>
                    <li>• Sie bekommen exklusiven Zugang zu neuen Features</li>
                    <li>• Early-Bird Vorteile warten auf Sie</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <Link to={getLocalizedUrl('/')}>
                    <Button className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Zurück zur Startseite
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreRegisterSuccess;
