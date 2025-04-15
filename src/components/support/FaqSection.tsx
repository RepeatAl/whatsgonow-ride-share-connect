
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export const FaqSection = () => {
  return (
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
  );
};
