import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tag, Lightbulb } from "lucide-react";

interface AnalysisResultDisplayProps {
  labels?: Record<string, number>;
  categoryGuess?: string | null;
  brandGuess?: string | null;
  confidenceScores?: Record<string, number>;
}

export function AnalysisResultDisplay({
  labels,
  categoryGuess,
  brandGuess,
  confidenceScores
}: AnalysisResultDisplayProps) {
  if (!labels && !categoryGuess && !brandGuess) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          KI-Analyse Ergebnisse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryGuess && (
          <div>
            <h4 className="text-sm font-medium mb-1">Erkannte Kategorie:</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">{categoryGuess}</Badge>
              {confidenceScores?.category && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(confidenceScores.category * 100)}% Sicherheit
                </span>
              )}
            </div>
          </div>
        )}

        {brandGuess && (
          <div>
            <h4 className="text-sm font-medium mb-1">Erkannte Marke:</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50">{brandGuess}</Badge>
              {confidenceScores?.brand && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(confidenceScores.brand * 100)}% Sicherheit
                </span>
              )}
            </div>
          </div>
        )}

        {labels && Object.keys(labels).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Erkannte Eigenschaften:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(labels).map(([label, confidence]) => (
                <div key={label} className="flex flex-col">
                  <Badge variant="secondary" className="mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {label}
                  </Badge>
                  <Progress 
                    value={confidence * 100} 
                    className="h-1 w-20 bg-gray-200" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {confidenceScores?.overall && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Gesamtsicherheit:</span>
              <span className="font-medium">{Math.round(confidenceScores.overall * 100)}%</span>
            </div>
            <Progress 
              value={confidenceScores.overall * 100} 
              className="h-2 mt-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
