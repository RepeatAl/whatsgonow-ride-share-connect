
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ProfileCompletion() {
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Split the name into first and last name for the form
  const nameParts = (profile?.name || "").split(" ");
  const initialFirstName = nameParts[0] || "";
  const initialLastName = nameParts.slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    first_name: initialFirstName,
    last_name: initialLastName,
    phone: profile?.phone || "",
    region: profile?.region || "",
    postal_code: profile?.postal_code || "",
    city: profile?.city || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("Du musst angemeldet sein, um dein Profil zu speichern.");
      setLoading(false);
      return;
    }

    try {
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          name: fullName,
          phone: formData.phone,
          region: formData.region,
          postal_code: formData.postal_code,
          city: formData.city,
          profile_complete: true
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await refreshProfile?.();
      toast({
        title: "Profil aktualisiert",
        description: "Dein Profil wurde erfolgreich vervollständigt."
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Dein Profil konnte nicht aktualisiert werden.");
      toast({
        title: "Fehler",
        description: "Dein Profil konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-500">Du musst angemeldet sein, um dein Profil zu vervollständigen.</p>
            <Button asChild className="mt-4">
              <Link to="/login">Zum Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profil vervollständigen</CardTitle>
        <CardDescription>
          Bitte vervollständige deine Angaben, um alle Funktionen nutzen zu können.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postleitzahl</Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Stadt</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <><LoadingSpinner /> Wird gespeichert...</>
            ) : "Profil speichern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
