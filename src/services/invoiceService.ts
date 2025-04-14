
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import { prepareInvoiceData, generateXRechnungXML, stringToBlob } from '@/utils/invoiceGenerator';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

export const invoiceService = {
  // Generate PDF invoice as blob
  generatePDF: async (orderId: string): Promise<Blob> => {
    try {
      const invoiceData = await prepareInvoiceData(orderId);
      const pdfBlob = await pdf(InvoicePDF({ data: invoiceData })).toBlob();
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF invoice:", error);
      throw new Error("Fehler bei der Erstellung der PDF-Rechnung");
    }
  },

  // Generate XRechnung XML as blob
  generateXML: async (orderId: string): Promise<Blob> => {
    try {
      const invoiceData = await prepareInvoiceData(orderId);
      const xmlContent = generateXRechnungXML(invoiceData);
      return stringToBlob(xmlContent, 'application/xml');
    } catch (error) {
      console.error("Error generating XML invoice:", error);
      throw new Error("Fehler bei der Erstellung der XML-Rechnung");
    }
  },

  // Download PDF invoice
  downloadPDFInvoice: async (orderId: string, filename: string = "rechnung.pdf") => {
    try {
      const pdfBlob = await invoiceService.generatePDF(orderId);
      
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
      
      toast({
        title: "Erfolg",
        description: "Die Rechnung wurde heruntergeladen."
      });
      
      return true;
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  // Download XML invoice (XRechnung)
  downloadXMLInvoice: async (orderId: string, filename: string = "rechnung.xml") => {
    try {
      const xmlBlob = await invoiceService.generateXML(orderId);
      
      // Create URL for the blob
      const blobUrl = URL.createObjectURL(xmlBlob);
      
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
      
      toast({
        title: "Erfolg",
        description: "Die XML-Rechnung wurde heruntergeladen."
      });
      
      return true;
    } catch (error) {
      console.error("Error downloading XML invoice:", error);
      toast({
        title: "Fehler",
        description: "Die XML-Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  // Upload invoice to Supabase Storage
  storeInvoice: async (orderId: string): Promise<{ pdfPath: string; xmlPath: string } | null> => {
    try {
      const pdfBlob = await invoiceService.generatePDF(orderId);
      const xmlBlob = await invoiceService.generateXML(orderId);
      
      const pdfFilename = `invoice-${orderId}.pdf`;
      const xmlFilename = `invoice-${orderId}.xml`;
      
      // Upload PDF to 'invoices' bucket
      const { data: pdfData, error: pdfError } = await supabase.storage
        .from('invoices')
        .upload(pdfFilename, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (pdfError) throw pdfError;
      
      // Upload XML to 'invoices' bucket
      const { data: xmlData, error: xmlError } = await supabase.storage
        .from('invoices')
        .upload(xmlFilename, xmlBlob, {
          contentType: 'application/xml',
          upsert: true
        });
      
      if (xmlError) throw xmlError;
      
      return {
        pdfPath: pdfData.path,
        xmlPath: xmlData.path
      };
    } catch (error) {
      console.error("Error storing invoice:", error);
      return null;
    }
  },

  // Send invoice via email
  sendInvoiceEmail: async (orderId: string, email: string): Promise<boolean> => {
    try {
      // Generate the PDF and XML
      const pdfBlob = await invoiceService.generatePDF(orderId);
      const xmlBlob = await invoiceService.generateXML(orderId);
      const invoiceData = await prepareInvoiceData(orderId);
      
      // Convert blobs to base64
      const pdfBase64 = await blobToBase64(pdfBlob);
      const xmlBase64 = await blobToBase64(xmlBlob);
      
      if (!pdfBase64 || !xmlBase64) {
        throw new Error("Failed to convert files to base64");
      }
      
      // Call Supabase Edge Function to send email with attachments
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          orderId,
          email,
          invoiceNumber: invoiceData.invoiceNumber,
          pdfBase64,
          xmlBase64,
          customer: invoiceData.recipient.name,
          amount: invoiceData.total.toFixed(2),
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Die Rechnung wurde per E-Mail versendet."
      });
      
      return true;
    } catch (error) {
      console.error("Error sending invoice email:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht per E-Mail versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  // Handle automatic invoice generation after delivery confirmation
  handleAutoInvoice: async (orderId: string, userId: string): Promise<void> => {
    try {
      // Store invoice in Supabase Storage
      const storagePaths = await invoiceService.storeInvoice(orderId);
      
      if (!storagePaths) {
        console.error("Failed to store invoice");
        return;
      }
      
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
      
      // Send invoice to user's email
      await invoiceService.sendInvoiceEmail(orderId, userData.email);
      
      // Log invoice generation
      await supabase
        .from('delivery_logs')
        .insert({
          order_id: orderId,
          user_id: userId,
          action: 'invoice_generated',
        });
      
    } catch (error) {
      console.error("Error handling automatic invoice:", error);
    }
  }
};

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1] || null;
      resolve(base64data);
    };
    reader.readAsDataURL(blob);
  });
};
