
import { useState, useRef } from "react";
import { useUploadHandler } from "../useUploadHandler";
import { v4 as uuidv4 } from "uuid";

export function useFileUpload() {
  const [previews, setPreviews] = useState<(string | ArrayBuffer)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionId = uuidv4();

  // Simplify uploadHandler to avoid repeating the session ID
  const { uploadFile, isUploading, currentProgress, error } = useUploadHandler({
    sessionId,
    onProgress: (progress) => console.log("Upload progress:", progress),
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create URL previews for each file
    const previewUrls: (string | ArrayBuffer)[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviews((prev) => [...prev, reader.result as string | ArrayBuffer]);
          previewUrls.push(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Update the uploadFiles function to only accept files parameter
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    try {
      // Upload each file and collect the URLs
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      console.error("Error uploading files:", error);
      return [];
    }
  };

  return {
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    previews,
    uploadFiles,
    isUploading,
    currentProgress,
    error,
  };
}
