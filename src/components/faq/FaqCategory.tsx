
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQItem } from "@/types/faq";

interface FaqCategoryProps {
  category: string;
  items: FAQItem[];
}

const FaqCategory = ({ category, items }: FaqCategoryProps) => {
  return (
    <div className="mb-8">
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
  );
};

export default FaqCategory;
