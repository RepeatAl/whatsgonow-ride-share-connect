
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLaunch } from "@/components/launch/LaunchProvider";
import SuccessConfirmation from "@/components/data-deletion/SuccessConfirmation";

const Feedback = () => {
  const { isLaunchReady, isTestRegion, trackEvent } = useLaunch();
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [satisfaction, setSatisfaction] = useState("3");
  const [features, setFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Only show if launched or in test region
  if (!isLaunchReady && !isTestRegion) {
    return (
      <Layout>
        <div className="container max-w-lg px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Feature Not Available</h1>
          <p>This feature is not yet available in your region.</p>
          <Button asChild className="mt-4">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    trackEvent("feedback_submitted", {
      feedbackType,
      satisfaction,
      features,
    });
    
    console.log("Feedback submitted:", {
      feedbackType,
      satisfaction,
      features,
      feedbackText,
      email,
    });
    
    // In a real implementation, this would send the feedback to a database
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
            <h1 className="text-3xl font-bold mb-2">Feedback Submitted</h1>
            <p className="text-gray-600 mb-4">
              Thank you for helping us improve Whatsgonow!
            </p>
          </div>
          <SuccessConfirmation />
        </div>
      </Layout>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
          <p className="text-gray-600 mb-4">
            Help us improve Whatsgonow by sharing your experience
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
              <CardDescription>
                Your feedback helps us build a better platform for everyone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>What type of feedback do you have?</Label>
                <RadioGroup
                  value={feedbackType}
                  onValueChange={setFeedbackType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suggestion" id="suggestion" />
                    <Label htmlFor="suggestion">Suggestion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug">Bug Report</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compliment" id="compliment" />
                    <Label htmlFor="compliment">Compliment</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>How satisfied are you with Whatsgonow?</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSatisfaction(rating.toString())}
                      className="flex items-center justify-center"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          parseInt(satisfaction) >= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Which features have you used?</Label>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  className="flex flex-wrap gap-2"
                  value={features}
                  onValueChange={setFeatures}
                >
                  <ToggleGroupItem value="find-transport">Find Transport</ToggleGroupItem>
                  <ToggleGroupItem value="offer-transport">Offer Transport</ToggleGroupItem>
                  <ToggleGroupItem value="messaging">Messaging</ToggleGroupItem>
                  <ToggleGroupItem value="tracking">Tracking</ToggleGroupItem>
                  <ToggleGroupItem value="payments">Payments</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Please share your thoughts, ideas, or report issues..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Provide your email if you'd like us to follow up with you
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Feedback;
