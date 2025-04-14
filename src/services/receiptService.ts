
import { pdf } from '@react-pdf/renderer';
import DeliveryReceipt from '@/components/pdf/DeliveryReceipt';
import { prepareReceiptData } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const receiptService = {
  // Generate PDF as blob from order data
  generatePDF: async (orderId: string): Promise<Blob> => {
    try {
      const receiptData = await prepareReceiptData(orderId);
      // Fix: Use createElement instead of JSX to create PDF component
      const pdfBlob = await pdf(DeliveryReceipt({ data: receiptData })).toBlob();
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Fehler bei der Erstellung der PDF-Quittung");
    }
  },

  // Download PDF receipt
  downloadReceipt: async (orderId: string, filename: string = "quittung.pdf") => {
    try {
      const pdfBlob = await receiptService.generatePDF(orderId);
      
      // Create URL for the blob
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      
      // Append to the document and trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
      return true;
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast({
        title: "Fehler",
        description: "Die Quittung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  // Send receipt via email
  sendReceiptEmail: async (orderId: string, email: string): Promise<boolean> => {
    try {
      // Generate the PDF
      const pdfBlob = await receiptService.generatePDF(orderId);
      
      // Convert blob to base64
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64data = reader.result?.toString().split(',')[1];
            
            if (!base64data) {
              throw new Error("Failed to convert PDF to base64");
            }
            
            // Call Supabase Edge Function to send email with PDF
            const { data, error } = await supabase.functions.invoke('send-receipt-email', {
              body: {
                orderId,
                email,
                pdfBase64: base64data,
                filename: `Quittung-${orderId}.pdf`
              }
            });
            
            if (error) throw error;
            
            toast({
              title: "Erfolgreich",
              description: "PDF-Quittung wurde per E-Mail versendet",
            });
            
            resolve(true);
          } catch (err) {
            console.error("Error sending email:", err);
            reject(err);
          }
        };
        reader.onerror = () => {
          reject(new Error("Failed to read PDF file"));
        };
        reader.readAsDataURL(pdfBlob);
      });
    } catch (error) {
      console.error("Error in sendReceiptEmail:", error);
      toast({
        title: "Fehler",
        description: "Die Quittung konnte nicht per E-Mail versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  // Handle automatic receipt generation after delivery confirmation
  handleAutoReceipt: async (orderId: string, userId: string): Promise<void> => {
    try {
      // In a real app, get user email from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('user_id', userId)
        .single();
      
      if (userError || !userData) {
        console.error("Error fetching user email:", userError);
        return;
      }
      
      // Send receipt to user's email
      await receiptService.sendReceiptEmail(orderId, userData.email);
      
      // Log receipt generation
      await supabase
        .from('delivery_logs')
        .insert({
          order_id: orderId,
          user_id: userId,
          action: 'receipt_generated',
        });
      
    } catch (error) {
      console.error("Error handling automatic receipt:", error);
    }
  }
};
