
import * as z from "zod";

export const preRegistrationSchema = z.object({
  first_name: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein"),
  last_name: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  postal_code: z.string().min(4, "Ungültige Postleitzahl"),
  wants_driver: z.boolean().default(false),
  wants_cm: z.boolean().default(false),
  wants_sender: z.boolean().default(false),
  vehicle_types: z.object({
    car: z.array(z.enum(["S", "M", "L", "XL", "XXL"])).optional(),
    motorcycle: z.boolean().optional(),
    bicycle: z.boolean().optional(),
    ship: z.boolean().optional(),
    plane: z.boolean().optional(),
    other: z.string().optional()
  }).optional(),
  gdpr_consent: z.boolean().refine((val) => val === true, {
    message: "Bitte stimmen Sie den Datenschutzbestimmungen zu"
  })
});

export type PreRegistrationFormData = z.infer<typeof preRegistrationSchema>;
