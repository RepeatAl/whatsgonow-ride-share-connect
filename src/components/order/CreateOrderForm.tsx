
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package, Euro, Clock, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { enGB } from 'date-fns/locale';
import { DateRange } from "react-day-picker"
import { addDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ImageUploader from '@/components/ImageUploader';

interface OrderFormValues {
  pickupAddress: string;
  deliveryAddress: string;
  itemDescription: string;
  itemWeight: number;
  itemImage: string;
  pickupDate: Date | undefined;
  deliveryDate: Date | undefined;
  transportType: string;
  price: number;
  notes: string;
}

interface AddressSectionProps {
  form: any;
  isPickup: boolean;
  toggleIsPickup: () => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ form, isPickup, toggleIsPickup }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold mb-4">{isPickup ? 'Abholadresse' : 'Lieferadresse'}</h3>
        <Button type="button" variant="secondary" size="sm" onClick={toggleIsPickup}>
          <MapPin className="h-4 w-4 mr-2" />
          {isPickup ? 'Lieferadresse verwenden' : 'Abholadresse verwenden'}
        </Button>
      </div>

      <FormField
        control={form.control}
        name={isPickup ? 'pickupAddress' : 'deliveryAddress'}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="Straße und Hausnummer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

interface ItemDetailsSectionProps {
  form: any;
  onImageUploadComplete: (publicUrl: string) => void;
}

const ItemDetailsSection: React.FC<ItemDetailsSectionProps> = ({ form, onImageUploadComplete }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Artikeldetails</h3>
      
      <FormField
        control={form.control}
        name="itemDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Beschreibung</FormLabel>
            <FormControl>
              <Textarea placeholder="Beschreiben Sie den Artikel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="itemWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gewicht (kg)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <Label>Artikelfoto</Label>
        <ImageUploader onUploadComplete={onImageUploadComplete} />
      </div>
    </div>
  );
};

const CreateOrderForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSimpleAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [isPickup, setIsPickup] = useState(true);

  const form = useForm<OrderFormValues>({
    defaultValues: {
      pickupAddress: '',
      deliveryAddress: '',
      itemDescription: '',
      itemWeight: 1,
      itemImage: '',
      pickupDate: undefined,
      deliveryDate: undefined,
      transportType: 'standard',
      price: 50,
      notes: '',
    }
  });

  const onSubmit = async (values: OrderFormValues) => {
    console.log("Form values:", values);
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    toast({
      title: "Order created!",
      description: "Your order has been successfully created.",
    });
    navigate("/dashboard");
  };

  const handleImageUploadComplete = (publicUrl: string) => {
    setItemImage(publicUrl);
    form.setValue("itemImage", publicUrl);
  };

  const toggleIsPickup = () => {
    setIsPickup(!isPickup);
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Frachtauftrag erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AddressSection form={form} isPickup={isPickup} toggleIsPickup={toggleIsPickup} />
                <ItemDetailsSection form={form} onImageUploadComplete={handleImageUploadComplete} />

                {/* Date Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Termine</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Abholdatum</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Datum auswählen</span>
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
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Lieferdatum</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Datum auswählen</span>
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
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Transport and Price */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Transport & Preis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="transportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transporttyp</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Transporttyp wählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="fragile">Zerbrechlich</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preis (€)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={10}
                                max={500}
                                step={5}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                              <div className="text-center text-sm text-muted-foreground">
                                {field.value} €
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zusätzliche Notizen</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Besondere Anweisungen oder Hinweise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Erstellung..." : "Auftrag erstellen"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateOrderForm;
