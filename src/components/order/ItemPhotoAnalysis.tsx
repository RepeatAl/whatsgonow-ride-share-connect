
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Image, Check, AlertCircle } from "lucide-react";
import { useItemAnalysis } from "@/hooks/useItemAnalysis";

interface ItemPhotoAnalysisProps {
  itemId: string;
  photoUrl?: string;
  onAnalysisComplete?: (result: any) => void;
}

export function ItemPhotoAnalysis({ itemId, photoUrl, onAnalysisComplete }: ItemPhotoAnalysisProps) {
  const { analyzeItemPhoto, isAnalyzing } = useItemAnalysis();
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!photoUrl) {
      setError("Kein Foto zum Analysieren vorhanden");
      return;
    }
    
    try {
      setError(null);
      const result = await analyzeItemPhoto({
        item_id: itemId,
        photo_url: photoUrl
      });
      
      if (result) {
        setAnalysisComplete(true);
        if (onAnalysisComplete) {
          onAnalysisComplete(result);
        }
      }
    } catch (err) {
      setError("Fehler bei der Analyse");
      console.error("Analyse-Fehler:", err);
    }
  };

  if (!photoUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bildanalyse</CardTitle>
          <CardDescription>Lade ein Foto hoch, um KI-Analyse zu nutzen</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Zuerst ein Foto hochladen</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bildanalyse</span>
          {analysisComplete && <Badge variant="secondary">Analysiert</Badge>}
        </CardTitle>
        <CardDescription>
          KI-gestützte Erkennung von Kategorie & Eigenschaften
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-md overflow-hidden border">
            {photoUrl && <img src={photoUrl} alt="Item" className="h-full w-full object-cover" />}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              Die KI kann Kategorien, Marken und Eigenschaften von Artikeln erkennen.
            </p>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || analysisComplete || !photoUrl}
          className="w-full"
          variant={analysisComplete ? "outline" : "default"}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse läuft...
            </>
          ) : analysisComplete ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Analyse abgeschlossen
            </>
          ) : (
            "Bild analysieren"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
