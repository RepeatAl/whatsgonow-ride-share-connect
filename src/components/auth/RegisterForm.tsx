
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

export const RegisterForm = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { signUp, loading } = useOptimizedAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    region: "",
    postalCode: "",
    city: "",
    role: "",
    gdprConsent: false
  });
  
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const isLoading = loading || formLoading;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    
    if (!formData.region) {
      setError("Bitte wähle deine Region aus.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    
    if (!formData.role) {
      setError("Bitte wähle deine Rolle aus.");
      return;
    }
    
    if (!formData.gdprConsent) {
      setError("Bitte stimme den Datenschutzbestimmungen zu.");
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      
      const metadata = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        region: formData.region,
        postal_code: formData.postalCode,
        city: formData.city,
        role: formData.role
      };

      await signUp(formData.email, formData.password, metadata);
      
      // Success message will be shown by the auth context
      console.log("Registration successful");
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Bei der Registrierung ist ein Fehler aufgetreten.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("auth:register", "Registrieren")}</CardTitle>
        <CardDescription>
          {t("auth:register_description", "Erstelle dein kostenloses Konto")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Vorname *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nachname *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-Mail-Adresse *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Passwort *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="region">Region *</Label>
            <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Wähle deine Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutschland</SelectItem>
                <SelectItem value="at">Österreich</SelectItem>
                <SelectItem value="ch">Schweiz</SelectItem>
                <SelectItem value="nl">Niederlande</SelectItem>
                <SelectItem value="be">Belgien</SelectItem>
                <SelectItem value="fr">Frankreich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">PLZ</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="city">Stadt</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role">Ich möchte mich registrieren als *</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Wähle deine Rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sender_private">Privater Auftraggeber</SelectItem>
                <SelectItem value="sender_business">Business Auftraggeber</SelectItem>
                <SelectItem value="driver">Fahrer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="gdprConsent"
              checked={formData.gdprConsent}
              onCheckedChange={(checked) => handleInputChange("gdprConsent", !!checked)}
              disabled={isLoading}
            />
            <Label htmlFor="gdprConsent" className="text-sm">
              Ich stimme den Datenschutzbestimmungen zu *
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird registriert...
              </>
            ) : (
              t("auth:register", "Registrieren")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
