import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CameraIcon, Upload, QrCode } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Camera, Smartphone } from "lucide-react";
import { QRScanner } from "@/components/qr/QRScanner";
import { UploadQrCode } from "@/components/upload/UploadQrCode";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const CreateOrderForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [showItemQrScanner, setShowItemQrScanner] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');
  const navigate = useNavigate();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      pickupStreet: "",
      pickupHouseNumber: "",
      pickupPostalCode: "",
      pickupCity: "",
      pickupCountry: "Deutschland",
      pickupAddressExtra: "",
      pickupPhone: "",
      pickupEmail: "",
      deliveryStreet: "",
      deliveryHouseNumber: "",
      deliveryPostalCode: "",
      deliveryCity: "",
      deliveryCountry: "Deutschland",
      deliveryAddressExtra: "",
      deliveryPhone: "",
      deliveryEmail: "",
      itemName: "",
      category: "",
      width: undefined,
      height: undefined,
      depth: undefined,
      weight: undefined,
      value: undefined,
      insurance: false,
      fragile: false,
      loadAssistance: false,
      toolsRequired: "",
      securityMeasures: "",
      price: undefined,
      negotiable: false,
      preferredVehicleType: "",
      pickupTimeStart: undefined,
      pickupTimeEnd: undefined,
      deliveryTimeStart: undefined,
      deliveryTimeEnd: undefined,
      deadline: undefined,
    },
  });

  const insuranceEnabled = form.watch("insurance");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} ist größer als 2 MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} ist kein unterstütztes Format.`);
        return;
      }
      
      validFiles.push(file);
      const url = URL.createObjectURL(file);
      validPreviews.push(url);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...validPreviews]);
  };

  const removeFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => {
      if (prev[idx]) URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onSubmit = async (data: CreateOrderFormValues) => {
    setIsSubmitting(true);
    try {
      const pickupAddress = `${data.pickupStreet} ${data.pickupHouseNumber}, ${data.pickupPostalCode} ${data.pickupCity}, ${data.pickupCountry}${data.pickupAddressExtra ? ` (${data.pickupAddressExtra})` : ''}`;
      const deliveryAddress = `${data.deliveryStreet} ${data.deliveryHouseNumber}, ${data.deliveryPostalCode} ${data.deliveryCity}, ${data.deliveryCountry}${data.deliveryAddressExtra ? ` (${data.deliveryAddressExtra})` : ''}`;
      
      const dimensions = `${data.width} x ${data.height} x ${data.depth} cm`;
      
      const orderId = uuidv4();
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ 
          id: orderId, 
          description: data.description,
          from_address: pickupAddress,
          to_address: deliveryAddress,
          weight: data.weight,
          price: data.price,
          negotiable: data.negotiable,
          fragile: data.fragile,
          load_assistance: data.loadAssistance,
          tools_required: data.toolsRequired || '',
          security_measures: data.securityMeasures || '',
          item_name: data.itemName,
          category: data.category,
          preferred_vehicle_type: data.preferredVehicleType || '',
          deadline: data.deadline,
          status: 'pending',
          sender_id: user!.id
        }]);
        
      if (insertError) throw insertError;

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
              published: "true",
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

  const handleQrScan = async (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      
      if (data.itemName) form.setValue("itemName", data.itemName);
      if (data.category) form.setValue("category", data.category);
      if (data.weight) form.setValue("weight", data.weight);
      if (data.description) form.setValue("description", data.description);
      
      setShowItemQrScanner(false);
      toast.success("QR-Code erfolgreich gescannt!");
    } catch (error) {
      toast.error("Ungültiger QR-Code");
    }
  };

  const handleMobilePhotosComplete = (files: string[]) => {
    files.forEach(async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `mobile-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        if (selectedFiles.length + 1 <= MAX_FILES) {
          setSelectedFiles(prev => [...prev, file]);
          setPreviews(prev => [...prev, url]);
        } else {
          toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
        }
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    });
  };

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Bilder hochladen</h3>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Bilder hochladen (max. {MAX_FILES}, 2 MB pro Datei)</FormLabel>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload size={18} className="mr-2" />
                      Datei auswählen
                    </Button>

                    {deviceType === 'mobile' && (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            if (!navigator.mediaDevices?.getUserMedia) {
                              toast.error("Dein Gerät unterstützt keine Kamera-API");
                              return;
                            }
                            setShowQrScanner(true);
                          }}
                        >
                          <Camera size={18} className="mr-2" />
                          Jetzt Bild aufnehmen
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowItemQrScanner(true)}
                        >
                          <QrCode size={18} className="mr-2" />
                          QR-Code scannen
                        </Button>
                      </>
                    )}

                    {deviceType === 'desktop' && user && (
                      <UploadQrCode
                        userId={user.id}
                        target="order-photos"
                        onComplete={handleMobilePhotosComplete}
                      />
                    )}

                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept={ALLOWED_TYPES.join(",")}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <FormMessage />
                </FormItem>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img src={src} className="w-full h-32 object-cover rounded" alt={`Upload ${idx + 1}`} />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(idx)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Allgemeine Informationen</h3>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Transport von Möbeln" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreiben Sie Ihren Transportauftrag..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Artikeldetails</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artikelname*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Sofa" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.itemName?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Möbel" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.category?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gewicht (kg)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 15.5" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.weight?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{insuranceEnabled ? "Warenwert (€)*" : "Warenwert (€, optional)"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="z.B. 499.99" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.value?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breite (cm)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 100" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.width?.message}</FormMessage>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Höhe (cm)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 50" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.height?.message}</FormMessage>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiefe (cm)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="z.B. 30" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.depth?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Abholadresse</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pickupStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Straße*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Musterstraße" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupStreet?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupHouseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hausnummer*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. 123" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupHouseNumber?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupPostalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postleitzahl*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. 12345" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupPostalCode?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stadt*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Berlin" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupCity?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Deutschland" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupCountry?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupAddressExtra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresszusatz</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Hinterhof, 2. Stock" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupAddressExtra?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. +49123456789" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupPhone?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. beispiel@mail.com" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.pickupEmail?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Zieladresse</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="deliveryStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Straße*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Musterstraße" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryStreet?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryHouseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hausnummer*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. 123" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryHouseNumber?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryPostalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postleitzahl*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. 12345" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryPostalCode?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stadt*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. München" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryCity?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land*</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Deutschland" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryCountry?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryAddressExtra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresszusatz</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Hinterhof, 2. Stock" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryAddressExtra?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer Empfänger</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. +49123456789" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryPhone?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail Empfänger</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. beispiel@mail.com" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.deliveryEmail?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Zusätzliche Optionen</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Angebotener Preis (€)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="z.B. 50" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.price?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredVehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bevorzugter Fahrzeugtyp</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Transporter" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.preferredVehicleType?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 mt-4">
            <div className="grid gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="negotiable"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Preis verhandelbar</FormLabel>
                      <FormMessage>{form.formState.errors.negotiable?.message}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Versicherung</FormLabel>
                      <FormMessage>{form.formState.errors.insurance?.message}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fragile"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Zerbrechlich</FormLabel>
                      <FormMessage>{form.formState.errors.fragile?.message}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loadAssistance"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Hilfe beim Be- und Entladen</FormLabel>
                      <FormMessage>{form.formState.errors.loadAssistance?.message}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="toolsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benötigte Werkzeuge</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Sackkarre, Spanngurte" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.toolsRequired?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="securityMeasures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sicherheitsmaßnahmen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B. Besondere Vorsicht beim Transport, Verpackungsanweisungen"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.securityMeasures?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Zeitfenster</h3>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Deadline wählen</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{form.formState.errors.deadline?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird erstellt...</>
            ) : (
              "Auftrag erstellen"
            )}
          </Button>
        </div>

        <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
          <DialogContent className="sm:max-w-md">
            <QRScanner
              onScan={handleMobilePhotosComplete}
              onClose={() => setShowQrScanner(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showItemQrScanner} onOpenChange={setShowItemQrScanner}>
          <DialogContent className="sm:max-w-md">
            <QRScanner
              onScan={handleQrScan}
              onClose={() => setShowItemQrScanner(false)}
            />
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
