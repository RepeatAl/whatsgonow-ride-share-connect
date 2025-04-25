
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/auth/useProfile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export function DriverApplication() {
  const { profile, refreshProfile } = useProfile();

  const handleApplyDriver = async () => {
    try {
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
    }
  };

  if (!profile || profile.role === 'driver') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Als Fahrer bewerben</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Möchtest du als Fahrer bei uns tätig werden? Beantrage hier deine Fahrerberechtigung.
        </p>
        <Button 
          onClick={handleApplyDriver}
          disabled={profile.can_become_driver}
        >
          {profile.can_become_driver ? 'Anfrage in Bearbeitung' : 'Jetzt bewerben'}
        </Button>
      </CardContent>
    </Card>
  );
}
