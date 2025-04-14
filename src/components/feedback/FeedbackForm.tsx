
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackTypes from "./FeedbackTypes";
import SatisfactionRating from "./SatisfactionRating";

interface FeedbackFormProps {
  onSubmit: (feedbackData: FeedbackData) => void;
}

export interface FeedbackData {
  feedbackType: string;
  satisfaction: string;
  features: string[];
  feedbackText: string;
  email: string;
}

const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [satisfaction, setSatisfaction] = useState("3");
  const [features, setFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      feedbackType,
      satisfaction,
      features,
      feedbackText,
      email,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Your feedback helps us build a better platform for everyone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeedbackTypes 
            selectedType={feedbackType} 
            onTypeChange={setFeedbackType} 
          />

          <SatisfactionRating 
            satisfaction={satisfaction} 
            onChange={setSatisfaction} 
          />

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
  );
};

export default FeedbackForm;
