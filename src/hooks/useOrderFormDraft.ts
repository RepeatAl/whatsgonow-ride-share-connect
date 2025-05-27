
import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

export function useOrderFormDraft(
  form: UseFormReturn<CreateOrderFormValues>,
  uploadedPhotoUrls: string[],
  items: any[] = []
) {
  const watchedValues = form.watch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to save draft after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      const draftData = {
        formData: watchedValues,
        photoUrls: uploadedPhotoUrls,
        items: items,
        lastSaved: new Date().toISOString(),
      };

      try {
        localStorage.setItem('orderFormDraft', JSON.stringify(draftData));
        console.log('Draft saved automatically');
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 2000);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [watchedValues, uploadedPhotoUrls, items]);

  const clearDraft = () => {
    try {
      localStorage.removeItem('orderFormDraft');
      console.log('Draft cleared');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('orderFormDraft');
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return null;
  };

  return {
    clearDraft,
    loadDraft,
  };
}
