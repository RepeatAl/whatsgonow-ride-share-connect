
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { AnalysisStatus } from "@/components/order/form-sections/ItemDetailsSection/types";

export interface AnalysisRequest {
  item_id: string;
  photo_url: string;
}

export interface ItemAnalysisResult {
  analysis_id?: string;
  results: {
    labels: Record<string, number>;
    brandGuess: string | null;
    categoryGuess: string | null;
    confidenceScores: Record<string, number>;
  };
  analysis_status?: AnalysisStatus;
  photo_url?: string;
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
  analysis_status?: AnalysisStatus;
}

export function useItemAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ItemAnalysisResult | null>(null);
  const [userFeedback, setUserFeedback] = useState<"accepted" | "rejected" | null>(null);
  
  // Neuer Zustand für mehrere Analysen
  const [multiResults, setMultiResults] = useState<Record<string, ItemAnalysisResult>>({});
  const [multiAnalysisProgress, setMultiAnalysisProgress] = useState<number>(0);

  const analyzeItemPhoto = async (data: AnalysisRequest): Promise<ItemAnalysisResult | null> => {
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
      
      const result = response.data as ItemAnalysisResult;
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

  // Neue Funktion für die Analyse mehrerer Bilder
  const analyzeMultipleItems = useCallback(async (imageUrls: string[]): Promise<Record<string, ItemAnalysisResult>> => {
    if (imageUrls.length === 0) return {};
    
    setIsAnalyzing(true);
    const resultMap: Record<string, ItemAnalysisResult> = {};
    
    try {
      // Analysiere jedes Bild einzeln
      let completed = 0;
      
      for (const url of imageUrls) {
        try {
          const tempId = crypto.randomUUID();
          
          const result = await analyzeItemPhoto({
            item_id: tempId,
            photo_url: url
          });
          
          if (result) {
            // Erweitere das Ergebnis um die URL des Bildes
            resultMap[url] = {
              ...result,
              photo_url: url,
              analysis_status: 'success'
            };
          } else {
            resultMap[url] = {
              results: {
                labels: {},
                brandGuess: null,
                categoryGuess: null,
                confidenceScores: {}
              },
              analysis_status: 'failed',
              photo_url: url
            };
          }
        } catch (err) {
          console.error(`Fehler bei der Analyse von Bild ${url}:`, err);
          resultMap[url] = {
            results: {
              labels: {},
              brandGuess: null,
              categoryGuess: null,
              confidenceScores: {}
            },
            analysis_status: 'failed',
            photo_url: url
          };
        }
        
        completed++;
        const progress = Math.round((completed / imageUrls.length) * 100);
        setMultiAnalysisProgress(progress);
      }
      
      setMultiResults(resultMap);
      return resultMap;
    } catch (error) {
      console.error("Fehler bei der Massenanalyse:", error);
      toast.error("Die Bildanalyse konnte nicht durchgeführt werden");
      return resultMap;
    } finally {
      setIsAnalyzing(false);
      setMultiAnalysisProgress(0);
    }
  }, []);

  // Neue Funktion um Vorschläge auf das Formular anzuwenden
  // Die generische Typisierung erlaubt uns, mit verschiedenen Formularstrukturen zu arbeiten
  const applySuggestionToForm = <T extends Record<string, any>>(
    suggestion: Suggestion, 
    form: UseFormReturn<T>
  ) => {
    if (!suggestion) return;

    if (suggestion.title) {
      form.setValue(
        'itemName' as any, // Anpassung auf das tatsächliche Feld "itemName"
        suggestion.title as any, 
        {
          shouldDirty: true,
          shouldTouch: true
        }
      );
    }

    if (suggestion.category) {
      form.setValue(
        'category' as any, 
        suggestion.category as any, 
        {
          shouldDirty: true,
          shouldTouch: true
        }
      );
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
  const createSuggestionFromAnalysis = (analysis: ItemAnalysisResult | null): Suggestion | null => {
    if (!analysis) return null;

    return {
      title: analysis.results.categoryGuess,
      category: analysis.results.categoryGuess,
      brand: analysis.results.brandGuess,
      confidence: {
        category: analysis.results.confidenceScores?.category,
        brand: analysis.results.confidenceScores?.brand,
        overall: analysis.results.confidenceScores?.overall
      },
      analysis_status: 'success'
    };
  };

  // Erstelle eine Map von Suggestions aus mehreren Analysen
  const createSuggestionsFromMultiAnalysis = useCallback((results: Record<string, ItemAnalysisResult>): Record<string, Suggestion> => {
    const suggestions: Record<string, Suggestion> = {};
    
    for (const [url, analysis] of Object.entries(results)) {
      const suggestion = createSuggestionFromAnalysis(analysis);
      if (suggestion) {
        suggestions[url] = suggestion;
      }
    }
    
    return suggestions;
  }, []);

  return {
    analyzeItemPhoto,
    isAnalyzing,
    analysisResult,
    applySuggestionToForm,
    ignoreSuggestion,
    createSuggestionFromAnalysis,
    userFeedback,
    setUserFeedback,
    // Neue Multi-Analyse Funktionen
    analyzeMultipleItems,
    multiResults,
    multiAnalysisProgress,
    createSuggestionsFromMultiAnalysis
  };
}
