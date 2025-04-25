
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

interface GeneralInformationSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
}

export const GeneralInformationSection = ({ form }: GeneralInformationSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Allgemeine Informationen</h3>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel*</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Transport von Möbeln" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Beschreiben Sie Ihren Transportauftrag..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
