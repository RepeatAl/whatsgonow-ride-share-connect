
import React, { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  children: React.ReactNode;
  accept?: string;
  maxSize?: number; // In MB
}

export function FileUploader({ onFileSelected, children, accept, maxSize = 10 }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (maxSize && fileSizeMB > maxSize) {
      toast({
        title: "Datei zu groß",
        description: `Die maximale Dateigröße beträgt ${maxSize} MB.`,
        variant: "destructive"
      });
      return;
    }
    
    onFileSelected(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      
      // Check if file type matches any of the accepted types
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const mainType = type.split('/')[0];
          return fileType.startsWith(mainType);
        }
        return type === fileType;
      });
      
      if (!isAccepted) {
        toast({
          title: "Ungültiger Dateityp",
          description: `Bitte wähle eine Datei vom Typ: ${accept}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (maxSize && fileSizeMB > maxSize) {
      toast({
        title: "Datei zu groß",
        description: `Die maximale Dateigröße beträgt ${maxSize} MB.`,
        variant: "destructive"
      });
      return;
    }
    
    onFileSelected(file);
  };

  return (
    <div
      className={`relative ${isDragging ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
      />
      {children}
    </div>
  );
}
