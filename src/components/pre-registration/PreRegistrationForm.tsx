
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { preRegistrationSchema, type PreRegistrationFormData } from "@/lib/validators/pre-registration";
import { VehicleTypeSelector } from "./VehicleTypeSelector";
import { supabase } from "@/lib/supabaseClient";

export function PreRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<PreRegistrationFormData>({
    resolver: zodResolver(preRegistrationSchema)
  });

  const wantsDriver = watch("wants_driver");

  const onSubmit = async (data: PreRegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.auth.anon}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Apply server-side validation errors to form
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as any, { message: message as string });
          });
          throw new Error("Validation failed");
        }
        throw new Error(result.error || "Registration failed");
      }

      toast({
        title: "Voranmeldung erfolgreich!",
        description: "Wir informieren dich, sobald whatsgonow live geht.",
      });

      // Redirect to success page
      window.location.href = "/pre-register/success";
    } catch (error) {
      if (!(error instanceof Error && error.message === "Validation failed")) {
        toast({
          title: "Fehler bei der Registrierung",
          description: "Bitte versuche es später erneut.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">Vorname</Label>
          <Input id="first_name" {...register("first_name")} />
          {errors.first_name && (
            <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="last_name">Nachname</Label>
          <Input id="last_name" {...register("last_name")} />
          {errors.last_name && (
            <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="postal_code">Postleitzahl</Label>
        <Input id="postal_code" {...register("postal_code")} />
        {errors.postal_code && (
          <p className="text-sm text-red-500 mt-1">{errors.postal_code.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Registrieren als</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="wants_driver" {...register("wants_driver")} />
            <Label htmlFor="wants_driver">Fahrer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="wants_cm" {...register("wants_cm")} />
            <Label htmlFor="wants_cm">Community Manager</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="wants_sender" {...register("wants_sender")} />
            <Label htmlFor="wants_sender">Versender</Label>
          </div>
        </div>
      </div>

      {wantsDriver && (
        <VehicleTypeSelector register={register} />
      )}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="gdpr_consent" {...register("gdpr_consent")} />
          <Label htmlFor="gdpr_consent">
            Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu
          </Label>
        </div>
        {errors.gdpr_consent && (
          <p className="text-sm text-red-500">{errors.gdpr_consent.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Wird verarbeitet..." : "Jetzt vorregistrieren"}
      </Button>
    </form>
  );
}
