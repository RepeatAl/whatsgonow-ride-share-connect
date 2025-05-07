
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemDetailsSchema, ItemDetailsFormValues } from "./schema";
import { ItemFormProps } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFileUpload } from "@/hooks/file-upload/useFileUpload";
import { toast } from "sonner";

export function ItemForm({ onSaveItem, orderId }: ItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ItemDetailsFormValues>({
    resolver: zodResolver(itemDetailsSchema),
    defaultValues: {
      title: "",
      description: "",
    }
  });
  
  const { fileInputRef, handleFileSelect, handleFileChange, previews, uploadFiles } = useFileUpload();
  
  const handleSubmit = async (data: ItemDetailsFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Wenn es ein Bild gibt, laden wir es hoch
      let imageUrl = "";
      if (previews[0]) {
        // Wenn es eine URL ist, verwenden wir sie direkt
        if (typeof previews[0] === "string" && previews[0].startsWith("http")) {
          imageUrl = previews[0];
        } else {
          // Sonst laden wir die Datei hoch
          const files = fileInputRef.current?.files 
            ? Array.from(fileInputRef.current.files) 
            : [];
            
          const uploadedUrls = await uploadFiles(files);
          
          if (uploadedUrls.length > 0) {
            imageUrl = uploadedUrls[0];
          }
        }
      }
      
      // Artikel-Objekt erstellen
      const newItem = {
        title: data.title,
        description: data.description,
        imageUrl: imageUrl || undefined,
        orderId
      };
      
      // An Parent-Komponente übergeben
      onSaveItem(newItem);
      
      // Formular zurücksetzen
      form.reset({
        title: "",
        description: "",
      });
      
      toast.success("Artikel hinzugefügt");
      
    } catch (error) {
      console.error("Fehler beim Speichern des Artikels:", error);
      toast.error("Fehler beim Speichern des Artikels");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Antiker Schrank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Artikelbeschreibung eingeben..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Artikelbild</label>
          <div className="flex gap-4">
            <div 
              className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors w-full h-32"
              onClick={handleFileSelect}
            >
              {previews[0] ? (
                <img 
                  src={previews[0] as string} 
                  alt="Artikelbild" 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <>
                  <p className="text-gray-500 text-sm text-center">
                    Klicken, um ein Bild hochzuladen
                  </p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Zurücksetzen
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gespeichert..." : "Artikel hinzufügen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
