
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

export const RegisterForm = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { signUp, loading } = useSimpleAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
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
        postal_code: formData.postalCode,
        city: formData.city,
        role: formData.role
      };
      
      await signUp(formData.email, formData.password, metadata);
      
      // Redirect wird vom Auth-Hook gehandhabt
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registrierung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {t("auth:register", "Registrieren")}
        </CardTitle>
        <CardDescription className="text-center">
          Erstelle dein Whatsgonow-Konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Vorname *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nachname *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={isLoading}
            />
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
            <Label htmlFor="role">Rolle *</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Wähle deine Rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sender_private">Privater Sender</SelectItem>
                <SelectItem value="sender_business">Geschäftlicher Sender</SelectItem>
                <SelectItem value="driver">Fahrer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="password">Passwort *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gdprConsent"
              checked={formData.gdprConsent}
              onCheckedChange={(checked) => handleInputChange("gdprConsent", checked as boolean)}
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
                Registriere...
              </>
            ) : (
              "Registrieren"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
