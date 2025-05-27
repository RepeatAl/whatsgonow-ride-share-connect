import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Package, Euro, Clock, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import AddressSection from './form-sections/AddressSection';
import ItemDetailsSection from './form-sections/ItemDetailsSection';
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
import { Calendar as CalendarIcon } from "lucide-react"
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

const CreateOrderForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSimpleAuth();
  const [activeSection, setActiveSection] = useState<
    "address" | "itemDetails" | "confirmation"
  >("address");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemImage, setItemImage] = useState<string | null>(null);

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
                <AddressSection form={form} />
                <ItemDetailsSection form={form} onImageUploadComplete={handleImageUploadComplete} />

                {/* Confirmation Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Bestätigung</h3>
                  <p>Bitte überprüfe deine Angaben:</p>
                  <ul className="list-disc list-inside">
                    <li>Abholadresse: {form.getValues("pickupAddress")}</li>
                    <li>Lieferadresse: {form.getValues("deliveryAddress")}</li>
                    <li>Artikelbeschreibung: {form.getValues("itemDescription")}</li>
                    <li>Gewicht: {form.getValues("itemWeight")} kg</li>
                    <li>Foto: {form.getValues("itemImage")}</li>
                    <li>Abholdatum: {form.getValues("pickupDate")?.toLocaleDateString()}</li>
                    <li>Lieferdatum: {form.getValues("deliveryDate")?.toLocaleDateString()}</li>
                    <li>Transporttyp: {form.getValues("transportType")}</li>
                    <li>Preis: {form.getValues("price")} €</li>
                    <li>Notizen: {form.getValues("notes")}</li>
                  </ul>
                </div>

                <Button type="submit" disabled={isSubmitting}>
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
