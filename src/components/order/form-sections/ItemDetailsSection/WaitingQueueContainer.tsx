
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBulkUpload } from "@/contexts/BulkUploadContext";
import { ItemPhotoAnalysisGrid } from "./ItemPhotoAnalysisGrid";

interface WaitingQueueContainerProps {
  suggestions: Record<string, any>;
}

export function WaitingQueueContainer({ suggestions }: WaitingQueueContainerProps) {
  const { queuedImages } = useBulkUpload();
  
  if (queuedImages.length === 0) {
    return null;
  }

  // Filter suggestions to only include queued images
  const queuedSuggestions = Object.keys(suggestions)
    .filter(url => queuedImages.includes(url))
    .reduce((acc, url) => {
      acc[url] = suggestions[url];
      return acc;
    }, {} as Record<string, any>);

  // Prepare the data for the grid
  const analyzedImages = queuedImages.map(fileUrl => ({
    fileUrl,
    suggestion: suggestions[fileUrl]
  }));

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Warteschleife: {queuedImages.length} Bilder</span>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Nicht zugeordnet</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ItemPhotoAnalysisGrid 
          analyzedImages={analyzedImages}
          showAssignOptions={true}
          onAcceptImage={() => {}}
          onIgnoreImage={() => {}}
        />
      </CardContent>
    </Card>
  );
}
