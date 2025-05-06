
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useFileUploader } from "@/hooks/file-upload/useFileUploader";
import { ItemDetails, useItemDetails } from "@/hooks/useItemDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, Image, X } from "lucide-react";

interface ItemDetailsUploadProps {
  onSaveItem?: (item: ItemDetails) => void;
  orderId?: string;
}

export const ItemDetailsUpload: React.FC<ItemDetailsUploadProps> = ({
  onSaveItem,
  orderId
}) => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { uploadFile, isUploading } = useFileUploader({ 
    bucketName: 'order-items' 
  });
  
  const { 
    itemData, 
    updateItemField, 
    setImageUrl, 
    resetForm, 
    saveItem,
    isSubmitting 
  } = useItemDetails();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Prüfung der Dateigröße und des Formats
    if (file.size > 2 * 1024 * 1024) {
      alert("Die Datei darf maximal 2 MB groß sein");
      return;
    }
    
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Nur JPEG, PNG oder WEBP sind erlaubt");
      return;
    }
    
    // Vorschau erstellen
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Datei hochladen
    const imageUrl = await uploadFile(file, user.id);
    if (imageUrl) {
      setImageUrl(imageUrl);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderId) {
      const success = await saveItem(orderId);
      if (success && onSaveItem) {
        onSaveItem(itemData);
      }
    } else if (onSaveItem) {
      onSaveItem(itemData);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Artikeldetails</h3>
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Artikelname*
                </label>
                <Input
                  id="title"
                  placeholder="z.B. Sofa"
                  value={itemData.title}
                  onChange={(e) => updateItemField("title", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Beschreibung (optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Beschreiben Sie den Artikel genauer..."
                  value={itemData.description || ""}
                  onChange={(e) => updateItemField("description", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artikelbild (optional)
                </label>
                
                {!imagePreview ? (
                  <div 
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={handleFileSelect}
                  >
                    <Image className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Klicken Sie, um ein Bild hochzuladen</p>
                    <p className="text-xs text-gray-400">JPG, PNG oder WEBP, max. 2 MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Vorschau" 
                      className="max-h-64 rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting || isUploading}
              >
                Zurücksetzen
              </Button>
              
              <Button 
                type="submit"
                disabled={isSubmitting || isUploading || !itemData.title}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Artikel speichern
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
