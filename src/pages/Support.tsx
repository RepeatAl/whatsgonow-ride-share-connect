
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactMethods } from "@/components/support/ContactMethods";
import { ContactForm } from "@/components/support/ContactForm";
import { FaqSection } from "@/components/support/FaqSection";
import SuccessConfirmation from "@/components/data-deletion/SuccessConfirmation";

const Support = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container max-w-2xl px-4 py-8">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Request Received</h1>
            <p className="text-gray-600 mb-4">
              We've received your support request and will be in touch soon.
            </p>
          </div>
          <SuccessConfirmation 
            title="Support Request Submitted" 
            message="Thank you for reaching out. Our support team will respond to your inquiry within 24 hours during business days." 
          />
        </div>
      </Layout>
    );
  }

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
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-8 w-8 text-brand-primary" />
            <h1 className="text-3xl font-bold">Customer Support</h1>
          </div>
          <p className="text-gray-600 mb-6">
            We're here to help with any questions or issues you may have
          </p>
        </div>

        <ContactMethods />

        <Tabs defaultValue="contact" className="mb-8">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="faq">Common Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="mt-6">
            <ContactForm onSubmit={() => setIsSubmitted(true)} />
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <FaqSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Support;
