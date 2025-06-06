
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileSelected: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelected,
  disabled = false,
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file && maxSize && file.size > maxSize) {
      alert(`Datei ist zu groß. Maximum: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    
    onFileSelected(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Datei auswählen
      </Button>
    </div>
  );
};
