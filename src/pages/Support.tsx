
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Headphones, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLaunch } from "@/components/launch/LaunchProvider";
import SuccessConfirmation from "@/components/data-deletion/SuccessConfirmation";

const Support = () => {
  const { trackEvent } = useLaunch();
  const [supportType, setSupportType] = useState("question");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    trackEvent("support_request_submitted", {
      supportType,
    });
    
    console.log("Support request submitted:", {
      supportType,
      name,
      email,
      message,
    });
    
    // In a real implementation, this would send the support request to a database
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

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
          <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
          <p className="text-gray-600 mb-6">
            We're here to help with any questions or issues you may have
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card>
            <CardHeader className="items-center text-center">
              <MessageSquare className="h-8 w-8 text-brand-primary mb-2" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Available 9 AM - 7 PM</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-center text-center">
              <Mail className="h-8 w-8 text-brand-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Response within 24h</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                support@whatsgonow.com
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-center text-center">
              <Headphones className="h-8 w-8 text-brand-primary mb-2" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Mon-Fri: 9 AM - 5 PM</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                +1 (800) 123-4567
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="contact" className="mb-8">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="faq">Common Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>What can we help you with?</Label>
                    <RadioGroup
                      value={supportType}
                      onValueChange={setSupportType}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="question" id="question" />
                        <Label htmlFor="question">General Question</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technical" id="technical" />
                        <Label htmlFor="technical">Technical Issue</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="billing" id="billing" />
                        <Label htmlFor="billing">Billing Issue</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Request
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">How do I track my package?</h3>
                    <p className="text-gray-600 text-sm">
                      You can track your package in the Tracking page using your order ID. Real-time updates will be provided.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-1">What payment methods do you accept?</h3>
                    <p className="text-gray-600 text-sm">
                      We accept all major credit cards, PayPal, and bank transfers for secure payments.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-1">How can I become a transport provider?</h3>
                    <p className="text-gray-600 text-sm">
                      Visit the Offer Transport page to register as a provider. You'll need to verify your identity and set up your profile.
                    </p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button asChild variant="outline">
                    <Link to="/faq">View All FAQs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Support;
