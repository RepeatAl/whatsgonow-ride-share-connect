
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useFeedback } from "@/hooks/use-feedback";

export const ContactForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { submitFeedback, loading, error } = useFeedback();
  const [supportType, setSupportType] = useState<'question' | 'bug' | 'suggestion' | 'compliment'>('question');
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    const success = await submitFeedback({
      feedbackType: supportType,
      title,
      content: message,
      email
    });

    if (success) {
      onSubmit();
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Kontaktieren Sie uns</CardTitle>
          <CardDescription>
            Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Wie können wir Ihnen helfen?</Label>
            <RadioGroup
              value={supportType}
              onValueChange={(value: 'question' | 'bug' | 'suggestion' | 'compliment') => setSupportType(value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="question" id="question" />
                <Label htmlFor="question">Allgemeine Frage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug">Technisches Problem</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Verbesserungsvorschlag</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compliment" id="compliment" />
                <Label htmlFor="compliment">Lob & Feedback</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Betreff</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Ihre Nachricht</Label>
            <Textarea
              id="message"
              placeholder="Wie können wir Ihnen helfen?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Geben Sie Ihre E-Mail an, wenn Sie eine Antwort wünschen
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              "Anfrage senden"
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};
