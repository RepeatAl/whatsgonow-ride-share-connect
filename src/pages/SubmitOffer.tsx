
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, DollarSign, MessageSquare, Package, MapPin, Calendar, Clock, Send, Loader2 } from "lucide-react";
import { TransportRequest } from "@/data/mockData";

// Validation schema for the offer form
const offerSchema = z.object({
  price: z.coerce.number()
    .positive({ message: "Preis muss eine positive Zahl sein" })
    .min(1, { message: "Bitte geben Sie einen gültigen Preis ein" }),
  message: z.string().optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

const SubmitOffer = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      price: 0,
      message: "",
    },
  });

  // Fetch order details
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to get order details
    import('@/data/mockData').then(({ mockRequests }) => {
      const selectedOrder = mockRequests.find(req => req.id === orderId);
      if (selectedOrder) {
        setOrder(selectedOrder);
        // Pre-populate the price field with the budget from the order
        form.setValue('price', selectedOrder.budget);
      } else {
        toast({
          title: "Fehler",
          description: "Der Auftrag konnte nicht gefunden werden.",
          variant: "destructive"
        });
        navigate("/offer-transport");
      }
      setIsLoading(false);
    });
  }, [orderId, navigate, toast, form]);

  const onSubmit = async (data: OfferFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call to POST /api/orders/{order_id}/offers
    try {
      // In a real app, this would be a fetch call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful API response
      toast({
        title: "Angebot gesendet",
        description: "Ihr Angebot wurde erfolgreich an den Auftraggeber übermittelt.",
      });
      
      // Navigate back to transport offers page
      navigate("/offer-transport");
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Senden des Angebots ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTimeWindow = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2, '0')} - ${endDate.getHours()}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0" 
          onClick={() => navigate("/offer-transport")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Button>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Angebot abgeben</h1>
            <p className="text-gray-600 mt-2">
              Geben Sie ein Preisangebot für diesen Transportauftrag ab
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            </div>
          ) : order ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">{order.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Abholadresse</p>
                        <p className="font-medium">{order.pickupLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Abholdatum</p>
                        <p className="font-medium">{formatDate(order.pickupTimeWindow.start)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Abholzeitfenster</p>
                        <p className="font-medium">{formatTimeWindow(order.pickupTimeWindow.start, order.pickupTimeWindow.end)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Zieladresse</p>
                        <p className="font-medium">{order.deliveryLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Lieferdatum</p>
                        <p className="font-medium">{formatDate(order.deliveryTimeWindow.start)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Lieferzeitfenster</p>
                        <p className="font-medium">{formatTimeWindow(order.deliveryTimeWindow.start, order.deliveryTimeWindow.end)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Package className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Paketdetails</p>
                    <p className="font-medium">{order.itemDetails.weight} kg, {order.itemDetails.dimensions}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Budget des Auftraggebers</p>
                  <p className="text-xl font-semibold text-brand-primary">€{order.budget}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Ihr Angebot</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preisangebot (€)</FormLabel>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <FormControl>
                              <Input
                                placeholder="50"
                                className="pl-10"
                                type="number"
                                step="0.01"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Geben Sie Ihren gewünschten Preis für diesen Transport an
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nachricht an den Auftraggeber (optional)</FormLabel>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                            <FormControl>
                              <Textarea
                                placeholder="Ich bin regelmäßig auf dieser Strecke unterwegs und könnte das Paket problemlos mitnehmen..."
                                className="pl-10 pt-2 min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Zusätzliche Informationen oder Fragen an den Auftraggeber
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto bg-brand-primary hover:bg-brand-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Angebot wird gesendet...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Angebot senden
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <p className="text-gray-600">Auftrag nicht gefunden</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubmitOffer;
