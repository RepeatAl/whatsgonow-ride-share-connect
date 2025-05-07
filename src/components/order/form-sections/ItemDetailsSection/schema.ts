
import { z } from "zod";

export const itemDetailsSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().optional(),
  imageUrl: z.string().optional()
});

export type ItemDetailsFormValues = z.infer<typeof itemDetailsSchema>;
