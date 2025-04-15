
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFeedback } from "@/hooks/use-feedback";
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
  const { user } = useAuth();
  const { submitFeedback, loading } = useFeedback();
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [satisfaction, setSatisfaction] = useState("3");
  const [features, setFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFeedbackType("suggestion");
    setSatisfaction("3");
    setFeatures([]);
    setFeedbackText("");
    setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Nicht angemeldet",
        description: "Bitte melden Sie sich an, um Feedback zu senden.",
        variant: "destructive"
      });
      return;
    }

    if (!feedbackText.trim()) {
      toast({
        title: "Feedback fehlt",
        description: "Bitte geben Sie Ihr Feedback ein.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitFeedback({
        feedbackType,
        title: "Feedback von " + (user.email || "Benutzer"),
        content: feedbackText,
        satisfaction,
        features,
        email: user.email || email
      });

      if (success) {
        toast({
          title: "Feedback gesendet",
          description: "Vielen Dank für Ihr Feedback!"
        });
        resetForm();
        onSubmit({
          feedbackType,
          satisfaction,
          features,
          feedbackText,
          email: user.email || email
        });
      }
    } catch (error) {
      console.error("Fehler beim Senden des Feedbacks:", error);
      toast({
        title: "Fehler",
        description: "Beim Senden des Feedbacks ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
            onTypeChange={setFeedbackType} 
          />

          <SatisfactionRating 
            satisfaction={satisfaction} 
            onChange={setSatisfaction} 
          />

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
              className={!feedbackText.trim() ? "border-red-500" : ""}
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Geben Sie Ihre E-Mail an, wenn Sie eine Antwort wünschen
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Feedback senden
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
