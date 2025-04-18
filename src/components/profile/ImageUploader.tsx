
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ImageUploaderProps {
  userId: string;
  onSuccess: (url: string) => void;
  onCancel: () => void;
  open: boolean;
}

export default function ImageUploader({ userId, onSuccess, onCancel, open }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        setError("Datei darf maximal 2 MB groß sein.");
        toast({ title: "Fehler", description: "Datei darf maximal 2 MB groß sein.", variant: "destructive" });
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Nur JPEG, PNG oder WEBP sind erlaubt.");
        toast({ title: "Fehler", description: "Nur JPEG, PNG oder WEBP sind erlaubt.", variant: "destructive" });
        return;
      }

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
        .from("users")
        .update({ avatar_url: urlData.publicUrl })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      toast({ title: "Erfolg", description: "Profilbild wurde aktualisiert." });
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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profilbild hochladen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="text-sm text-muted-foreground">
            Wähle ein Bild (max. 2 MB, JPEG/PNG/WEBP)
          </div>
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel} disabled={uploading}>
              Abbrechen
            </Button>
            {uploading && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lädt...
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
