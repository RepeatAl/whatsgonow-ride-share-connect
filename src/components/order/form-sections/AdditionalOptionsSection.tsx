
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

interface AdditionalOptionsSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
}

export const AdditionalOptionsSection = ({ form }: AdditionalOptionsSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Zusätzliche Optionen</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Angebotener Preis (€)*</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="z.B. 50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredVehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bevorzugter Fahrzeugtyp</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Transporter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 mt-4">
        <div className="grid gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="negotiable"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Preis verhandelbar</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Versicherung</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fragile"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Zerbrechlich</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loadAssistance"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Hilfe beim Be- und Entladen</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="toolsRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benötigte Werkzeuge</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Sackkarre, Spanngurte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="securityMeasures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sicherheitsmaßnahmen</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="z.B. Besondere Vorsicht beim Transport, Verpackungsanweisungen"
                  className="min-h-[80px]"
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
