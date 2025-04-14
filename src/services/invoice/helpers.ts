
import { toast } from "@/hooks/use-toast";

/**
 * Helper function to convert Blob to base64
 */
export const blobToBase64 = (blob: Blob): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1] || null;
      resolve(base64data);
    };
    reader.readAsDataURL(blob);
  });
};

/**
 * Helper function to create and trigger a download for a blob
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create URL for the blob
  const blobUrl = URL.createObjectURL(blob);
  
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
    description: `Die Datei wurde heruntergeladen.`
  });
};
