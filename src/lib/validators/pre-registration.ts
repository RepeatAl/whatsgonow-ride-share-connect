
import * as z from "zod";
import i18next from "i18next";

export const createPreRegistrationSchema = () => {
  const t = i18next.t;
  
  return z.object({
    first_name: z.string().min(2, t("errors.min_length", { count: 2 })),
    last_name: z.string().min(2, t("errors.min_length", { count: 2 })),
    email: z.string().email(t("errors.invalid_email")),
    postal_code: z.string().min(4, t("errors.invalid_postal")),
    wants_driver: z.boolean().default(false),
    wants_cm: z.boolean().default(false),
    wants_sender: z.boolean().default(false),
    vehicle_types: z.array(
      z.enum(["S", "M", "L", "XL", "XXL", "MOPED", "BIKE", "BOAT", "PLANE"])
    ).optional(),
    gdpr_consent: z.boolean().refine((val) => val === true, {
      message: t("errors.gdpr_required")
    })
  }).superRefine((data, ctx) => {
    if (data.wants_driver) {
      if (!data.vehicle_types || data.vehicle_types.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehicle_types"],
          message: t("errors.vehicle_required")
        });
      }
    }
  });
};

// Create initial schema with current language
export const preRegistrationSchema = createPreRegistrationSchema();

// Re-export the type
export type PreRegistrationFormData = z.infer<typeof preRegistrationSchema>;

// Subscribe to language changes to update schema validation messages
i18next.on('languageChanged', () => {
  // This will ensure validation messages are updated when language changes
  Object.assign(preRegistrationSchema, createPreRegistrationSchema());
});
