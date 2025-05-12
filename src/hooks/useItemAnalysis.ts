
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AnalysisRequest {
  item_id: string;
  photo_url: string;
}

interface AnalysisResult {
  analysis_id: string;
  results: {
    labels: Record<string, number>;
    brandGuess: string | null;
    categoryGuess: string | null;
    confidenceScores: Record<string, number>;
  };
}

export function useItemAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeItemPhoto = async (data: AnalysisRequest) => {
    try {
      setIsAnalyzing(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("Du musst angemeldet sein, um diese Funktion zu nutzen");
        return null;
      }
      
      const response = await supabase.functions.invoke("analyze-item-photo", {
        body: data
      });
      
      if (response.error) {
        console.error("Fehler bei der Bildanalyse:", response.error);
        toast.error("Die Bildanalyse ist fehlgeschlagen");
        return null;
      }
      
      const result = response.data as AnalysisResult;
      setAnalysisResult(result);
      
      toast.success("Bildanalyse erfolgreich abgeschlossen");
      return result;
    } catch (error) {
      console.error("Fehler bei der Bildanalyse:", error);
      toast.error("Die Bildanalyse konnte nicht durchgeführt werden");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeItemPhoto,
    isAnalyzing,
    analysisResult
  };
}
