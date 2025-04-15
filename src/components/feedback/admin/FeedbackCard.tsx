
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { FeedbackItem } from "@/hooks/use-feedback-admin";

interface FeedbackCardProps {
  item: FeedbackItem;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onAddResponse: (id: string, content: string) => Promise<boolean>;
}

export const FeedbackCard = ({ item, onUpdateStatus, onAddResponse }: FeedbackCardProps) => {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    const success = await onAddResponse(item.id, response);
    if (success) {
      setResponse("");
    }
    setIsSubmitting(false);
  };

  return (
    <Card key={item.id} className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {item.title}
              {item.satisfaction_rating && (
                <Badge variant="outline">
                  {item.satisfaction_rating}/5
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">
                {item.feedback_type}
              </Badge>
              <StatusBadge status={item.status} />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(item.created_at).toLocaleDateString('de-DE')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{item.content}</p>
        {item.email && (
          <p className="text-sm text-muted-foreground mb-4">
            Kontakt: {item.email}
          </p>
        )}

        {item.responses && item.responses.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Antworten:</h4>
            {item.responses.map((response) => (
              <div key={response.id} className="bg-secondary/20 rounded-lg p-3">
                <p>{response.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(response.created_at).toLocaleString('de-DE')}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-4">
          <Textarea
            placeholder="Antwort verfassen..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdateStatus(item.id, 'in_progress')}
              disabled={item.status === 'in_progress' || isSubmitting}
            >
              In Bearbeitung
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdateStatus(item.id, 'resolved')}
              disabled={item.status === 'resolved' || isSubmitting}
            >
              Als erledigt markieren
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={handleSubmitResponse}
              disabled={!response.trim() || isSubmitting}
            >
              Antwort senden
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
