
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

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

export interface Suggestion {
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

export function useItemAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [userFeedback, setUserFeedback] = useState<"accepted" | "rejected" | null>(null);

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

  // Neue Funktion um Vorschläge auf das Formular anzuwenden
  // Die generische Typisierung erlaubt uns, mit verschiedenen Formularstrukturen zu arbeiten
  const applySuggestionToForm = <T extends Record<string, any>>(
    suggestion: Suggestion, 
    form: UseFormReturn<T>
  ) => {
    if (!suggestion) return;

    if (suggestion.title) {
      // Fix: Beide Parameter werden als any typisiert
      form.setValue('title' as any, suggestion.title as any, {
        shouldDirty: true,
        shouldTouch: true
      });
    }

    if (suggestion.category) {
      // Fix: Beide Parameter werden als any typisiert
      form.setValue('category' as any, suggestion.category as any, {
        shouldDirty: true,
        shouldTouch: true
      });
    }

    // Weitere Felder könnten hier ebenfalls befüllt werden

    setUserFeedback("accepted");
    toast.success("Vorschläge wurden übernommen");
  };

  // Funktion zum Ignorieren der Vorschläge
  const ignoreSuggestion = () => {
    setUserFeedback("rejected");
    toast.info("Vorschläge wurden ignoriert");
  };

  // Funktion um ein Suggestion-Objekt aus dem Analyseergebnis zu erstellen
  const createSuggestionFromAnalysis = (analysis: AnalysisResult | null): Suggestion | null => {
    if (!analysis) return null;

    return {
      title: analysis.results.categoryGuess,
      category: analysis.results.categoryGuess,
      brand: analysis.results.brandGuess,
      confidence: {
        category: analysis.results.confidenceScores?.category,
        brand: analysis.results.confidenceScores?.brand,
        overall: analysis.results.confidenceScores?.overall
      }
    };
  };

  return {
    analyzeItemPhoto,
    isAnalyzing,
    analysisResult,
    applySuggestionToForm,
    ignoreSuggestion,
    createSuggestionFromAnalysis,
    userFeedback,
    setUserFeedback
  };
}
