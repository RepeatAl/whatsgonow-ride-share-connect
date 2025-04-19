
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { preRegistrationSchema, type PreRegistrationFormData } from "@/lib/validators/pre-registration";
import { VehicleTypeSelector } from "./VehicleTypeSelector";

export function PreRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PreRegistrationFormData>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      postal_code: "",
      wants_driver: false,
      wants_cm: false,
      wants_sender: false,
      vehicle_types: [],
      gdpr_consent: false,
    }
  });

  const wantsDriver = form.watch("wants_driver");

  const onSubmit = async (data: PreRegistrationFormData) => {
    console.log("Form data on submit:", data);
    setIsSubmitting(true);
    try {
      const response = await fetch("https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            form.setError(field as any, {
              message: message as string
            });
          });
          throw new Error("Validation failed");
        }
        throw new Error(result.error || "Registration failed");
      }
      toast({
        title: "Voranmeldung erfolgreich!",
        description: "Wir informieren dich, sobald whatsgonow live geht."
      });

      window.location.href = "/pre-register/success";
    } catch (error) {
      if (!(error instanceof Error && error.message === "Validation failed")) {
        toast({
          title: "Fehler bei der Registrierung",
          description: "Bitte versuche es später erneut.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postleitzahl</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Label>Registrieren als</Label>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="wants_driver"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      id="wants_driver"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="wants_driver" className="font-normal">
                    Fahrer
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wants_cm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      id="wants_cm"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="wants_cm" className="font-normal">
                    Community Manager
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wants_sender"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      id="wants_sender"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="wants_sender" className="font-normal">
                    Versender
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {wantsDriver && (
          <div className="space-y-2">
            <VehicleTypeSelector control={form.control} />
            {form.formState.errors.vehicle_types && (
              <p className="text-sm text-red-500">{form.formState.errors.vehicle_types.message}</p>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="gdpr_consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox 
                  id="gdpr_consent"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="gdpr_consent" className="font-normal">
                  Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Wird verarbeitet..." : "Jetzt vorregistrieren"}
        </Button>
      </form>
    </Form>
  );
}
