
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderFormValues } from '@/lib/validators/order';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const DRAFT_KEY = "order-form-draft";

interface OrderFormDraft {
  formValues: Partial<CreateOrderFormValues>;
  photoUrls: string[];
  lastModified: number;
}

export function useOrderDraftStorage(
  form: UseFormReturn<CreateOrderFormValues>,
  uploadedPhotoUrls: string[]
) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load draft on mount and handle localStorage migration
  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Check for localStorage draft first
        const localDraft = localStorage.getItem(DRAFT_KEY);
        
        // Try to load from Supabase
        const { data: dbDraft, error } = await supabase
          .from('order_drafts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'draft')
          .maybeSingle();

        if (error) throw error;

        // If we have a localStorage draft, migrate it
        if (localDraft && !dbDraft) {
          const draft: OrderFormDraft = JSON.parse(localDraft);
          
          const { error: saveError } = await supabase
            .from('order_drafts')
            .insert({
              user_id: user.id,
              draft_data: draft.formValues,
              photo_urls: draft.photoUrls,
              status: 'draft'
            });

          if (saveError) throw saveError;
          
          // Clear localStorage after successful migration
          localStorage.removeItem(DRAFT_KEY);
          toast.success('Entwurf wurde erfolgreich migriert');
        }

        // Load draft data into form
        if (dbDraft) {
          Object.entries(dbDraft.draft_data).forEach(([key, value]) => {
            if (key === 'deadline' && value) {
              if (typeof value === 'string' || typeof value === 'number') {
                form.setValue(key as keyof CreateOrderFormValues, new Date(value));
              }
            } else {
              // Use type assertion to tell TypeScript that the key is valid
              form.setValue(key as keyof CreateOrderFormValues, value as any);
            }
          });
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        toast.error('Fehler beim Laden des Entwurfs');
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [user, form]);

  // Auto-save draft on form changes
  useEffect(() => {
    if (!user) return;

    const subscription = form.watch(async (formValues) => {
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from('order_drafts')
          .upsert({
            user_id: user.id,
            draft_data: formValues,
            photo_urls: uploadedPhotoUrls,
            status: 'draft'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving draft:', error);
        toast.error('Fehler beim Speichern des Entwurfs');
      } finally {
        setIsSaving(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [user, form.watch, uploadedPhotoUrls]);

  const clearDraft = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('order_drafts')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'draft');

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing draft:', error);
      toast.error('Fehler beim Löschen des Entwurfs');
    }
  };

  return { clearDraft, isLoading, isSaving };
}
