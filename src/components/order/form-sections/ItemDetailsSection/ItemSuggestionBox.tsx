
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Suggestion } from "@/hooks/useItemAnalysis";
import { UseFormReturn } from "react-hook-form";

interface ItemSuggestionBoxProps {
  suggestion: Suggestion | null;
  onAccept: () => void;
  onIgnore: () => void;
  form: UseFormReturn<any>;
}

export function ItemSuggestionBox({ 
  suggestion,
  onAccept,
  onIgnore,
  form
}: ItemSuggestionBoxProps) {
  if (!suggestion) return null;

  return (
    <Card className="mt-4 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>KI-Vorschläge für diesen Artikel</span>
          <Badge variant="outline" className="bg-blue-50">KI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {suggestion.title && (
            <div>
              <p className="text-sm font-medium">Artikelname</p>
              <p className="text-sm bg-blue-50 p-1.5 rounded">{suggestion.title}</p>
            </div>
          )}
          {suggestion.category && (
            <div>
              <p className="text-sm font-medium">Kategorie</p>
              <p className="text-sm bg-blue-50 p-1.5 rounded">{suggestion.category}</p>
            </div>
          )}
          {suggestion.confidence?.overall && (
            <div className="text-xs text-gray-500 mt-1">
              Übereinstimmung: {Math.round(suggestion.confidence.overall * 100)}%
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          type="button" 
          variant="outline"
          size="sm"
          onClick={onIgnore}
          className="flex items-center"
        >
          <X className="mr-1 h-4 w-4" />
          Ignorieren
        </Button>
        <Button 
          type="button"
          size="sm"
          onClick={onAccept}
          className="flex items-center"
        >
          <Check className="mr-1 h-4 w-4" />
          Übernehmen
        </Button>
      </CardFooter>
    </Card>
  );
}
