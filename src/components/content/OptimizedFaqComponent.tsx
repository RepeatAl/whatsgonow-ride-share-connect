
// FINAL VERSION: Optimized standalone FAQ-Komponente - 100% isoliert, production-ready
// NO-GLOBALS-REGEL: Keine globalen Context/Provider-Imports erlaubt

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Users, CreditCard, Shield, Headphones, Home, ArrowLeft } from 'lucide-react';
import { staticFaqData, getStaticFaqByLanguage, StaticFAQItem } from './StaticFaqData';

// KRITISCH: Komplett isolierte Spracherkennung - KEINE globalen Imports!
const getOptimizedLanguage = (): string => {
  // Optimierte Spracherkennung ohne Flimmern
  if (typeof window === 'undefined') return 'de';
  
  // 1. URL-Pfad prüfen (prioritär)
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length > 0 && ['de', 'en'].includes(pathParts[0])) {
    return pathParts[0];
  }

  // 2. URL-Parameter prüfen
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['de', 'en'].includes(urlLang)) {
      return urlLang;
    }
  } catch (e) {
    // Silent fallback
  }

  // 3. localStorage (optimiert)
  try {
    const stored = localStorage.getItem('whatsgonow-lang') || localStorage.getItem('i18nextLng');
    if (stored && ['de', 'en'].includes(stored)) {
      return stored;
    }
  } catch (e) {
    // Silent fallback
  }

  // 4. Browser-Sprache
  try {
    const browserLang = navigator.language.split('-')[0];
    if (['de', 'en'].includes(browserLang)) {
      return browserLang;
    }
  } catch (e) {
    // Silent fallback
  }

  return 'de'; // Stable default
};

// Isolierte Mini-Navigation für FAQ
const IsolatedFAQHeader: React.FC<{ language: string }> = ({ language }) => {
  const texts = {
    de: { home: 'Startseite', back: 'Zurück' },
    en: { home: 'Home', back: 'Back' }
  };
  
  const t = texts[language as keyof typeof texts] || texts.de;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {t.home}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Isolierter Mini-Footer für FAQ
const IsolatedFAQFooter: React.FC<{ language: string }> = ({ language }) => {
  const currentYear = new Date().getFullYear();
  
  const texts = {
    de: { 
      rights: `© ${currentYear} whatsgonow. Alle Rechte vorbehalten.`,
      support: 'Support',
      legal: 'Rechtliches'
    },
    en: { 
      rights: `© ${currentYear} whatsgonow. All rights reserved.`,
      support: 'Support',
      legal: 'Legal'
    }
  };
  
  const t = texts[language as keyof typeof texts] || texts.de;

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-6 mt-12">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">{t.rights}</p>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:support@whatsgonow.com"
              className="text-sm text-primary hover:underline"
            >
              {t.support}
            </a>
            <a 
              href={`/${language}/legal`}
              className="text-sm text-primary hover:underline"
            >
              {t.legal}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  switch (true) {
    case categoryLower.includes('allgemein') || categoryLower.includes('general'): 
      return <HelpCircle className="h-4 w-4" />;
    case categoryLower.includes('registrierung') || categoryLower.includes('registration'): 
      return <Shield className="h-4 w-4" />;
    case categoryLower.includes('aufträge') || categoryLower.includes('order'): 
      return <Users className="h-4 w-4" />;
    case categoryLower.includes('bezahlung') || categoryLower.includes('payment'): 
      return <CreditCard className="h-4 w-4" />;
    case categoryLower.includes('support') || categoryLower.includes('community'): 
      return <Headphones className="h-4 w-4" />;
    default: 
      return <HelpCircle className="h-4 w-4" />;
  }
};

export const OptimizedFaqComponent: React.FC = () => {
  // Optimierte State-Initialisierung ohne Flimmern
  const [currentLang] = useState<string>(() => getOptimizedLanguage());
  const [faqData] = useState<StaticFAQItem[]>(() => getStaticFaqByLanguage(getOptimizedLanguage()));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Optimiertes useEffect ohne mehrfache Re-renders
  useEffect(() => {
    // Simuliere kurze Ladezeit für bessere UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Stabilized category extraction
  const getCategories = (): string[] => {
    try {
      return [...new Set(faqData.map(item => item.category).filter(Boolean))];
    } catch (err) {
      return [];
    }
  };

  const categories = getCategories();
  
  // Optimierte Filterlogik
  const getFilteredFAQ = (): StaticFAQItem[] => {
    try {
      return faqData.filter(item => {
        const matchesSearch = !searchTerm || 
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    } catch (err) {
      return [];
    }
  };

  const filteredFAQ = getFilteredFAQ();

  const groupedFAQ = filteredFAQ.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, StaticFAQItem[]>);

  const texts = {
    de: {
      title: "FAQ - Häufig gestellte Fragen",
      description: "Hier findest du Antworten auf die häufigsten Fragen zu whatsgonow",
      searchPlaceholder: "Suche in FAQ...",
      allCategories: "Alle Kategorien",
      noResults: "Keine Ergebnisse gefunden",
      noResultsDesc: "Versuche andere Suchbegriffe oder wähle eine andere Kategorie.",
      supportTitle: "Deine Frage ist nicht dabei?",
      supportDesc: "Unser Support-Team hilft dir gerne weiter.",
      contactSupport: "Support kontaktieren"
    },
    en: {
      title: "FAQ - Frequently Asked Questions", 
      description: "Find answers to the most common questions about whatsgonow",
      searchPlaceholder: "Search FAQ...",
      allCategories: "All Categories",
      noResults: "No results found",
      noResultsDesc: "Try different search terms or select another category.",
      supportTitle: "Question not found?",
      supportDesc: "Our support team is happy to help.",
      contactSupport: "Contact Support"
    }
  };

  const t = texts[currentLang as keyof typeof texts] || texts.de;

  // Loading state
  if (isLoading) {
    return (
      <>
        <IsolatedFAQHeader language={currentLang} />
        <div className="container max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <IsolatedFAQFooter language={currentLang} />
      </>
    );
  }

  return (
    <>
      <IsolatedFAQHeader language={currentLang} />
      
      <div className="container max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
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
              {t.allCategories}
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
                  {faqData.filter(item => item.category === category).length}
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
              <h3 className="text-lg font-semibold mb-2">{t.noResults}</h3>
              <p className="text-muted-foreground">
                {t.noResultsDesc}
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
                    {items.map((item) => (
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
              {t.supportTitle}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t.supportDesc}
            </p>
            <Button asChild>
              <a href="mailto:support@whatsgonow.com">
                {t.contactSupport}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <IsolatedFAQFooter language={currentLang} />
    </>
  );
};

export default OptimizedFaqComponent;
