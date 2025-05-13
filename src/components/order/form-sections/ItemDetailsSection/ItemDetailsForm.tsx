
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

interface ItemDetailsFormProps {
  form: UseFormReturn<CreateOrderFormValues>;
  insuranceEnabled: boolean;
}

export function ItemDetailsForm({ form, insuranceEnabled }: ItemDetailsFormProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artikelname*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Sofa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorie*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Möbel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gewicht (kg)*</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="z.B. 15.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {insuranceEnabled ? "Warenwert (€)*" : "Warenwert (€, optional)"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="z.B. 499.99" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breite (cm)*</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="z.B. 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Höhe (cm)*</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="z.B. 50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiefe (cm)*</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="z.B. 30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
