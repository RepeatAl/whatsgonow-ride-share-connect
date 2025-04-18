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
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
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
      // neue Felder vorbefüllen:
      itemName: "",
      category: "",
      fragile: false,
      loadAssistance: false,
      toolsRequired: "",
      securityMeasures: "",
      weight: undefined,
      dimensions: "",
      value: undefined,
      price: undefined,
      negotiable: false,
      preferredVehicleType: "",
      insurance: false,
      pickupTimeStart: undefined,
      pickupTimeEnd: undefined,
      deliveryTimeStart: undefined,
      deliveryTimeEnd: undefined,
      deadline: undefined,
    },
  });

  // Datei‐Handling wie gehabt…

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
      return;
    }
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
    setSelectedFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviews(prev => [...prev, url]);
    });
  };

  const removeFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      const orderId = uuidv4();
      // Auftrag anlegen
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ id: orderId, ...data }]);
      if (insertError) throw insertError;

      // Bilder (mit Metadata!) hochladen
      for (const file of selectedFiles) {
        const path = `${orderId}/${file.name}`;
        const { error: uploadError } = await supabase
          .storage.from("orders-images")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            metadata: {
              user_id: user!.id,
              published: "false",
            },
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
        {/* — Bestehende Felder (Titel, Beschreibung, Adressen) — */}
        {/* … */}

        {/* — Neue Artikelfelder — */}
        <FormItem>
          <FormLabel>Artikelname*</FormLabel>
          <FormControl>
            <Input {...form.register("itemName")} placeholder="z.B. Fernseher" />
          </FormControl>
          <FormMessage>{form.formState.errors.itemName?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Kategorie*</FormLabel>
          <FormControl>
            <Input {...form.register("category")} placeholder="z.B. Elektronik" />
          </FormControl>
          <FormMessage>{form.formState.errors.category?.message}</FormMessage>
        </FormItem>

        <FormItem className="flex items-center space-x-2">
          <FormControl><Checkbox {...form.register("fragile")} /></FormControl>
          <FormLabel>zerbrechlich</FormLabel>
        </FormItem>
        <FormItem className="flex items-center space-x-2">
          <FormControl><Checkbox {...form.register("loadAssistance")} /></FormControl>
          <FormLabel>Belade‑Hilfe benötigt</FormLabel>
        </FormItem>
        <FormItem>
          <FormLabel>Werkzeuge benötigt (optional)</FormLabel>
          <FormControl>
            <Input {...form.register("toolsRequired")} placeholder="z.B. Schraubenzieher" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Sicherungsmaßnahmen (optional)</FormLabel>
          <FormControl>
            <Input {...form.register("securityMeasures")} placeholder="z.B. Spanngurte" />
          </FormControl>
        </FormItem>

        {/* — Preisfelder — */}
        <FormItem>
          <FormLabel>Preis (€)*</FormLabel>
          <FormControl>
            <Input type="number" step="0.01" {...form.register("price")} />
          </FormControl>
          <FormMessage>{form.formState.errors.price?.message}</FormMessage>
        </FormItem>
        <FormItem className="flex items-center space-x-2">
          <FormControl><Checkbox {...form.register("negotiable")} /></FormControl>
          <FormLabel>verhandelbar</FormLabel>
        </FormItem>
        <FormItem>
          <FormLabel>Wunsch‑Fahrzeugtyp (optional)</FormLabel>
          <FormControl>
            <Input {...form.register("preferredVehicleType")} placeholder="z.B. LKW" />
          </FormControl>
        </FormItem>

        {/* — Bildupload & Vorschau — */}
        <FormItem>
          <FormLabel>Bilder (max. 4, 2 MB)</FormLabel>
          <FormControl>
            <input
              type="file"
              multiple
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              className="block w-full"
            />
          </FormControl>
        </FormItem>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-white p-1 opacity-0 group-hover:opacity-80"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* — Submit — */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird erstellt…
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
