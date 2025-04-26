
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderFormValues } from '@/lib/validators/order';

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
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft: OrderFormDraft = JSON.parse(savedDraft);
        Object.entries(draft.formValues).forEach(([key, value]) => {
          form.setValue(key as keyof CreateOrderFormValues, value);
        });
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [form.setValue]);

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
