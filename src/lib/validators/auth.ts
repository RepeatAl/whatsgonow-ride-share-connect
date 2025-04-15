
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string()
    .min(1, "E-Mail ist erforderlich")
    .email("Ungültige E-Mail-Adresse"),
  password: z.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
    .regex(/[0-9]/, "Passwort muss mindestens eine Zahl enthalten"),
  name: z.string()
    .min(2, "Name muss mindestens 2 Zeichen lang sein")
    .max(50, "Name darf maximal 50 Zeichen lang sein"),
  role: z.enum(["sender_private", "sender_business", "driver"], {
    required_error: "Bitte wählen Sie eine Rolle aus"
  }),
  company_name: z.string()
    .min(2, "Firmenname muss mindestens 2 Zeichen lang sein")
    .max(100, "Firmenname darf maximal 100 Zeichen lang sein")
    .optional()
    .nullable(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
