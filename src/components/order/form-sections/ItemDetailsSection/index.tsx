
import React, { useState, useCallback } from "react";
import { ItemDetailsSectionProps } from "./types";
import { ItemDetailsForm } from "./ItemDetailsForm";
import { ItemSuggestionBox } from "./ItemSuggestionBox";
import { MultiItemSuggestionBox } from "./MultiItemSuggestionBox";
import { ItemList } from "./ItemList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useItemAnalysis, Suggestion } from "@/hooks/useItemAnalysis";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { BulkUploadProvider } from "@/contexts/BulkUploadContext";
import { ImageUploadSection } from "../ImageUploadSection";

export function ItemDetailsSection({ 
  form, 
  insuranceEnabled, 
  orderId, 
  items = [],
  onAddItem,
  onRemoveItem
}: ItemDetailsSectionProps) {
  const { user } = useAuth();
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>("basic-info");
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  
  // Neue Zustandsvariablen für Artikelvorschläge
  const [multiSuggestions, setMultiSuggestions] = useState<Record<string, Suggestion>>({});
  
  const { 
    analyzeItemPhoto, 
    createSuggestionFromAnalysis, 
    applySuggestionToForm, 
    ignoreSuggestion,
    createSuggestionsFromMultiAnalysis 
  } = useItemAnalysis();
  
  // Wenn der Benutzer eingeloggt ist und eine Sender-Rolle hat, zeigen wir den erweiterten Upload an
  const isUser = !!user;

  // Handler für Bild-Upload vom ItemPhotoSection Component
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Generieren einer temporären URL für die Vorschau
    const preview = URL.createObjectURL(file);
    setTempImage(preview);
    setTempImageFile(file);
    setSuggestion(null);
  }, []);

  // Handler für manuelle Bildanalyse
  const handleRequestAnalysis = useCallback(async () => {
    if (!tempImage || !tempImageFile) {
      toast.error("Kein Bild zum Analysieren vorhanden");
      return;
    }
    
    try {
      setAnalysisInProgress(true);
      
      // Hochladen des Bildes zu Storage für Analyse
      const tempId = crypto.randomUUID();
      const filePath = `temp/${tempId}-${tempImageFile.name}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('order-images')
        .upload(filePath, tempImageFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('order-images')
        .getPublicUrl(filePath);
      
      // API-Aufruf zur Analyse
      const result = await analyzeItemPhoto({
        item_id: tempId,
        photo_url: urlData.publicUrl
      });
      
      if (result) {
        const newSuggestion = createSuggestionFromAnalysis(result);
        if (newSuggestion) {
          setSuggestion(newSuggestion);
        }
      }
    } catch (err) {
      console.error("Analyse-Fehler:", err);
      toast.error("Fehler bei der Bildanalyse");
    } finally {
      setAnalysisInProgress(false);
    }
  }, [tempImage, tempImageFile, analyzeItemPhoto, createSuggestionFromAnalysis]);

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      applySuggestionToForm(suggestion, form);
      setSuggestion(null);
    }
  };

  const handleIgnoreSuggestion = () => {
    ignoreSuggestion();
    setSuggestion(null);
  };
  
  // Neue Handler für Mehrfachanalyse
  const handleAcceptMultiSuggestion = (imageUrl: string) => {
    const suggestion = multiSuggestions[imageUrl];
    if (suggestion) {
      // Entferne den Vorschlag aus der Liste der offenen Vorschläge
      const newSuggestions = { ...multiSuggestions };
      delete newSuggestions[imageUrl];
      setMultiSuggestions(newSuggestions);
      
      toast.success("Artikel wurde übernommen");
    }
  };
  
  const handleIgnoreMultiSuggestion = (imageUrl: string) => {
    // Entferne den Vorschlag aus der Liste
    const newSuggestions = { ...multiSuggestions };
    delete newSuggestions[imageUrl];
    setMultiSuggestions(newSuggestions);
    
    toast.info("Vorschlag wurde ignoriert");
  };
  
  // Handler für Fotos wurden hochgeladen
  const handlePhotosUploaded = useCallback((urls: string[]) => {
    // Hier könnten wir die Bilder automatisch analysieren
    toast.success(`${urls.length} Bilder wurden hochgeladen`);
  }, []);

  return (
    <BulkUploadProvider>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Artikeldetails</h3>
        
        <Accordion 
          type="single" 
          collapsible
          value={activeAccordion}
          onValueChange={setActiveAccordion}
          className="w-full"
        >
          <AccordionItem value="basic-info">
            <AccordionTrigger>Basis-Informationen</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                <ItemDetailsForm form={form} insuranceEnabled={insuranceEnabled} />
                
                {isUser && (
                  <ImageUploadSection 
                    userId={user?.id}
                    orderId={orderId}
                    onPhotosUploaded={handlePhotosUploaded}
                  />
                )}
                
                {suggestion && (
                  <ItemSuggestionBox 
                    suggestion={suggestion}
                    onAccept={handleAcceptSuggestion}
                    onIgnore={handleIgnoreSuggestion}
                    form={form}
                  />
                )}
                
                {Object.keys(multiSuggestions).length > 0 && (
                  <MultiItemSuggestionBox
                    suggestions={multiSuggestions}
                    onAccept={handleAcceptMultiSuggestion}
                    onIgnore={handleIgnoreMultiSuggestion}
                    form={form}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Liste der bereits hinzugefügten Artikel */}
        {items.length > 0 && (
          <div className="mt-6">
            <ItemList items={items} onRemoveItem={onRemoveItem || (() => {})} />
          </div>
        )}
      </div>
    </BulkUploadProvider>
  );
}

// Exportiere die Subkomponenten für die Wiederverwendung in anderen Bereichen
export { ItemForm } from "./ItemForm";
export { ItemList } from "./ItemList";
export { ItemPreviewCard } from "./ItemPreviewCard";
export { ItemDetailsForm } from "./ItemDetailsForm";
export { ItemPhotoSection } from "./ItemPhotoSection";
export { ItemSuggestionBox } from "./ItemSuggestionBox";
export type { ItemDetails, ItemDetailsSectionProps } from "./types";
