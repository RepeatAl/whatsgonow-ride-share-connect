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
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
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

  // ----- Bilder‑Upload Handler -----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
      return;
    }
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} ist größer als 2 MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} ist kein unterstütztes Format.`);
        return;
      }
    }
    setSelectedFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, url]);
    });
  };

  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ----- Submit Handler -----
  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      // 1) Neuen Auftrag anlegen
      const orderId = uuidv4();
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ id: orderId, ...data }]);
      if (insertError) throw insertError;

      // 2) Bilder hochladen
      for (const file of selectedFiles) {
        const path = `${orderId}/${file.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from("items-images")
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

        {/* TITEL */}
        <FormItem>
          <FormLabel>Titel*</FormLabel>
          <FormControl>
            <Input {...form.register("title")} />
          </FormControl>
          <FormMessage>{form.formState.errors.title?.message}</FormMessage>
        </FormItem>

        {/* BESCHREIBUNG */}
        <FormItem>
          <FormLabel>Beschreibung*</FormLabel>
          <FormControl>
            <Textarea className="min-h-[120px]" {...form.register("description")} />
          </FormControl>
          <FormMessage>{form.formState.errors.description?.message}</FormMessage>
        </FormItem>

        {/* ABHOL- & ZIELADRESSE */}
        <FormItem>
          <FormLabel>Abholadresse*</FormLabel>
          <FormControl>
            <Textarea className="min-h-[80px]" {...form.register("pickupAddress")} />
          </FormControl>
          <FormMessage>{form.formState.errors.pickupAddress?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>Zieladresse*</FormLabel>
          <FormControl>
            <Textarea className="min-h-[80px]" {...form.register("deliveryAddress")} />
          </FormControl>
          <FormMessage>{form.formState.errors.deliveryAddress?.message}</FormMessage>
        </FormItem>

        {/* ARTIKEL‑METADATEN */}
        <FormItem>
          <FormLabel>Artikelname*</FormLabel>
          <FormControl>
            <Input {...form.register("itemName")} />
          </FormControl>
          <FormMessage>{form.formState.errors.itemName?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>Kategorie*</FormLabel>
          <FormControl>
            <Input placeholder="z.B. Möbel, Elektronik, Kleidung" {...form.register("category")} />
          </FormControl>
          <FormMessage>{form.formState.errors.category?.message}</FormMessage>
        </FormItem>
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Checkbox {...form.register("fragile")} />
          </FormControl>
          <div>
            <FormLabel>Zerbrechlich</FormLabel>
          </div>
        </FormItem>
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Checkbox {...form.register("loadAssistance")} />
          </FormControl>
          <div>
            <FormLabel>Hilfestellung durch Fahrer nötig</FormLabel>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>Werkzeuge erforderlich (optional)</FormLabel>
          <FormControl>
            <Textarea {...form.register("toolsRequired")} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Sicherungsmaßnahmen (optional)</FormLabel>
          <FormControl>
            <Textarea {...form.register("securityMeasures")} />
          </FormControl>
        </FormItem>

        {/* GEWICHT, MAẞE & WERT */}
        <FormItem>
          <FormLabel>Gewicht (kg)*</FormLabel>
          <FormControl>
            <Input type="number" step="0.1" {...form.register("weight")} />
          </FormControl>
          <FormMessage>{form.formState.errors.weight?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>Maße (optional)</FormLabel>
          <FormControl>
            <Input {...form.register("dimensions")} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Warenwert (€) (optional)</FormLabel>
          <FormControl>
            <Input type="number" step="0.01" {...form.register("value")} />
          </FormControl>
        </FormItem>

        {/* PREIS & DEAL */}
        <FormItem>
          <FormLabel>Preis (€)*</FormLabel>
          <FormControl>
            <Input type="number" step="0.01" {...form.register("price")} />
          </FormControl>
          <FormMessage>{form.formState.errors.price?.message}</FormMessage>
        </FormItem>
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Checkbox {...form.register("negotiable")} />
          </FormControl>
          <div>
            <FormLabel>Preis verhandelbar</FormLabel>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>Wunsch‑Fahrzeugtyp (optional)</FormLabel>
          <FormControl>
            <Input placeholder="z.B. Transporter, LKW" {...form.register("preferredVehicleType")} />
          </FormControl>
        </FormItem>

        {/* VERSICHERUNG */}
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Checkbox {...form.register("insurance")} />
          </FormControl>
          <div>
            <FormLabel>Versicherung</FormLabel>
          </div>
        </FormItem>

        {/* ZEITFENSTER & DEADLINE */}
        {/* –– hier bleiben eure bestehenden Popover‑Blöcke für Datum / Uhrzeit –– */}

        {/* BILDER‑UPLOAD */}
        <FormItem>
          <FormLabel>Bilder (max. {MAX_FILES}, 2 MB pro Datei)</FormLabel>
          <FormControl>
            <input
              type="file"
              multiple
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700"
            />
          </FormControl>
        </FormItem>
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

        {/* ABSENDEN */}
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

