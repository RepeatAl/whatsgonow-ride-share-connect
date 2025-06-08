
// src/components/ImageUploader.tsx
import { ChangeEvent, useState } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  onUploadComplete: (publicUrl: string) => void;
}

export default function ImageUploader({ onUploadComplete }: Props) {
  const { user } = useOptimizedAuth();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Max. 2 MB pro Datei
    if (file.size > 2 * 1024 * 1024) {
      setError("Datei darf maximal 2 MB groß sein.");
      return;
    }
    // Erlaubte MIME‑Typen
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Nur JPEG, PNG oder WEBP sind erlaubt.");
      return;
    }

    setError(null);
    setUploading(true);

    // FIXED: Eindeutige Dateinamen generieren um Konflikte zu vermeiden
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${user.id}/${uniqueFileName}`;

    const { data, error: uploadError } = await supabase
      .storage
      .from("items-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        metadata: {
          user_id: user.id,
          published: "true", // FIXED: Direkt als published markieren für Sichtbarkeit
          uploaded_at: new Date().toISOString()
        },
      });

    setUploading(false);

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      setError("Upload fehlgeschlagen: " + uploadError.message);
      return;
    }

    // FIXED: Bessere URL-Generierung mit Fehlerbehandlung
    const { data: urlData } = supabase
      .storage
      .from("items-images")
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      console.error("Could not get public URL for path:", data.path);
      setError("Kann URL nicht abrufen.");
      return;
    }

    console.log("✅ Image uploaded successfully:", urlData.publicUrl);
    onUploadComplete(urlData.publicUrl);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Artikelbild hochladen (max. 2 MB)
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Hochladen...</p>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
