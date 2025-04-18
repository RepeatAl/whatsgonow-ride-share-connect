// src/components/order/CreateOrderForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const CreateOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      pickupAddress: "",
      deliveryAddress: "",
      weight: undefined,
      dimensions: "",
      value: undefined,
      insurance: false,
      pickupTimeStart: undefined,
      pickupTimeEnd: undefined,
      deliveryTimeStart: undefined,
      deliveryTimeEnd: undefined,
      deadline: undefined,
    },
  });

  // 1) Handler für File‑Input und Validierung
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Anzahl prüfen
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
      return;
    }
    // Größe & Typ prüfen
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} ist größer als 2 MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} ist kein unterstütztes Format.`);
        return;
      }
    }
    // ok → state updaten und Vorschau erzeugen
    setSelectedFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviews(prev => [...prev, url]);
    });
  };

  // 2) Entfernen eines Bildes aus der Vorschau
  const removeFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      // 3) Order in der DB anlegen (Beispiel mit Supabase)
      const orderId = uuidv4();
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ id: orderId, ...data }]);
      if (insertError) throw insertError;

      // 4) Bilder hochladen
      for (const file of selectedFiles) {
        const { error: uploadError } = await supabase
          .storage
          .from("orders")
          .upload(`${orderId}/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;
      }

      toast.success("Transportauftrag erfolgreich erstellt!");
      navigate("/find-transport");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Fehler beim Erstellen des Transportauftrags.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ---------- die bisherigen Felder (Titel, Description, Adressen, etc.) ---------- */}
        {/* ... kopiere hier alle deine bestehenden FormField-Blöcke ... */}

        {/* ---------- Bilder‑Upload ---------- */}
        <FormItem className="col-span-full">
          <FormLabel>Bilder (max. {MAX_FILES})</FormLabel>
          <FormControl>
            <input
              type="file"
              multiple
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700"
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* ---------- Thumbnail‑Vorschau ---------- */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative group">
                <img src={src} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-80"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------- Submit ---------- */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird erstellt...
              </>
            ) : (
              "Transportauftrag erstellen"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
