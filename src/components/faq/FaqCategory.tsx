
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQItem } from "@/types/faq";
import { useTranslation } from "react-i18next";

interface FaqCategoryProps {
  category: string;
  items: FAQItem[];
}

const FaqCategory = ({ category, items }: FaqCategoryProps) => {
  const { t } = useTranslation('faq');
  
  // Map category to translation key if available
  const getCategoryTranslation = (category: string) => {
    const categoryKeys: Record<string, string> = {
      "Allgemein": "categories.general",
      "Registrierung & Sicherheit": "categories.registration",
      "Aufträge & Matching": "categories.orders",
      "Bezahlung & Sicherheit": "categories.payment",
      "Support & Community": "categories.support"
    };
    
    return categoryKeys[category] ? t(categoryKeys[category]) : category;
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-brand-primary">
        {getCategoryTranslation(category)}
      </h2>
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
  );
};

export default FaqCategory;
