import { z } from "zod";

export const registerSchema = z.object({
  email: z.string()
    .min(1, "E-Mail ist erforderlich")
    .email("Ungültige E-Mail-Adresse"),

  password: z.string()
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein")
    .regex(/^[a-zA-Z0-9]+$/, "Passwort darf nur Buchstaben und Zahlen enthalten"),

  name: z.string()
    .min(2, "Name muss mindestens 2 Zeichen lang sein")
    .max(50, "Name darf maximal 50 Zeichen lang sein"),

  role: z.enum(["sender_private", "sender_business", "driver"], {
    required_error: "Bitte wählen Sie eine Rolle aus",
  }),

  company_name: z.string()
    .min(2, "Firmenname ist erforderlich")
    .max(100, "Firmenname darf maximal 100 Zeichen lang sein")
    .optional(),

  region: z.string()
    .min(2, "Region ist erforderlich")
    .max(100, "Region darf maximal 100 Zeichen lang sein"),
})
.refine((data) => {
  // Wenn die Rolle "sender_business" ist, dann muss ein Firmenname vorhanden sein
  if (data.role === "sender_business" && !data.company_name) {
    return false;
  }
  return true;
}, {
  message: "Firmenname ist erforderlich für geschäftliche Sender",
  path: ["company_name"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
