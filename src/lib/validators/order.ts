import { z } from "zod";

export const createOrderSchema = z.object({
  // Bisherige Felder
  title: z.string().min(3, { message: "Titel muss mindestens 3 Zeichen lang sein" }),
  description: z.string().min(10, { message: "Beschreibung muss mindestens 10 Zeichen lang sein" }),
  pickupAddress: z.string().min(5, { message: "Abholadresse ist erforderlich" }),
  deliveryAddress: z.string().min(5, { message: "Zieladresse ist erforderlich" }),

  // Neue Artikelfelder
  itemName: z.string().min(3, { message: "Artikelname muss mindestens 3 Zeichen lang sein" }),
  category: z.string().min(1, { message: "Kategorie ist erforderlich" }),
  fragile: z.boolean().default(false),
  loadAssistance: z.boolean().default(false),
  toolsRequired: z.string().optional(),
  securityMeasures: z.string().optional(),

  // Technische Felder
  weight: z.coerce.number().positive({ message: "Gewicht muss positiv sein" }),
  dimensions: z.string().optional(),
  value: z.coerce.number().nonnegative().optional(),

  // Preis‑Felder
  price: z.coerce.number().positive({ message: "Preis muss eine positive Zahl sein" }),
  negotiable: z.boolean().default(false),
  preferredVehicleType: z.string().optional(),

  // Versicherung
  insurance: z.boolean().default(false),

  // Zeitfenster
  pickupTimeStart: z.date().optional(),
  pickupTimeEnd: z.date().optional(),
  deliveryTimeStart: z.date().optional(),
  deliveryTimeEnd: z.date().optional(),
  deadline: z.date().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
