
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Lightbulb, Tag, ShoppingBag } from "lucide-react";

interface Suggestion {
  title?: string;
  category?: string;
  brand?: string;
  confidence?: {
    title?: number;
    category?: number;
    brand?: number;
    overall?: number;
  };
}

interface ItemAutoSuggestDisplayProps {
  suggestion: Suggestion;
  onAccept: () => void;
  onIgnore: () => void;
  userFeedback: "accepted" | "rejected" | null;
}

export function ItemAutoSuggestDisplay({
  suggestion,
  onAccept,
  onIgnore,
  userFeedback
}: ItemAutoSuggestDisplayProps) {
  if (!suggestion || (!suggestion.title && !suggestion.category && !suggestion.brand)) {
    return null;
  }

  const formatConfidence = (value?: number) => {
    if (value === undefined) return null;
    return `${Math.round(value * 100)}%`;
  };

  return (
    <Card className={`border-l-4 ${userFeedback === "accepted" ? "border-l-green-500" : userFeedback === "rejected" ? "border-l-gray-300" : "border-l-blue-500"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          KI-Vorschlag für diesen Artikel
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          {suggestion.title && (
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 mt-1 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Vorgeschlagener Titel</p>
                <p className="text-base">{suggestion.title}</p>
                {suggestion.confidence?.title && (
                  <p className="text-xs text-muted-foreground">
                    Sicherheit: {formatConfidence(suggestion.confidence.title)}
                  </p>
                )}
              </div>
            </div>
          )}

          {suggestion.category && (
            <div className="flex items-start gap-2">
              <ShoppingBag className="h-4 w-4 mt-1 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Vorgeschlagene Kategorie</p>
                <Badge variant="outline" className="mt-1 bg-purple-50">{suggestion.category}</Badge>
                {suggestion.confidence?.category && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Sicherheit: {formatConfidence(suggestion.confidence.category)}
                  </p>
                )}
              </div>
            </div>
          )}

          {suggestion.brand && (
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 mt-1 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Vorgeschlagene Marke</p>
                <Badge variant="outline" className="mt-1 bg-green-50">{suggestion.brand}</Badge>
                {suggestion.confidence?.brand && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Sicherheit: {formatConfidence(suggestion.confidence.brand)}
                  </p>
                )}
              </div>
            </div>
          )}

          {suggestion.confidence?.overall && (
            <p className="text-xs text-muted-foreground">
              Gesamtsicherheit: {formatConfidence(suggestion.confidence.overall)}
            </p>
          )}
        </div>
      </CardContent>
      {userFeedback === null && (
        <CardFooter className="flex justify-between gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onIgnore}
          >
            <X className="mr-2 h-4 w-4" />
            Ignorieren
          </Button>
          <Button
            size="sm"
            className="w-full"
            onClick={onAccept}
          >
            <Check className="mr-2 h-4 w-4" />
            Übernehmen
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
