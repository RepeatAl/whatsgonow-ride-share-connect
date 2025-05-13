
import React, { useState, useCallback } from "react";
import { ItemDetailsSectionProps, ItemDetails } from "./types";
import { ItemDetailsForm } from "./ItemDetailsForm";
import { ItemPhotoSection } from "./ItemPhotoSection";
import { ItemSuggestionBox } from "./ItemSuggestionBox";
import { MultiItemSuggestionBox } from "./MultiItemSuggestionBox";
import { ItemForm } from "./ItemForm";
import { ItemList } from "./ItemList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useItemAnalysis, Suggestion } from "@/hooks/useItemAnalysis";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/file-upload/useFileUpload";

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
  
  // Neue Zustandsvariablen für Phase 4.5: Bulk Item Upload
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [multiSuggestions, setMultiSuggestions] = useState<Record<string, Suggestion>>({});
  
  const { 
    analyzeItemPhoto, 
    createSuggestionFromAnalysis, 
    applySuggestionToForm, 
    ignoreSuggestion,
    createSuggestionsFromMultiAnalysis 
  } = useItemAnalysis();
  
  const { 
    fileInputRef, 
    handleFileChange, 
    handleFileSelect, 
    uploadAndAnalyzeMultipleImages,
    analyzedFiles 
  } = useFileUpload(orderId);
  
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

  // Neue Funktion für Mehrfach-Upload und Analyse (Phase 4.5)
  const handleMultipleFilesAnalysis = useCallback(async () => {
    if (!fileInputRef.current?.files?.length) {
      toast.error("Bitte wählen Sie Bilder zum Analysieren aus");
      return;
    }
    
    try {
      setAnalysisInProgress(true);
      
      // Upload und Analyse der Bilder
      const results = await uploadAndAnalyzeMultipleImages(user?.id);
      
      if (results && results.length > 0) {
        // Erstelle Vorschläge aus den Analyseergebnissen
        const suggestions: Record<string, Suggestion> = {};
        
        results.forEach(result => {
          if (result.fileUrl && result.analysis) {
            const suggestion = createSuggestionFromAnalysis(result.analysis);
            if (suggestion) {
              suggestions[result.fileUrl] = suggestion;
            }
          }
        });
        
        setMultiSuggestions(suggestions);
        toast.success(`${Object.keys(suggestions).length} Bilder erfolgreich analysiert`);
      }
    } catch (err) {
      console.error("Mehrfachanalyse-Fehler:", err);
      toast.error("Fehler bei der Analyse mehrerer Bilder");
    } finally {
      setAnalysisInProgress(false);
    }
  }, [uploadAndAnalyzeMultipleImages, user, createSuggestionFromAnalysis]);

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
  
  // Neue Handler für Mehrfachanalyse (Phase 4.5)
  const handleAcceptMultiSuggestion = (imageUrl: string) => {
    const suggestion = multiSuggestions[imageUrl];
    if (suggestion) {
      // Erstelle ein neues Item aus dem Vorschlag
      const newItem: ItemDetails = {
        title: suggestion.title || "Unbenannter Artikel",
        category: suggestion.category,
        image_url: imageUrl,
        analysis_status: 'success'
      };
      
      // Füge das Item zur Liste hinzu
      handleAddItem(newItem);
      
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

  // Toggle für Mehrfach-Upload-Modus
  const toggleMultiUploadMode = () => {
    setShowMultiUpload(!showMultiUpload);
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
              
              {isUser && !showMultiUpload && (
                <ItemPhotoSection 
                  imageUrl={tempImage || undefined} 
                  onImageUpload={handleImageUpload}
                  analysis_status={analysisInProgress ? 'pending' : suggestion ? 'success' : undefined}
                  onRequestAnalysis={handleRequestAnalysis}
                />
              )}
              
              {isUser && showMultiUpload && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Mehrere Artikelbilder hochladen</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleMultiUploadMode}
                    >
                      Einzelbild-Modus
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleFileSelect}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Bilder auswählen
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="default"
                        onClick={handleMultipleFilesAnalysis}
                        disabled={!fileInputRef.current?.files?.length || analysisInProgress}
                        className="flex-1"
                      >
                        Bilder analysieren
                      </Button>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileChange}
                    />
                    
                    {fileInputRef.current?.files?.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {fileInputRef.current.files.length} Bilder ausgewählt
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {isUser && !showMultiUpload && (
                <div className="mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleMultiUploadMode}
                  >
                    Mehrere Bilder hochladen
                  </Button>
                </div>
              )}
              
              {suggestion && !showMultiUpload && (
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
