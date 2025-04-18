import { Control } from "react-hook-form";
import { RegisterFormData } from "./RegisterFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterFormFieldsProps {
  control: Control<RegisterFormData>;
  selectedRole: string;
}

export const RegisterFormFields = ({
  control,
  selectedRole,
}: RegisterFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-Mail</FormLabel>
            <FormControl>
              <Input placeholder="deine@email.de" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passwort</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ansprechpartner</FormLabel>
            <FormControl>
              <Input placeholder="Max Mustermann" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="region"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Region</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Wähle deine Region" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="berlin">Berlin</SelectItem>
                <SelectItem value="hamburg">Hamburg</SelectItem>
                <SelectItem value="munich">München</SelectItem>
                <SelectItem value="cologne">Köln</SelectItem>
                <SelectItem value="frankfurt">Frankfurt</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rolle</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Wähle deine Rolle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sender_private">Privater Sender</SelectItem>
                <SelectItem value="sender_business">Geschäftlicher Sender</SelectItem>
                <SelectItem value="driver">Fahrer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedRole === "sender_business" && (
        <FormField
          control={control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firmenname <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Firma GmbH" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
