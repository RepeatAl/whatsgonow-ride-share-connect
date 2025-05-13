
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemPhotoAnalysisGrid } from "./ItemPhotoAnalysisGrid";
import { MultiItemSuggestionBoxProps } from "./types";

export function MultiItemSuggestionBox({
  suggestions,
  onAccept,
  onIgnore,
  form
}: MultiItemSuggestionBoxProps) {
  if (!suggestions || Object.keys(suggestions).length === 0) {
    return null;
  }

  // Bereite die Daten für das Grid vor
  const analyzedImages = Object.entries(suggestions).map(([imageUrl, suggestion]) => ({
    fileUrl: imageUrl,
    suggestion
  }));

  return (
    <Card className="mt-4 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>KI-Vorschläge für {analyzedImages.length} Artikel</span>
          <Badge variant="outline" className="bg-blue-50">KI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ItemPhotoAnalysisGrid 
          analyzedImages={analyzedImages}
          onAcceptImage={(index) => {
            const item = analyzedImages[index];
            if (item && item.fileUrl) {
              onAccept(item.fileUrl);
            }
          }}
          onIgnoreImage={(index) => {
            const item = analyzedImages[index];
            if (item && item.fileUrl) {
              onIgnore(item.fileUrl);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
