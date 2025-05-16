
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { trustService } from "@/services/trustService";
import { useToast } from "@/hooks/use-toast";

const TrustScoreAdminPanel = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [updatedCount, setUpdatedCount] = useState<number | null>(null);
  const { toast } = useToast();

  const handleRecalculateAllScores = async () => {
    try {
      setIsRecalculating(true);
      setUpdatedCount(null);
      
      const count = await trustService.recalculateAllScores();
      
      setUpdatedCount(count);
      toast({
        title: "Trust Scores aktualisiert",
        description: `${count} Nutzer-Scores wurden neu berechnet.`
      });
    } catch (error) {
      console.error("Error recalculating scores:", error);
      toast({
        title: "Fehler beim Aktualisieren",
        description: "Trust Scores konnten nicht aktualisiert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Score Management</CardTitle>
        <CardDescription>
          Neu berechnen oder Status der Trust Scores anzeigen
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Trust Scores werden automatisch aktualisiert, wenn sich Bewertungen, Verifizierungsstatus oder Auftragsabschlüsse ändern.
            In manchen Fällen kann eine manuelle Neuberechnung für alle Nutzer nötig sein.
          </p>
        </div>
        
        {updatedCount !== null && (
          <div className="p-3 bg-green-50 text-green-800 rounded-lg mb-4">
            <p className="text-sm">{updatedCount} Nutzer-Scores wurden aktualisiert</p>
          </div>
        )}
        
        <div className="p-3 bg-amber-50 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Hinweis zur Konflikt-Bewertung:</p>
            <p>Die "disputes"-Tabelle existiert noch nicht. Die Konfliktbewertung wird erst aktiv, sobald diese Tabelle erstellt wurde.</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button
          onClick={handleRecalculateAllScores}
          disabled={isRecalculating}
          className="flex items-center gap-2"
        >
          {isRecalculating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Berechne...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Alle Scores neu berechnen
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrustScoreAdminPanel;
