
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import type { FeedbackItem } from "@/hooks/use-feedback-admin";

interface FeedbackCardProps {
  item: FeedbackItem;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export const FeedbackCard = ({ item, onUpdateStatus }: FeedbackCardProps) => {
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
          <p className="text-sm text-muted-foreground">
            Kontakt: {item.email}
          </p>
        )}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateStatus(item.id, 'in_progress')}
            disabled={item.status === 'in_progress'}
          >
            In Bearbeitung
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateStatus(item.id, 'resolved')}
            disabled={item.status === 'resolved'}
          >
            Als erledigt markieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
