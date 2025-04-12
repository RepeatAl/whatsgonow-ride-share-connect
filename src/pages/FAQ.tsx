
import { useState } from "react";
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqItems: FAQItem[] = [
    {
      question: "How does the package delivery process work?",
      answer: "You can create a delivery request, and travelers heading to your destination can offer to transport your package. Once you accept an offer, you'll arrange a handoff, and the traveler will deliver your package to the recipient.",
      category: "General",
    },
    {
      question: "How much does it cost to send a package?",
      answer: "The cost depends on the size, weight, and destination of your package. Travelers set their own rates, and you can choose the offer that works best for you.",
      category: "Pricing",
    },
    {
      question: "Is my package insured during transportation?",
      answer: "Yes, all packages are covered by our basic insurance policy. You can also purchase additional insurance for high-value items.",
      category: "Insurance",
    },
    {
      question: "How do I track my package?",
      answer: "You can track your package in real-time through our app. The traveler will update the status as they progress, and you'll receive notifications at key milestones.",
      category: "Tracking",
    },
    {
      question: "Can I cancel a delivery request?",
      answer: "Yes, you can cancel a delivery request at any time before a traveler accepts your offer. If a traveler has already accepted, cancellation fees may apply.",
      category: "Cancellation",
    },
    {
      question: "How do I become a transport provider?",
      answer: "Visit the 'Offer Transport' page to sign up as a traveler. You'll need to verify your identity and provide information about your travel plans.",
      category: "Travelers",
    },
    {
      question: "What items are prohibited from being transported?",
      answer: "Prohibited items include but are not limited to: illegal substances, weapons, hazardous materials, and perishable goods without proper packaging. Check our terms for a complete list.",
      category: "Restrictions",
    },
    {
      question: "How do payments work?",
      answer: "Payments are processed through our secure platform. Funds are held in escrow until the package is delivered successfully, ensuring protection for both parties.",
      category: "Payments",
    },
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
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-6">
            Find answers to common questions about our platform
          </p>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {Object.keys(groupedFAQs).length > 0 ? (
          Object.entries(groupedFAQs).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <Accordion type="single" collapsible className="mb-4">
                {items.map((item, index) => (
                  <AccordionItem key={index} value={`item-${category}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No results found for "{searchQuery}"</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        <Separator className="my-8" />

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer you were looking for, our support team is here to help.
          </p>
          <Button asChild>
            <Link to="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
