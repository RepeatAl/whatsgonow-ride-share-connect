
import { toast } from "sonner";

export interface UploadError {
  code: string;
  message: string;
  details?: any;
}

export const handleUploadError = (error: any): UploadError => {
  console.error("Upload error:", error);
  
  let uploadError: UploadError = {
    code: "UNKNOWN_ERROR",
    message: "Ein unbekannter Fehler ist aufgetreten"
  };

  if (error?.message) {
    if (error.message.includes("Duplicate")) {
      uploadError = {
        code: "DUPLICATE_FILE",
        message: "Eine Datei mit diesem Namen existiert bereits"
      };
    } else if (error.message.includes("too large")) {
      uploadError = {
        code: "FILE_TOO_LARGE", 
        message: "Die Datei ist zu groß (max. 2 MB)"
      };
    } else if (error.message.includes("Invalid mime type")) {
      uploadError = {
        code: "INVALID_TYPE",
        message: "Dateityp wird nicht unterstützt"
      };
    } else {
      uploadError.message = error.message;
    }
  }

  toast.error(uploadError.message);
  return uploadError;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(`.${extension}`, "");
  return `${nameWithoutExt}-${timestamp}.${extension}`;
};
