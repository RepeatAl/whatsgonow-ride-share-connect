
import * as z from "zod";
import i18next from "i18next";
import { zodMessage } from "../utils/zodMessage";
import { VehicleType } from "@/components/pre-registration/VehicleTypeSelector";

export const createPreRegistrationSchema = () => {
  // Use the standard i18next.t function directly which has the correct type
  const t = i18next.t.bind(i18next);
  
  return z.object({
    first_name: z.string().min(2, { message: zodMessage(t, "min_length", { count: 2, ns: 'errors' }) }),
    last_name: z.string().min(2, { message: zodMessage(t, "min_length", { count: 2, ns: 'errors' }) }),
    email: z.string().email({ message: zodMessage(t, "invalid_email", { ns: 'errors' }) }),
    postal_code: z.string().min(4, { message: zodMessage(t, "invalid_postal", { ns: 'errors' }) }),
    wants_driver: z.boolean().default(false),
    wants_cm: z.boolean().default(false),
    wants_sender: z.boolean().default(false),
    vehicle_types: z.array(
      z.enum(["S", "M", "L", "XL", "XXL", "MOPED", "BIKE", "BOAT", "PLANE"] as [VehicleType, ...VehicleType[]])
    ).optional(),
    gdpr_consent: z.boolean().refine(val => val === true, {
      message: zodMessage(t, "gdpr_required", { ns: 'errors' })
    })
  }).superRefine((data, ctx) => {
    if (data.wants_driver) {
      if (!data.vehicle_types || data.vehicle_types.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehicle_types"],
          message: zodMessage(t, "vehicle_required", { ns: 'errors' })
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
