
import { useState, useEffect, useCallback } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

export const useOrderDraftStorage = (
  form: UseFormReturn<any>,
  photoUrls: string[]
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<{formValues: any, photos: string[]}>({
    formValues: {},
    photos: []
  });
  
  // Get current form values
  const formValues = useWatch({ control: form.control });

  // Debounced save function to reduce flickering from frequent saves
  const debouncedSave = useCallback(
    debounce(async (data: any, photos: string[]) => {
      try {
        setIsSaving(true);
        
        // Check if anything has actually changed before saving
        const formChanged = JSON.stringify(data) !== JSON.stringify(lastSavedData.formValues);
        const photosChanged = JSON.stringify(photos) !== JSON.stringify(lastSavedData.photos);
        
        if (!formChanged && !photosChanged) {
          setIsSaving(false);
          return;
        }
        
        // Save draft to localStorage as a backup
        const draft = {
          formValues: data,
          photos,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('order-draft', JSON.stringify(draft));
        
        // Also save to Supabase if you're using it
        const { error } = await supabase.from('order_drafts').upsert({
          id: localStorage.getItem('order-draft-id') || uuidv4(),
          draft_data: data,
          photo_urls: photos,
          updated_at: new Date().toISOString()
        });
        
        if (error) throw error;
        
        setLastSavedData({formValues: data, photos});
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000),  // 1 second debounce to prevent saving on every keystroke
    [] // Empty dependency array so the debounced function is created only once
  );
  
  // Effect to load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        setIsLoading(true);
        
        // First check localStorage
        const savedDraft = localStorage.getItem('order-draft');
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          form.reset(draft.formValues);
          setLastSavedData({formValues: draft.formValues, photos: draft.photos || []});
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDraft();
  }, [form]);
  
  // Effect to auto-save draft when form changes
  useEffect(() => {
    if (!isLoading) {
      debouncedSave(formValues, photoUrls);
    }
    
    return () => {
      debouncedSave.cancel();
    };
  }, [formValues, photoUrls, isLoading, debouncedSave]);
  
  // Function to clear draft
  const clearDraft = useCallback(async () => {
    try {
      setIsSaving(true);
      localStorage.removeItem('order-draft');
      
      const draftId = localStorage.getItem('order-draft-id');
      if (draftId) {
        await supabase.from('order_drafts').delete().eq('id', draftId);
        localStorage.removeItem('order-draft-id');
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing draft:', error);
      toast.error('Fehler beim Löschen des Entwurfs');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);
  
  return {
    isLoading,
    isSaving,
    clearDraft
  };
};
