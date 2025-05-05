
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { AlertCircle } from "lucide-react";
import { DriverIDVerification } from "./DriverIDVerification";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function DriverApplication() {
  const { user, profile, refreshProfile } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyDriver = async () => {
    try {
      setIsApplying(true);
      const { error } = await supabase
        .from('profiles')
        .update({ 
          can_become_driver: true 
        })
        .eq('user_id', profile?.user_id);

      if (error) throw error;

      await refreshProfile?.();
      toast({
        title: "Anfrage gesendet",
        description: "Deine Anfrage wurde erfolgreich gesendet. Wir werden sie überprüfen."
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Deine Anfrage konnte nicht gesendet werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (!profile) return null;
  if (profile.role === 'driver') return null;

  const hasRequestedDriver = profile.can_become_driver;
  const isVerified = profile.id_photo_verified;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Als Fahrer bewerben</CardTitle>
          <CardDescription>
            Werde Fahrer bei Whatsgonow und verdiene Geld mit Transporten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isVerified ? (
            <Alert className="bg-green-50 border-green-200 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <AlertTitle className="text-green-800">Identität verifiziert</AlertTitle>
                  <AlertDescription className="text-green-700 text-sm">
                    Deine Identität wurde erfolgreich verifiziert. Du kannst jetzt Fahrer werden.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <AlertTitle className="text-amber-800">ID-Verifizierung erforderlich</AlertTitle>
                  <AlertDescription className="text-amber-700 text-sm">
                    Bevor du Fahrer werden kannst, musst du deine Identität mit einem gültigen Ausweis verifizieren.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          
          <p className="mb-4">
            Als Fahrer bei Whatsgonow kannst du flexibel arbeiten und eigene Transportaufträge annehmen.
            Du entscheidest selbst, wann und wo du verfügbar bist.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-500 text-sm">✓</span>
              </div>
              <p className="text-sm">Wähle deine Strecken selbst</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-500 text-sm">✓</span>
              </div>
              <p className="text-sm">Flexible Arbeitszeiten</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-500 text-sm">✓</span>
              </div>
              <p className="text-sm">Attraktive Vergütung pro Transport</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleApplyDriver}
            disabled={hasRequestedDriver || !isVerified || isApplying}
            className="w-full"
          >
            {isApplying ? 'Wird bearbeitet...' : 
             hasRequestedDriver ? 'Anfrage in Bearbeitung' : 
             !isVerified ? 'Identität verifizieren erforderlich' : 
             'Jetzt bewerben'}
          </Button>
        </CardFooter>
      </Card>
      
      {!isVerified && <DriverIDVerification />}
    </div>
  );
}
