import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import Dropzone from "react-dropzone";

import { createOrderSchema, type CreateOrderFormValues } from "@/lib/validators/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
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

const MAX_IMAGES = 4;

const CreateOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      fragile: false,
      assistance: false,
      tools: "",
      securityMeasures: "",
      pickupAddress: "",
      deliveryAddress: "",
      weight: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      value: undefined,
      insurance: false,
      vehicleType: "",
      price: undefined,
      negotiable: false,
      pickupDate: undefined,
      deliveryDate: undefined,
      images: [] as File[]
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting order data:", data);
      // TODO: Upload images to storage, attach URLs
      // TODO: API call to create order in database

      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Transportauftrag erfolgreich erstellt!");
      navigate("/find-transport");
    } catch (error) {
      console.error(error);
      toast.error("Fehler beim Erstellen des Transportauftrags. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = watch("images");

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Article Images */}
        <FormItem>
          <FormLabel>Bilder hochladen (max. {MAX_IMAGES})</FormLabel>
          <Dropzone
            onDrop={(accepted) => {
              const current = images || [];
              const next = [...current, ...accepted].slice(0, MAX_IMAGES);
              setValue("images", next, { shouldValidate: true });
            }}
            accept={{ "image/*": [] }}
            multiple
            maxFiles={MAX_IMAGES}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="p-6 border-2 border-dashed rounded cursor-pointer text-center"
              >
                <input {...getInputProps()} />
                <p>Ziehe Bilder hierher oder klicke zum Auswählen</p>
              </div>
            )}
          </Dropzone>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {images?.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-24 w-24 object-cover rounded"
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>

        {/* Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artikelname*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Esstisch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorie*</FormLabel>
              <FormControl>
                <select {...field} className="block w-full border rounded p-2">
                  <option value="">Wähle Kategorie</option>
                  <option value="furniture">Möbel</option>
                  <option value="electronics">Elektronik</option>
                  <option value="other">Sonstiges</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weight */}
          <FormField
            control={control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gewicht (kg)*</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Dimensions */}
          <FormField
            control={control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Länge (cm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breite (cm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Höhe (cm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fragile & Assistance */}
        <div className="flex gap-6">
          <FormField
            control={control}
            name="fragile"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Zerbrechlich</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="assistance"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Beladehilfe benötigt</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Tools & Security Measures */}
        <FormField
          control={control}
          name="tools"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Werkzeuge benötigt (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="securityMeasures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sicherungshinweise (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Value & Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warenwert (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="insurance"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Transportversicherung</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Addresses */}
        <FormField
          control={control}
          name="pickupAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abholadresse</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zieladresse</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abholdatum</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : "Datum wählen"}
                        <CalendarIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
