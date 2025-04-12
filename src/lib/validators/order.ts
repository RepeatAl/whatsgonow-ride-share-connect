
import { z } from "zod";

export const createOrderSchema = z.object({
  title: z.string().min(3, { message: "Titel muss mindestens 3 Zeichen lang sein" }),
  description: z.string().min(10, { message: "Beschreibung muss mindestens 10 Zeichen lang sein" }),
  pickupAddress: z.string().min(5, { message: "Abholadresse ist erforderlich" }),
  deliveryAddress: z.string().min(5, { message: "Zieladresse ist erforderlich" }),
  weight: z.coerce.number().positive({ message: "Gewicht muss eine positive Zahl sein" }),
  dimensions: z.string().optional(),
  value: z.coerce.number().nonnegative().optional(),
  insurance: z.boolean().default(false),
  pickupTimeStart: z.date().optional(),
  pickupTimeEnd: z.date().optional(),
  deliveryTimeStart: z.date().optional(),
  deliveryTimeEnd: z.date().optional(),
  deadline: z.date().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

// Added for the Submit Offer functionality
export const submitOfferSchema = z.object({
  price: z.coerce.number()
    .positive({ message: "Preis muss eine positive Zahl sein" })
    .min(1, { message: "Bitte geben Sie einen gültigen Preis ein" }),
  message: z.string().optional(),
});

export type SubmitOfferFormValues = z.infer<typeof submitOfferSchema>;
