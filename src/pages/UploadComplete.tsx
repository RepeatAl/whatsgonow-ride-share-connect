
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function UploadComplete() {
  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            <Check className="h-5 w-5" />
            Upload abgeschlossen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Die Bilder wurden erfolgreich hochgeladen. Du kannst diese Seite jetzt schließen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
