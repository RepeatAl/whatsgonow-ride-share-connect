
// [LOCKED: Do not modify without CTO approval – siehe docs/locks/CONTENT_FAQ_LOCK.md]

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Users, CreditCard, Shield, Headphones } from 'lucide-react';
import { useFAQ, FAQItemWithTranslation } from '@/hooks/useContentManagement';
import { useTranslation } from 'react-i18next';

export const DynamicFAQ: React.FC = () => {
  const { t } = useTranslation(['common', 'faq']);
  const { getFAQWithTranslations } = useFAQ();
  const [faqData, setFaqData] = useState<FAQItemWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadFAQ = async () => {
      try {
        setLoading(true);
        const data = await getFAQWithTranslations();
        // Stabilized: Always ensure we have an array
        if (Array.isArray(data)) {
          setFaqData(data);
        } else {
          console.warn('FAQ data is not an array, using empty array fallback');
          setFaqData([]);
        }
      } catch (err) {
        console.error('Error loading FAQ:', err);
        setFaqData([]); // Always fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    loadFAQ();
  }, [getFAQWithTranslations, mounted]);

  // Stabilized category extraction with type safety
  const getCategories = (): string[] => {
    if (!Array.isArray(faqData) || faqData.length === 0) return [];
    try {
      return [...new Set(faqData.map(item => item?.category).filter(Boolean))];
    } catch (err) {
      console.error('Error extracting categories:', err);
      return [];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'allgemein': return <HelpCircle className="h-4 w-4" />;
      case 'registrierung & sicherheit': return <Shield className="h-4 w-4" />;
      case 'aufträge & matching': return <Users className="h-4 w-4" />;
      case 'bezahlung & sicherheit': return <CreditCard className="h-4 w-4" />;
      case 'support & community': return <Headphones className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const categories = getCategories();
  
  // Stabilized filtering with type safety
  const getFilteredFAQ = (): FAQItemWithTranslation[] => {
    if (!Array.isArray(faqData)) return [];
    
    try {
      return faqData.filter(item => {
        if (!item) return false;
        
        const matchesSearch = !searchTerm || 
          (item.question && item.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.answer && item.answer.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    } catch (err) {
      console.error('Error filtering FAQ:', err);
      return [];
    }
  };

  const filteredFAQ = getFilteredFAQ();

  const groupedFAQ = filteredFAQ.reduce((acc, item) => {
    if (!item?.category) return acc;
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItemWithTranslation[]>);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Layout title="FAQ - Whatsgonow" description="Häufig gestellte Fragen">
        <div className="container max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="FAQ - Whatsgonow" description="Häufig gestellte Fragen zu whatsgonow - der Crowdlogistik-Plattform">
      <div className="container max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            FAQ - Häufig gestellte Fragen
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hier findest du Antworten auf die häufigsten Fragen zu whatsgonow
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche in FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Alle Kategorien
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {getCategoryIcon(category)}
                {category}
                <Badge variant="secondary" className="ml-1">
                  {faqData.filter(item => item?.category === category).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        {Object.keys(groupedFAQ).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Ergebnisse gefunden</h3>
              <p className="text-muted-foreground">
                Versuche andere Suchbegriffe oder wähle eine andere Kategorie.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFAQ).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                    <Badge variant="secondary">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                      <AccordionItem key={item.id} value={`item-${item.id}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <Headphones className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Deine Frage ist nicht dabei?
            </h3>
            <p className="text-muted-foreground mb-4">
              Unser Support-Team hilft dir gerne weiter.
            </p>
            <Button asChild>
              <a href="mailto:support@whatsgonow.com">
                Support kontaktieren
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DynamicFAQ;
