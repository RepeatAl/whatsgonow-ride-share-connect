
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
 * 
 * WICHTIG: Alle Methoden dieses Services erwarten einen einzelnen Object-Parameter.
 * Beispiel: xRechnungService.sendXRechnungEmail({ orderId, email, recipientName })
 */
export const xRechnungService = {
  /**
   * Prüft, ob eine E-Mail-Adresse zu einer Behörde gehört
   * 
   * @param email - Die zu prüfende E-Mail-Adresse
   * @returns true, wenn die E-Mail-Adresse zu einer Behörde gehört, sonst false
   */
  isGovernmentAgency: (email: string): boolean => {
    if (!email) return false;
    
    const domain = email.substring(email.indexOf('@') + 1).toLowerCase();
    return GOVERNMENT_DOMAINS.some(govDomain => domain.endsWith(govDomain));
  },
  
  /**
   * Sendet eine XRechnung per E-Mail
   * 
   * @param params - Object mit den Parametern für die XRechnung
   * @param params.orderId - ID des Auftrags
   * @param params.email - E-Mail-Adresse des Empfängers
   * @param params.recipientName - Name des Empfängers
   * @returns Promise<boolean> - true bei Erfolg, false bei Fehler
   * 
   * @example
   * // Korrekter Aufruf mit Object-Parameter:
   * await xRechnungService.sendXRechnungEmail({
   *   orderId: '123',
   *   email: 'behoerde@example.de',
   *   recipientName: 'Musterbehörde'
   * });
   */
  sendXRechnungEmail: async ({
    orderId,
    email,
    recipientName
  }: {
    orderId: string, 
    email: string, 
    recipientName: string
  }): Promise<boolean> => {
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
   * 
   * @param params - Object mit den Parametern für die XRechnung-Vorschau
   * @param params.orderId - ID des Auftrags
   * @param params.email - E-Mail-Adresse des Empfängers
   * @param params.recipientName - Name des Empfängers
   * @returns Promise<boolean> - true bei Erfolg, false bei Fehler
   * 
   * @example
   * // Korrekter Aufruf mit Object-Parameter:
   * await xRechnungService.sendXRechnungPreview({
   *   orderId: '123',
   *   email: 'test@example.de',
   *   recipientName: 'Testempfänger'
   * });
   */
  sendXRechnungPreview: async ({
    orderId,
    email,
    recipientName
  }: {
    orderId: string, 
    email: string, 
    recipientName: string
  }): Promise<boolean> => {
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
   * 
   * @param params - Object mit den Parametern für die automatische XRechnung
   * @param params.orderId - ID des Auftrags
   * @param params.email - E-Mail-Adresse des Empfängers
   * @param params.recipientName - Name des Empfängers
   * @returns Promise<boolean> - true bei Erfolg, false bei Fehler
   * 
   * @example
   * // Korrekter Aufruf mit Object-Parameter:
   * await xRechnungService.autoSendXRechnungIfGovernment({
   *   orderId: '123',
   *   email: 'behoerde@berlin.de',
   *   recipientName: 'Senatsverwaltung'
   * });
   */
  autoSendXRechnungIfGovernment: async ({
    orderId,
    email,
    recipientName
  }: {
    orderId: string, 
    email: string, 
    recipientName: string
  }): Promise<boolean> => {
    // Prüfen, ob der Empfänger eine Behörde ist
    if (xRechnungService.isGovernmentAgency(email)) {
      try {
        return await xRechnungService.sendXRechnungEmail({
          orderId, 
          email, 
          recipientName
        });
      } catch (error) {
        console.error("Fehler beim automatischen Senden der XRechnung:", error);
        return false;
      }
    }
    
    return false;
  }
};
