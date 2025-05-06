
import { supabase } from '@/lib/supabaseClient';
import { prepareInvoiceData } from '@/utils/invoice';
import { xmlService } from './xmlService';
import { blobToBase64 } from './helpers';
import { toast } from "@/hooks/use-toast";

/**
 * Service für den Umgang mit XRechnung-E-Mail-Operationen
 */
export const xRechnungService = {
  /**
   * Prüft, ob die E-Mail-Adresse zu einer Behörde gehört
   */
  isGovernmentAgency: (email: string): boolean => {
    if (!email) return false;
    
    const governmentDomains = [
      "@bund.de", 
      "@bundesregierung.de", 
      "@bundeswehr.org", 
      "@zoll.de",
      "@bzst.de",
      "@bafa.de",
      "@bayern.de",
      "@berlin.de",
      "@brandenburg.de",
      "@bremen.de",
      "@hamburg.de",
      "@hessen.de",
      "@mv.de", // Mecklenburg-Vorpommern
      "@niedersachsen.de",
      "@nrw.de",
      "@rlp.de", // Rheinland-Pfalz
      "@saarland.de",
      "@sachsen.de",
      "@sachsen-anhalt.de",
      "@schleswig-holstein.de",
      "@thueringen.de"
    ];
    
    const normalizedEmail = email.toLowerCase();
    return governmentDomains.some(domain => 
      normalizedEmail.endsWith(domain)
    ) || normalizedEmail.includes('.kommune.de') || 
       normalizedEmail.includes('stadt-') ||
       normalizedEmail.includes('landkreis-') ||
       normalizedEmail.includes('kreis-');
  },

  /**
   * Sendet eine XRechnung per E-Mail an eine Behörde
   */
  sendXRechnungEmail: async (
    orderId: string, 
    email: string, 
    recipientName: string,
    preview: boolean = false
  ): Promise<boolean> => {
    try {
      // Prüfen, ob der Empfänger eine Behörde ist
      if (!preview && !xRechnungService.isGovernmentAgency(email)) {
        console.log("Empfänger ist keine Behörde, XRechnung-E-Mail wird übersprungen");
        return false;
      }

      // Rechnungs-ID finden, falls verfügbar
      const { data: invoice } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      if (!invoice?.invoice_id) {
        throw new Error("Keine Rechnung für diesen Auftrag gefunden");
      }

      // Edge Function zum Senden der XRechnung-E-Mail aufrufen
      const { data, error } = await supabase.functions.invoke('send-xrechnung-email', {
        body: {
          invoiceId: invoice.invoice_id,
          preview
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.message || "Fehler beim Versenden der XRechnung");
      }
      
      // Erfolg anzeigen
      toast({
        title: preview ? "XRechnung-Vorschau versendet" : "XRechnung versendet",
        description: preview ? 
          "Die XRechnung-Vorschau wurde erfolgreich an die Testadresse versendet." : 
          "Die XRechnung wurde erfolgreich an die Behörde versendet."
      });
      
      return true;
    } catch (error) {
      console.error("Fehler beim Senden der XRechnung-E-Mail:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung konnte nicht versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Sendet automatisch eine XRechnung, wenn der Empfänger eine Behörde ist
   */
  autoSendXRechnungIfGovernment: async (
    orderId: string, 
    email: string, 
    recipientName: string
  ): Promise<boolean> => {
    if (xRechnungService.isGovernmentAgency(email)) {
      return await xRechnungService.sendXRechnungEmail(orderId, email, recipientName);
    }
    return false;
  },
  
  /**
   * Sendet eine Vorschau der XRechnung an eine interne Test-E-Mail
   */
  sendXRechnungPreview: async (
    orderId: string
  ): Promise<boolean> => {
    try {
      // Find invoice ID if available
      const { data: invoice } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      if (!invoice?.invoice_id) {
        throw new Error("Keine Rechnung für diesen Auftrag gefunden");
      }

      // Edge Function zum Senden der XRechnung-Vorschau aufrufen
      const { data, error } = await supabase.functions.invoke('send-xrechnung-email', {
        body: {
          invoiceId: invoice.invoice_id,
          preview: true
        }
      });
      
      if (error) throw error;
      
      // Erfolg anzeigen
      toast({
        title: "XRechnung-Vorschau versendet",
        description: "Die XRechnung-Vorschau wurde erfolgreich an die Testadresse versendet."
      });
      
      return true;
    } catch (error) {
      console.error("Fehler beim Senden der XRechnung-Vorschau:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung-Vorschau konnte nicht versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  }
};
