
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Archive, Activity, Info } from "lucide-react";
import { Link } from "react-router-dom";

const ShadcnDemo = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleConfirm = () => {
    setIsDialogOpen(false);
    toast({
      title: "Bestätigt!",
      description: "Ihre Auswahl wurde erfolgreich bestätigt.",
      duration: 3000,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-primary">Whatsgonow Demo</h2>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Aktiv
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archiviert
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="bg-soft-purple p-6 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Terminauswahl</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wählen Sie einen Termin für Ihren Transport</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 text-brand-primary">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Kalender</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Verfügbare Termine anzeigen</p>
              </TooltipContent>
            </Tooltip>
            
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">Termin bestätigen</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Termin bestätigen</DialogTitle>
                  <DialogDescription>
                    Möchten Sie den ausgewählten Termin wirklich bestätigen?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleConfirm}>
                    Bestätigen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="bg-soft-yellow p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Archivierte Transporte</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Transport #1258 - München nach Berlin</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong>Datum:</strong> 12.03.2024</p>
                  <p><strong>Preis:</strong> 120,00 €</p>
                  <p><strong>Status:</strong> Abgeschlossen</p>
                  <p><strong>Bewertung:</strong> ⭐⭐⭐⭐⭐ (5/5)</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Transport #0937 - Hamburg nach Köln</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong>Datum:</strong> 24.02.2024</p>
                  <p><strong>Preis:</strong> 95,50 €</p>
                  <p><strong>Status:</strong> Abgeschlossen</p>
                  <p><strong>Bewertung:</strong> ⭐⭐⭐⭐ (4/5)</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
      
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild variant="outline">
            <Link to="/email-test">E-Mail Test Page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShadcnDemo;
