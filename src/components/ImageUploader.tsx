
// src/components/ImageUploader.tsx
import { ChangeEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  onUploadComplete: (publicUrl: string) => void;
}

export default function ImageUploader({ onUploadComplete }: Props) {
  const { user } = useAuth();
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

    // Wir legen die Datei im Bucket unter /<user_id>/<originalName> ab
    const filePath = `${user.id}/${file.name}`;

    const { data, error: uploadError } = await supabase
      .storage
      .from("items-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        metadata: {
          user_id: user.id,        // <- hier setzt du dein user_id‑Feld
          published: "false",       // <- später kannst du das auf "true" schalten
        },
      });

    setUploading(false);

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      setError("Upload fehlgeschlagen.");
      return;
    }

    // Public URL holen – Benutzer sehen das Bild dann nur, wenn published = 'true'
    // Fix: The getPublicUrl method returns an object with a 'data' property that contains the publicUrl
    const { data: urlData } = supabase
      .storage
      .from("items-images")
      .getPublicUrl(data.path);

    if (!urlData) {
      console.error("Could not get public URL");
      setError("Kann URL nicht abrufen.");
      return;
    }

    onUploadComplete(urlData.publicUrl);
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Artikelbild hochladen (max. 2 MB)</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>⏳ Hochladen…</p>}
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
