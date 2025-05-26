
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string()
    .min(1, "E-Mail ist erforderlich")
    .email("Ungültige E-Mail-Adresse"),

  password: z.string()
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein")
    .regex(/^[a-zA-Z0-9]+$/, "Passwort darf nur Buchstaben und Zahlen enthalten"),

  first_name: z.string()
    .min(2, "Vorname ist erforderlich"),

  last_name: z.string()
    .min(2, "Nachname ist erforderlich"),

  name_affix: z.string()
    .max(50, "Namenszusatz darf maximal 50 Zeichen lang sein")
    .optional(),

  phone: z.string()
    .min(5, "Telefonnummer ist erforderlich"),

  region: z.string()
    .min(2, "Region ist erforderlich"),

  postal_code: z.string()
    .min(3, "Postleitzahl ist erforderlich"),

  city: z.string()
    .min(2, "Stadt ist erforderlich"),

  street: z.string()
    .optional(),

  house_number: z.string()
    .optional(),

  address_extra: z.string()
    .optional(),

  role: z.enum(["sender_private", "sender_business", "driver"], {
    required_error: "Bitte wähle eine Rolle aus",
  }),

  company_name: z.string()
    .max(100, "Firmenname darf maximal 100 Zeichen lang sein")
    .optional(),
})
.superRefine((data, ctx) => {
  // Wenn Rolle geschäftlich ist → Firmenname Pflicht
  if (data.role === "sender_business") {
    if (!data.company_name || data.company_name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Firmenname ist erforderlich für geschäftliche Sender",
        path: ["company_name"],
      });
    }
  }

  // Wenn Straße eingetragen ist, muss Hausnummer folgen
  if (data.street && !data.house_number) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Hausnummer ist erforderlich, wenn eine Straße angegeben wurde",
      path: ["house_number"],
    });
  }
});

export type RegisterFormData = z.infer<typeof registerSchema>;
