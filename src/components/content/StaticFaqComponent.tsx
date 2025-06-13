
// TEMPORÄR: Standalone FAQ-Komponente ohne globale Contexts
// Diese Komponente wird nach Isolation durch dynamic FAQ ersetzt

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Users, CreditCard, Shield, Headphones, AlertCircle } from 'lucide-react';
import { staticFaqData, getStaticFaqByLanguage, StaticFAQItem } from './StaticFaqData';

// KRITISCH: Komplett isolierte Spracherkennung - KEINE globalen Imports!
const getSimpleLanguage = (): string => {
  // 1. URL-Parameter prüfen
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && ['de', 'en'].includes(urlLang)) {
    return urlLang;
  }

  // 2. URL-Pfad prüfen  
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length > 0 && ['de', 'en'].includes(pathParts[0])) {
    return pathParts[0];
  }

  // 3. localStorage (aber NUR direkt, keine i18next-Abhängigkeit)
  try {
    const stored = localStorage.getItem('whatsgonow-lang') || localStorage.getItem('i18nextLng');
    if (stored && ['de', 'en'].includes(stored)) {
      return stored;
    }
  } catch (err) {
    // Silent fallback
  }

  // 4. Browser-Sprache
  const browserLang = navigator.language.split('-')[0];
  if (['de', 'en'].includes(browserLang)) {
    return browserLang;
  }

  return 'de'; // Default
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'allgemein':
    case 'general': 
      return <HelpCircle className="h-4 w-4" />;
    case 'registrierung & sicherheit':
    case 'registration & security': 
      return <Shield className="h-4 w-4" />;
    case 'aufträge & matching':
    case 'orders & matching': 
      return <Users className="h-4 w-4" />;
    case 'bezahlung & sicherheit':
    case 'payment & security': 
      return <CreditCard className="h-4 w-4" />;
    case 'support & community': 
      return <Headphones className="h-4 w-4" />;
    default: 
      return <HelpCircle className="h-4 w-4" />;
  }
};

export const StaticFaqComponent: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<string>('de');
  const [faqData, setFaqData] = useState<StaticFAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lang = getSimpleLanguage();
    setCurrentLang(lang);
    setFaqData(getStaticFaqByLanguage(lang));
    
    console.log('[StaticFAQ] Initialized with language:', lang);
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
  
  // Filtering logic
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

  if (!mounted) {
    return null;
  }

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
      contactSupport: "Support kontaktieren",
      temporaryNotice: "⚠️ TEMPORÄR: Statische FAQ wegen technischen Updates"
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
      contactSupport: "Contact Support",
      temporaryNotice: "⚠️ TEMPORARY: Static FAQ due to technical updates"
    }
  };

  const t = texts[currentLang as keyof typeof texts] || texts.de;

  return (
    <div className="container max-w-4xl px-4 py-8">
      {/* Temporäre Warnung */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-800 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{t.temporaryNotice}</span>
        </div>
      </div>

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
  );
};

export default StaticFaqComponent;
