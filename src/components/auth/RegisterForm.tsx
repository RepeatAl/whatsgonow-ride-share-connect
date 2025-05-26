
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

export const RegisterForm = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { signUp } = useSimpleAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !firstName || !lastName) {
      setError(t("auth:validation.all_fields_required", "Alle Felder sind erforderlich"));
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || t("auth:error.register_failed", "Registrierung fehlgeschlagen"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("auth:first_name", "Vorname")}
              </label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("auth:first_name_placeholder", "Max")}
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("auth:last_name", "Nachname")}
              </label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("auth:last_name_placeholder", "Mustermann")}
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth:email", "E-Mail")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth:email_placeholder", "ihre@email.com")}
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth:password", "Passwort")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("auth:registering", "Registrieren...")}
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
