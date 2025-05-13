
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader } from "lucide-react";
import { ItemAnalysisCardProps } from "./types";
import { ImageAssignButton } from "./ImageAssignButton";
import { useBulkUpload } from "@/contexts/BulkUploadContext";

export function ItemAnalysisCard({
  imageUrl,
  suggestion,
  index,
  onAccept,
  onIgnore,
  showAssignOptions = false
}: ItemAnalysisCardProps) {
  // Bestimme den Status der Analyse
  const status = suggestion?.analysis_status || 'pending';
  const { imageToArticleMap } = useBulkUpload();
  
  // Check if this image is already assigned to an article
  const isAssigned = imageToArticleMap && imageUrl in imageToArticleMap;
  
  // Extrahiere die wichtigsten Informationen aus dem Vorschlag
  const title = suggestion?.title || 'Unbekannter Artikel';
  const category = suggestion?.category || 'Keine Kategorie';
  const confidence = suggestion?.confidence?.overall
    ? `${Math.round(suggestion.confidence.overall * 100)}%`
    : null;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative p-2 h-32 flex items-center justify-center bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-gray-400">Kein Bild</div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {status === 'pending' && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
              <Loader className="h-3 w-3 animate-spin" />
              Analyse läuft
            </Badge>
          )}
          {status === 'success' && (
            <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Analysiert
            </Badge>
          )}
          {status === 'failed' && (
            <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
              <X className="h-3 w-3" />
              Fehler
            </Badge>
          )}
          {isAssigned && (
            <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
              Zugewiesen
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-medium truncate text-sm">{title}</h3>
        <p className="text-xs text-gray-600">{category}</p>
        {confidence && (
          <p className="text-xs text-gray-500 mt-1">Übereinstimmung: {confidence}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 gap-2 justify-between">
        {!showAssignOptions ? (
          <>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={() => onIgnore(index)}
              disabled={status !== 'success'}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Ignorieren
            </Button>
            <Button 
              type="button"
              size="sm"
              onClick={() => onAccept(index)}
              disabled={status !== 'success'}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Übernehmen
            </Button>
          </>
        ) : (
          <ImageAssignButton imageUrl={imageUrl} />
        )}
      </CardFooter>
    </Card>
  );
}
