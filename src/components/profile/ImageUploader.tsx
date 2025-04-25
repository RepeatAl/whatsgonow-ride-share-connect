
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Upload, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ImageUploaderProps {
  userId: string;
  onSuccess: (url: string) => void;
  onCancel: () => void;
  open: boolean;
  currentImage?: string | null;
}

export default function ImageUploader({ userId, onSuccess, onCancel, open, currentImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      setError("Datei darf maximal 2 MB groß sein.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Nur JPEG, PNG oder WEBP sind erlaubt.");
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Bitte wähle zuerst ein Bild aus.");
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      console.log("Uploading profile image:", fileName);
      
      const { error: uploadError, data } = await supabase
        .storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        console.error("Could not get public URL");
        throw new Error("Konnte URL nicht abrufen");
      }

      console.log("Image uploaded successfully, URL:", urlData.publicUrl);

      // Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      toast({ 
        title: "Erfolgreich", 
        description: "Dein Profilbild wurde aktualisiert." 
      });
      
      onSuccess(urlData.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Unbekannter Fehler beim Upload");
      toast({ 
        title: "Fehler", 
        description: "Profilbild konnte nicht hochgeladen werden.", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const reset = () => {
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profilbild hochladen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Preview current or selected image */}
            <Avatar className="w-32 h-32 border-2 border-dashed border-gray-300 p-1">
              <AvatarImage 
                src={imagePreview || currentImage || undefined} 
                alt="Avatar preview" 
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {imagePreview && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={reset}
                >
                  <X className="h-4 w-4 mr-1" /> Zurücksetzen
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpload} 
                  disabled={uploading}
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Lädt...</>
                  ) : (
                    <><Check className="h-4 w-4 mr-1" /> Speichern</>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-md p-4">
            <div className="text-sm text-muted-foreground mb-2">
              Wähle ein Bild (max. 2 MB, JPEG/PNG/WEBP)
            </div>
            
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1"
                id="avatar-upload"
              />
              
              {!imagePreview && (
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-1" /> Auswählen
                </Button>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={uploading}>
            Abbrechen
          </Button>
          
          {!imagePreview && (
            <Button 
              onClick={handleUpload} 
              disabled={!fileInputRef.current?.files?.length || uploading}
            >
              {uploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lädt...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Hochladen</>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
