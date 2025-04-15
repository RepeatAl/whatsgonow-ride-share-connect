
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import FaqSearch from "@/components/faq/FaqSearch";
import FaqCategory from "@/components/faq/FaqCategory";
import FaqContactSupport from "@/components/faq/FaqContactSupport";
import { faqItems } from "@/components/faq/faqData";
import { FAQItem } from "@/types/faq";

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
          
          <FaqSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {Object.keys(groupedFAQs).length > 0 ? (
          Object.entries(groupedFAQs).map(([category, items]) => (
            <FaqCategory key={category} category={category} items={items} />
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

        <FaqContactSupport />
      </div>
    </Layout>
  );
};

export default Faq;
