
import React, { useState, useCallback } from "react";
import { ItemDetailsSectionProps, ItemDetails } from "./types";
import { ItemDetailsForm } from "./ItemDetailsForm";
import { ItemPhotoSection } from "./ItemPhotoSection";
import { ItemSuggestionBox } from "./ItemSuggestionBox";
import { ItemForm } from "./ItemForm";
import { ItemList } from "./ItemList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useItemAnalysis, Suggestion } from "@/hooks/useItemAnalysis";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export function ItemDetailsSection({ 
  form, 
  insuranceEnabled, 
  orderId, 
  items = [],
  onAddItem,
  onRemoveItem
}: ItemDetailsSectionProps) {
  const { user } = useAuth();
  const [showItemForm, setShowItemForm] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>("basic-info");
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  
  const { analyzeItemPhoto, createSuggestionFromAnalysis, applySuggestionToForm, ignoreSuggestion } = useItemAnalysis();
  
  // Wenn der Benutzer eingeloggt ist und eine Sender-Rolle hat, zeigen wir den erweiterten Upload an
  const isUser = !!user;
  const isSender = user?.role?.includes("sender_");
  
  const handleAddItem = (item: any) => {
    if (onAddItem) {
      onAddItem(item);
    }
    setActiveAccordion("basic-info");
    setShowItemForm(false);
    setTempImage(null);
    setTempImageFile(null);
    setSuggestion(null);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Generieren einer temporären URL für die Vorschau
    const preview = URL.createObjectURL(file);
    setTempImage(preview);
    setTempImageFile(file);
    setSuggestion(null);
  }, []);

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

  return (
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
                <ItemPhotoSection 
                  imageUrl={tempImage || undefined} 
                  onImageUpload={handleImageUpload}
                  analysis_status={analysisInProgress ? 'pending' : suggestion ? 'success' : undefined}
                  onRequestAnalysis={handleRequestAnalysis}
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
            </div>
          </AccordionContent>
        </AccordionItem>

        {isUser && (
          <AccordionItem value="additional-items">
            <AccordionTrigger>Weitere Artikel hinzufügen</AccordionTrigger>
            <AccordionContent>
              {showItemForm ? (
                <ItemForm 
                  onSaveItem={handleAddItem} 
                  orderId={orderId}
                />
              ) : (
                <div className="flex justify-center py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowItemForm(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Neuen Artikel hinzufügen
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      
      {/* Liste der bereits hinzugefügten Artikel */}
      {items.length > 0 && (
        <div className="mt-6">
          <ItemList items={items} onRemoveItem={onRemoveItem || (() => {})} />
        </div>
      )}
    </div>
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
