
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, Loader2, MessageSquare, Bug, Star, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useFeedback } from "@/hooks/use-feedback";
import FeedbackTypes from "./FeedbackTypes";

export type FeedbackData = {
  feedbackType: "suggestion" | "bug" | "compliment" | "question";
  satisfaction: string;
  features: string[];
  content: string;
  title?: string;
  email?: string;
};

interface FeedbackFormProps {
  onSubmit?: (data: FeedbackData) => void;
}

const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const { user } = useAuth();
  const { submitFeedback, loading } = useFeedback();
  
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "bug" | "compliment" | "question">("suggestion");
  const [satisfaction, setSatisfaction] = useState("3");
  const [features, setFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");

  const resetForm = () => {
    setFeedbackType("suggestion");
    setSatisfaction("3");
    setFeatures([]);
    setFeedbackText("");
  };

  // This handler safely converts the string to our union type
  const handleFeedbackTypeChange = (value: string) => {
    if (value === "suggestion" || value === "bug" || value === "compliment" || value === "question") {
      setFeedbackType(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      toast.error("Bitte geben Sie Ihr Feedback ein.");
      return;
    }

    const feedbackData: FeedbackData = {
      feedbackType,
      satisfaction,
      features,
      content: feedbackText,
      title: `Feedback von ${user?.email || 'Benutzer'}`,
      email: user?.email
    };

    try {
      const success = await submitFeedback(feedbackData);
      
      if (success) {
        resetForm();
        onSubmit?.(feedbackData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFeedbackTypeIcon = () => {
    switch (feedbackType) {
      case "suggestion": return <MessageSquare className="h-5 w-5" />;
      case "bug": return <Bug className="h-5 w-5" />;
      case "compliment": return <Star className="h-5 w-5" />;
      case "question": return <HelpCircle className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Feedback-Formular</CardTitle>
          <CardDescription>
            Ihr Feedback hilft uns, die Plattform zu verbessern
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeedbackTypes 
            selectedType={feedbackType} 
            onTypeChange={handleFeedbackTypeChange} 
          />

          <div className="space-y-2">
            <Label>Wie zufrieden sind Sie?</Label>
            <RadioGroup
              value={satisfaction}
              onValueChange={setSatisfaction}
              className="flex flex-col space-y-1"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(value)} id={`satisfaction-${value}`} />
                  <Label htmlFor={`satisfaction-${value}`}>{value} Sterne</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Welche Features haben Sie genutzt?</Label>
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="flex flex-wrap gap-2"
              value={features}
              onValueChange={setFeatures}
            >
              <ToggleGroupItem value="find-transport">Transport finden</ToggleGroupItem>
              <ToggleGroupItem value="offer-transport">Transport anbieten</ToggleGroupItem>
              <ToggleGroupItem value="messaging">Messaging</ToggleGroupItem>
              <ToggleGroupItem value="tracking">Tracking</ToggleGroupItem>
              <ToggleGroupItem value="payments">Zahlungen</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Ihr Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Teilen Sie uns Ihre Gedanken, Ideen oder Probleme mit..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                Wird gesendet...
                <Loader2 className="animate-spin ml-2" />
              </>
            ) : (
              <>
                Feedback absenden
                <Send className="ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
