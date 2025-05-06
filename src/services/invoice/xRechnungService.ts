
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

// Government domain patterns for automatic XRechnung detection
const GOVERNMENT_DOMAINS = [
  '.bund.de',
  '.bayern.de',
  '.berlin.de',
  '.brandenburg.de',
  '.bremen.de',
  '.hamburg.de',
  '.hessen.de',
  '.mv-regierung.de',
  '.niedersachsen.de',
  '.nrw.de',
  '.rlp.de',
  '.saarland.de',
  '.sachsen.de',
  '.sachsen-anhalt.de',
  '.schleswig-holstein.de',
  '.thueringen.de',
  '.bundeswehr.de',
];

/**
 * XRechnung Service für elektronischen Rechnungsaustausch mit Behörden
 */
export const xRechnungService = {
  /**
   * Prüft, ob eine E-Mail-Adresse zu einer Behörde gehört
   */
  isGovernmentAgency: (email: string): boolean => {
    if (!email) return false;
    
    const domain = email.substring(email.indexOf('@') + 1).toLowerCase();
    return GOVERNMENT_DOMAINS.some(govDomain => domain.endsWith(govDomain));
  },
  
  /**
   * Sendet eine XRechnung per E-Mail
   */
  sendXRechnungEmail: async (
    orderId: string, 
    email: string, 
    recipientName: string
  ): Promise<boolean> => {
    try {
      if (!orderId || !email) {
        throw new Error("Auftrags-ID und E-Mail-Adresse sind erforderlich");
      }
      
      const { data, error } = await supabase.functions.invoke('send-xrechnung-email', {
        body: {
          orderId,
          email,
          recipientName,
          isTest: false
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Die XRechnung wurde per E-Mail versendet."
      });
      
      return true;
    } catch (error) {
      console.error("Fehler beim Senden der XRechnung:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung konnte nicht versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  },
  
  /**
   * Sendet eine XRechnung-Vorschau per E-Mail
   */
  sendXRechnungPreview: async (
    orderId: string, 
    email: string, 
    recipientName: string
  ): Promise<boolean> => {
    try {
      if (!orderId || !email) {
        throw new Error("Auftrags-ID und E-Mail-Adresse sind erforderlich");
      }
      
      const { data, error } = await supabase.functions.invoke('send-xrechnung-email', {
        body: {
          orderId,
          email,
          recipientName,
          isTest: true
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Die XRechnung-Vorschau wurde per E-Mail versendet."
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
  },
  
  /**
   * Sendet automatisch eine XRechnung, wenn der Empfänger eine Behörde ist
   */
  autoSendXRechnungIfGovernment: async (
    orderId: string, 
    email: string, 
    recipientName: string
  ): Promise<boolean> => {
    // Prüfen, ob der Empfänger eine Behörde ist
    if (xRechnungService.isGovernmentAgency(email)) {
      try {
        return await xRechnungService.sendXRechnungEmail(
          orderId, 
          email, 
          recipientName
        );
      } catch (error) {
        console.error("Fehler beim automatischen Senden der XRechnung:", error);
        return false;
      }
    }
    
    return false;
  }
};
