import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const FeedbackForm = ({ onSubmit }: { onSubmit?: (data: any) => void }) => {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "bug" | "compliment" | "question">("suggestion");
  const [satisfaction, setSatisfaction] = useState("3");
  const [features, setFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFeedbackType("suggestion");
    setSatisfaction("3");
    setFeatures([]);
    setFeedbackText("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sicherheitscheck: Nutzer eingeloggt?
    if (!user || !user.id) {
      toast.error("Bitte zuerst einloggen.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        feedback_type: feedbackType,
        title: `Feedback von ${user.email || 'Benutzer'}`,
        content: feedbackText,
        satisfaction_rating: parseInt(satisfaction),
        features: features,
        email: user.email,
      });

      if (error) {
        console.error(error);
        toast.error("Das Feedback konnte nicht gesendet werden.");
      } else {
        toast.success("Vielen Dank für dein Feedback!");
        resetForm();
        onSubmit?.({
          feedbackType,
          satisfaction,
          features,
          feedbackText,
        });
      }
    } catch (err) {
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
      console.error(err);
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
          <div className="space-y-2">
            <Label>Welche Art von Feedback haben Sie?</Label>
            <RadioGroup
              value={feedbackType}
              onValueChange={setFeedbackType}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Vorschlag</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug">Fehlerbericht</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compliment" id="compliment" />
                <Label htmlFor="compliment">Kompliment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="question" id="question" />
                <Label htmlFor="question">Frage</Label>
              </div>
            </RadioGroup>
          </div>

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
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Wird gesendet..." : "Feedback absenden"}
            {isSubmitting && <Loader2 className="animate-spin ml-2" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
