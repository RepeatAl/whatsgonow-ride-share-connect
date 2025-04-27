
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderFormValues } from '@/lib/validators/order';
import { toast } from 'sonner';

const DRAFT_KEY = "order-form-draft";

interface OrderFormDraft {
  formValues: Partial<CreateOrderFormValues>;
  photoUrls: string[];
  lastModified: number;
}

export function useOrderFormDraft(
  form: UseFormReturn<CreateOrderFormValues>,
  uploadedPhotoUrls: string[]
) {
  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft: OrderFormDraft = JSON.parse(savedDraft);
        Object.entries(draft.formValues).forEach(([key, value]) => {
          // Convert deadline string back to Date if it exists
          if (key === 'deadline' && value) {
            // Make sure we're only passing valid date values
            if (typeof value === 'string' || typeof value === 'number') {
              form.setValue(key as keyof CreateOrderFormValues, new Date(value));
            }
          } else {
            form.setValue(key as keyof CreateOrderFormValues, value);
          }
        });
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [form]);

  // Auto-save draft on form changes
  useEffect(() => {
    const subscription = form.watch((formValues) => {
      const draft: OrderFormDraft = {
        formValues,
        photoUrls: uploadedPhotoUrls,
        lastModified: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, uploadedPhotoUrls]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  return { clearDraft };
}
