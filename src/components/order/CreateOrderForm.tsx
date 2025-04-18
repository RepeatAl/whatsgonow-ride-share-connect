// src/components/order/CreateOrderForm.tsx
import { useState, useEffect } from "react";
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

  // für den Bildupload
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

  // Bild‑Auswahl + Validierung
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
    setSelectedFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, url]);
    });
  };

  // Einzelnes Bild entfernen
  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit‑Handler
  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      // 1) Neuer Auftrag in DB
      const orderId = uuidv4();
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ id: orderId, ...data }]);
      if (insertError) throw insertError;

      // 2) Bilder hochladen mit Metadata (user_id, published=false)
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
        {/* === TITEL === */}
        <FormItem>
          <FormLabel>Titel*</FormLabel>
          <FormControl>
            <Input placeholder="z.B. Transport von Möbeln" {...form.register("title")} />
          </FormControl>
          <FormMessage>{form.formState.errors.title?.message}</FormMessage>
        </FormItem>

        {/* === BESCHREIBUNG === */}
        <FormItem>
          <FormLabel>Beschreibung*</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Beschreiben Sie Ihren Transportauftrag..."
              className="min-h-[120px]"
              {...form.register("description")}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.description?.message}</FormMessage>
        </FormItem>

        {/* === ADRESSEN === */}
        <FormItem>
          <FormLabel>Abholadresse*</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Straße, Hausnummer, PLZ, Ort"
              className="min-h-[80px]"
              {...form.register("pickupAddress")}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.pickupAddress?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Zieladresse*</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Straße, Hausnummer, PLZ, Ort"
              className="min-h-[80px]"
              {...form.register("deliveryAddress")}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.deliveryAddress?.message}</FormMessage>
        </FormItem>

        {/* === GEWICHT & MAẞE & WERT === */}
        <FormItem>
          <FormLabel>Gewicht (kg)*</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.1"
              placeholder="z.B. 15.5"
              {...form.register("weight")}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.weight?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Maße (optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="z.B. 100 x 50 x 30 cm"
              {...form.register("dimensions")}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.dimensions?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Warenwert (€, optional)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="z.B. 499.99"
              {...form.register("value")}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.value?.message}</FormMessage>
        </FormItem>

        {/* === VERSICHERUNG === */}
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Checkbox {...form.register("insurance")} />
          </FormControl>
          <div>
            <FormLabel>Versicherung</FormLabel>
            <FormMessage>{form.formState.errors.insurance?.message}</FormMessage>
          </div>
        </FormItem>

        {/* === ZEITFENSTER (Abholung & Lieferung) === */}
        <div>
          <h3 className="font-medium mb-2">Abholzeitfenster</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* pickupTimeStart */}
            <FormItem className="flex flex-col">
              <FormLabel>Von</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left",
                      !form.watch("pickupTimeStart") && "text-muted-foreground"
                    )}
                  >
                    {form.watch("pickupTimeStart")
                      ? format(form.watch("pickupTimeStart")!, "PPP")
                      : "Datum wählen"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("pickupTimeStart")}
                    onSelect={(date) => form.setValue("pickupTimeStart", date!)}
                    disabled={(d) => d < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage>
                {form.formState.errors.pickupTimeStart?.message}
              </FormMessage>
            </FormItem>

            {/* pickupTimeEnd */}
            <FormItem className="flex flex-col">
              <FormLabel>Bis</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left",
                      !form.watch("pickupTimeEnd") && "text-muted-foreground"
                    )}
                  >
                    {form.watch("pickupTimeEnd")
                      ? format(form.watch("pickupTimeEnd")!, "PPP")
                      : "Datum wählen"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("pickupTimeEnd")}
                    onSelect={(date) => form.setValue("pickupTimeEnd", date!)}
                    disabled={(d) =>
                      d < new Date() ||
                      (form.watch("pickupTimeStart")! && d < form.watch("pickupTimeStart")!)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage>
                {form.formState.errors.pickupTimeEnd?.message}
              </FormMessage>
            </FormItem>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Lieferzeitfenster</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* deliveryTimeStart */}
            <FormItem className="flex flex-col">
              <FormLabel>Von</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left",
                      !form.watch("deliveryTimeStart") && "text-muted-foreground"
                    )}
                  >
                    {form.watch("deliveryTimeStart")
                      ? format(form.watch("deliveryTimeStart")!, "PPP")
                      : "Datum wählen"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("deliveryTimeStart")}
                    onSelect={(date) => form.setValue("deliveryTimeStart", date!)}
                    disabled={(d) => d < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage>
                {form.formState.errors.deliveryTimeStart?.message}
              </FormMessage>
            </FormItem>

            {/* deliveryTimeEnd */}
            <FormItem className="flex flex-col">
              <FormLabel>Bis</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left",
                      !form.watch("deliveryTimeEnd") && "text-muted-foreground"
                    )}
                  >
                    {form.watch("deliveryTimeEnd")
                      ? format(form.watch("deliveryTimeEnd")!, "PPP")
                      : "Datum wählen"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("deliveryTimeEnd")}
                    onSelect={(date) => form.setValue("deliveryTimeEnd", date!)}
                    disabled={(d) =>
                      d < new Date() ||
                      (form.watch("deliveryTimeStart")! && d < form.watch("deliveryTimeStart")!)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage>
                {form.formState.errors.deliveryTimeEnd?.message}
              </FormMessage>
            </FormItem>
          </div>
        </div>

        {/* === DEADLINE === */}
        <FormItem>
          <FormLabel>Deadline</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full text-left",
                  !form.watch("deadline") && "text-muted-foreground"
                )}
              >
                {form.watch("deadline") ? format(form.watch("deadline")!, "PPP") : "Termin wählen"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="start">
              <Calendar
                mode="single"
                selected={form.watch("deadline")}
                onSelect={(date) => form.setValue("deadline", date!)}
                disabled={(d) => d < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage>{form.formState.errors.deadline?.message}</FormMessage>
        </FormItem>

        {/* === BILDER-UPLOAD === */}
        <FormItem>
          <FormLabel>Bilder (max. {MAX_FILES}, 2 MB pro Datei)</FormLabel>
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

        {/* === VORSCHAU === */}
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

        {/* === SUBMIT === */}
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
