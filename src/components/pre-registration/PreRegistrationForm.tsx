
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
import { supabase } from "@/lib/supabaseClient";

export function PreRegistrationForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
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
      // Get session token instead of using hardcoded anon key
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      console.log("Sending data to pre-register endpoint with auth token");
      
      const response = await fetch("https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken || ""}`
        },
        body: JSON.stringify(data)
      });
      
      // Improved error handling
      if (!response.ok) {
        // Try to parse error response
        let errorMessage;
        try {
          const errorData = await response.json();
          console.error("Pre-registration error response:", errorData);
          
          if (errorData.errors) {
            Object.entries(errorData.errors).forEach(([field, message]) => {
              form.setError(field as any, {
                message: message as string
              });
            });
            throw new Error("Validation failed");
          }
          errorMessage = errorData.error || t("errors.registration_failed");
        } catch (parseError) {
          // If we can't parse JSON, use the text
          const errorText = await response.text();
          console.error("Pre-registration error text:", errorText);
          errorMessage = t("errors.registration_failed");
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log("Pre-registration success:", result);
      
      toast.success(t("pre_register.success.title"), {
        description: t("pre_register.success.description")
      });

      // Use React Router's navigate instead of window.location.href for client-side navigation
      navigate("/pre-register/success", { replace: true });
    } catch (error) {
      console.error("Pre-registration error:", error);
      setIsSubmitting(false);
      
      if (!(error instanceof Error && error.message === "Validation failed")) {
        toast.error(t("errors.registration_failed"), {
          description: error instanceof Error ? error.message : t("common.retry")
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
                <FormLabel>{t("pre_register.first_name")}</FormLabel>
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
                <FormLabel>{t("pre_register.last_name")}</FormLabel>
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
              <FormLabel>{t("pre_register.email")}</FormLabel>
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
              <FormLabel>{t("pre_register.postal_code")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Label>{t("pre_register.register_as")}</Label>
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
                    {t("pre_register.driver")}
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
                    {t("pre_register.cm")}
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
                    {t("pre_register.sender")}
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
              <p className="text-sm text-red-500">{t("errors.vehicle_required")}</p>
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
                  {t("pre_register.gdpr_consent")}
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!form.formState.isValid || isSubmitting}
        >
          {isSubmitting ? t("pre_register.processing") : t("pre_register.submit")}
        </Button>
      </form>
    </Form>
  );
}
