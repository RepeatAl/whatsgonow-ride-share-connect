
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqItems: FAQItem[] = [
    {
      category: "Allgemein",
      question: "Was ist Whatsgonow?",
      answer: "Whatsgonow ist eine Crowd-Logistikplattform, die spontane oder geplante Lieferungen durch Privatpersonen oder lokale Fahrer ermöglicht. Die Plattform vermittelt Aufträge, ermöglicht Preisverhandlungen und bietet ein sicheres Zahlungs- und Bewertungssystem."
    },
    {
      category: "Registrierung & Sicherheit",
      question: "Ist eine Registrierung notwendig?",
      answer: "Ja, sowohl Fahrer als auch Auftraggeber müssen sich registrieren. Für Fahrer ist zudem eine Verifizierung (KYC) erforderlich."
    },
    {
      category: "Aufträge & Matching",
      question: "Wie finde ich passende Transportaufträge?",
      answer: "Als Fahrer erhältst du Vorschläge basierend auf deiner Route, deinem Umkreis und deinem Transportprofil."
    },
    {
      category: "Bezahlung & Sicherheit",
      question: "Wie funktioniert die Bezahlung?",
      answer: "Die Zahlung wird bei Deal-Bestätigung vorgemerkt (z. B. via PayPal) und nach erfolgreicher Lieferung freigegeben."
    },
    {
      category: "Support & Community",
      question: "Was mache ich bei Problemen?",
      answer: "Nutze den Support-Button oder melde einen Vorfall im Deal-Chat. Community Manager unterstützen dich in deiner Region."
    }
  ];

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group FAQs by category
  const groupedFAQs: Record<string, FAQItem[]> = {};
  filteredFAQs.forEach((item) => {
    if (!groupedFAQs[item.category]) {
      groupedFAQs[item.category] = [];
    }
    groupedFAQs[item.category].push(item);
  });

  return (
    <Layout>
      <div className="container max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-8 w-8 text-brand-primary" />
            <h1 className="text-3xl font-bold">Häufig gestellte Fragen</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Hier findest du Antworten auf die häufigsten Fragen zu unserer Plattform
          </p>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="search"
              placeholder="Suche in den FAQs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {Object.keys(groupedFAQs).length > 0 ? (
          Object.entries(groupedFAQs).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-brand-primary">{category}</h2>
              <Accordion type="single" collapsible className="mb-4">
                {items.map((item, index) => (
                  <AccordionItem key={index} value={`item-${category}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              Keine Ergebnisse gefunden für "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Suche zurücksetzen
            </Button>
          </div>
        )}

        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Noch Fragen?</h2>
          <p className="text-muted-foreground mb-6">
            Falls du keine Antwort auf deine Frage gefunden hast, kontaktiere unseren Support.
          </p>
          <Button asChild>
            <Link to="/support">Support kontaktieren</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
