
import { useState, useRef } from "react";
import { toast } from "sonner";
import { validateFile } from "./fileValidation";
import { MAX_FILES } from "./constants";

export const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (selectedFiles.length >= MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }
    fileInputRef.current?.click();
  };

  const addFiles = (newFiles: File[]) => {
    setSelectedFiles(prev => {
      const validFiles = newFiles.filter(validateFile);
      const newFileList = [...prev];
      validFiles.forEach(file => {
        const nextEmptySlot = newFileList.findIndex(f => !f);
        if (nextEmptySlot !== -1) {
          newFileList[nextEmptySlot] = file;
        } else {
          newFileList.push(file);
        }
      });
      return newFileList.slice(0, MAX_FILES);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles[index] = undefined;
    setSelectedFiles(newFiles.filter(Boolean));
  };

  return {
    selectedFiles,
    fileInputRef,
    handleFileSelect,
    addFiles,
    removeFile
  };
};
