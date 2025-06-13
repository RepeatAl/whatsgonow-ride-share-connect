
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useLegalPages } from '@/hooks/useContentManagement';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

interface DynamicLegalPageProps {
  slug: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const DynamicLegalPage: React.FC<DynamicLegalPageProps> = ({
  slug,
  fallbackTitle = 'Legal Information',
  fallbackDescription = 'Legal information and terms'
}) => {
  const { getLegalPageWithTranslation } = useLegalPages();
  const { getLocalizedUrl } = useLanguageMCP();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const data = await getLegalPageWithTranslation(slug);
        setPageData(data);
      } catch (err) {
        console.error(`Error loading legal page ${slug}:`, err);
        setError('Could not load legal page');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug, getLegalPageWithTranslation]);

  if (loading) {
    return (
      <Layout title={fallbackTitle} description={fallbackDescription}>
        <div className="container max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !pageData) {
    return (
      <Layout title={fallbackTitle} description={fallbackDescription}>
        <div className="container max-w-4xl px-4 py-8">
          <div className="mb-6">
            <Link to={getLocalizedUrl('/')}>
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Startseite
              </Button>
            </Link>
          </div>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Seite nicht verfügbar
              </h2>
              <p className="text-red-700">
                Die angeforderte Seite konnte nicht geladen werden.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${pageData.title} - Whatsgonow`} 
      description={pageData.title}
    >
      <div className="container max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link to={getLocalizedUrl('/')}>
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{pageData.title}</h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
            
            {pageData.translation_status && pageData.translation_status !== 'approved' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Translation Status: {pageData.translation_status}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild>
            <a href="mailto:admin@whatsgonow.com">
              Bei Fragen kontaktieren
            </a>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground text-center">
          <p>
            Letzte Aktualisierung: {new Date(pageData.updated_at).toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DynamicLegalPage;
