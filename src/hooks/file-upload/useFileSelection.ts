
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { validateFile } from "./fileValidation";
import { MAX_FILES } from "./constants";

export const useFileSelection = (updatePreviews?: (urls: string[]) => void) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (selectedFiles.length >= MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        newFiles.push(files[i]);
      }
    }

    addFiles(newFiles);
    
    // Create object URLs and update previews if the function is provided
    if (updatePreviews) {
      const urls = newFiles.map(file => URL.createObjectURL(file));
      updatePreviews(urls);
    }
    
    // Reset the input
    e.target.value = '';
  };

  const handleCapture = (file: File, url: string) => {
    addFiles([file]);
    if (updatePreviews) {
      updatePreviews([url]);
    }
  };

  const addFiles = (newFiles: File[]) => {
    setSelectedFiles(prevFiles => {
      const combinedFiles = [...prevFiles];
      newFiles.forEach(file => {
        if (combinedFiles.length < MAX_FILES) {
          combinedFiles.push(file);
        } else {
          toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
        }
      });
      return combinedFiles.slice(0, MAX_FILES);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return {
    selectedFiles,
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    addFiles,
    removeFile
  };
};
