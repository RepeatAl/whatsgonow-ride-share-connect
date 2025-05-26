
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageMCP();

  const handleGoHome = () => {
    console.log("[NotFound] Navigating to home:", `/${currentLanguage}`);
    navigate(`/${currentLanguage}`, { replace: true });
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <Layout pageType="error">
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
            <CardDescription className="text-lg">
              Seite nicht gefunden
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Die angeforderte Seite konnte nicht gefunden werden.
            </p>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleGoHome} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Zur Startseite
              </Button>
              
              <Button onClick={handleGoBack} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            </div>
            
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Technische Details
              </summary>
              <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                <p><strong>Pfad:</strong> {window.location.pathname}</p>
                <p><strong>Sprache:</strong> {currentLanguage}</p>
                <p><strong>Vollständige URL:</strong> {window.location.href}</p>
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
