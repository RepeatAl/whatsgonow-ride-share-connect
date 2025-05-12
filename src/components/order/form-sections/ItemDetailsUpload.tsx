
import React, { useState, useCallback } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "../../ImageUploader";
import { ItemPhotoAnalysis } from "../ItemPhotoAnalysis";
import { AnalysisResultDisplay } from "./components/AnalysisResultDisplay";
import { ItemDetails } from "@/hooks/useItemDetails";
import { useItemAnalysis, Suggestion } from "@/hooks/useItemAnalysis";
import { ItemAutoSuggestDisplay } from "./ItemDetailsSection/ItemAutoSuggestDisplay";

// Schema für das Formular
const itemDetailsSchema = z.object({
  title: z.string().min(2, "Titel muss mindestens 2 Zeichen lang sein"),
  description: z.string().optional(),
});

type ItemDetailsFormValues = z.infer<typeof itemDetailsSchema>;

interface ItemDetailsUploadProps {
  onSaveItem: (item: ItemDetails) => void;
  orderId?: string;
}

export const ItemDetailsUpload = ({ onSaveItem, orderId }: ItemDetailsUploadProps) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { 
    userFeedback, 
    setUserFeedback, 
    applySuggestionToForm, 
    ignoreSuggestion, 
    createSuggestionFromAnalysis 
  } = useItemAnalysis();
  
  const form = useForm<ItemDetailsFormValues>({
    resolver: zodResolver(itemDetailsSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleUploadComplete = useCallback((url: string) => {
    setUploadedImageUrl(url);
    // Reset user feedback when new image is uploaded
    setUserFeedback(null);
  }, [setUserFeedback]);

  const handleAnalysisComplete = useCallback((results: any) => {
    console.log("Analysis results:", results);
    setAnalysisResults(results);
    setUserFeedback(null); // Reset feedback state on new analysis
  }, [setUserFeedback]);

  const handleAcceptSuggestion = useCallback(() => {
    if (!analysisResults) return;
    
    const suggestion: Suggestion = {
      title: analysisResults.results?.categoryGuess,
      category: analysisResults.results?.categoryGuess,
      brand: analysisResults.results?.brandGuess,
      confidence: {
        category: analysisResults.results?.confidenceScores?.category,
        brand: analysisResults.results?.confidenceScores?.brand,
        overall: analysisResults.results?.confidenceScores?.overall
      }
    };
    
    applySuggestionToForm(suggestion, form);
  }, [analysisResults, applySuggestionToForm, form]);

  const onSubmit = (data: ItemDetailsFormValues) => {
    const newItem: ItemDetails = {
      title: data.title,
      description: data.description,
      image_url: uploadedImageUrl,
      category_suggestion: analysisResults?.results?.categoryGuess,
      labels_raw: analysisResults?.results?.labels,
      analysis_status: analysisResults ? 'success' : undefined,
    };
    
    onSaveItem(newItem);
    
    // Formular zurücksetzen
    form.reset();
    setUploadedImageUrl("");
    setAnalysisResults(null);
    setUserFeedback(null);
  };

  // Generiere eine temporäre ID für die Analyse
  const tempItemId = orderId ? `temp-${orderId}-${Date.now()}` : `temp-${Date.now()}`;

  // Erstelle Vorschlagsobjekt aus Analyseergebnissen
  const suggestion = analysisResults ? {
    title: analysisResults.results?.categoryGuess,
    category: analysisResults.results?.categoryGuess,
    brand: analysisResults.results?.brandGuess,
    confidence: {
      category: analysisResults.results?.confidenceScores?.category,
      brand: analysisResults.results?.confidenceScores?.brand,
      overall: analysisResults.results?.confidenceScores?.overall
    }
  } : null;

  const showSuggestions = analysisResults?.results && 
                         analysisResults.results.categoryGuess && 
                         analysisResults.results.labels;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artikelname*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Sofa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Beschreibung (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detaillierte Beschreibung des Artikels..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showSuggestions && suggestion && (
              <div className="mt-4">
                <ItemAutoSuggestDisplay
                  suggestion={suggestion}
                  onAccept={handleAcceptSuggestion}
                  onIgnore={ignoreSuggestion}
                  userFeedback={userFeedback}
                />
              </div>
            )}

            {analysisResults && (
              <div className="mt-4">
                <AnalysisResultDisplay 
                  labels={analysisResults.results.labels}
                  categoryGuess={analysisResults.results.categoryGuess}
                  brandGuess={analysisResults.results.brandGuess}
                  confidenceScores={analysisResults.results.confidenceScores}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <ImageUploader onUploadComplete={handleUploadComplete} />
              </CardContent>
            </Card>
            
            {uploadedImageUrl && (
              <ItemPhotoAnalysis 
                itemId={tempItemId}
                photoUrl={uploadedImageUrl}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">
            Artikel hinzufügen
          </Button>
        </div>
      </form>
    </Form>
  );
};
