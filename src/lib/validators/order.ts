
import { z } from "zod";

// Validator für einzelne Artikeldaten
export const itemDetailsSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().optional(),
  imageUrl: z.string().optional()
});

// Hauptschema für das Auftragsformular
export const createOrderSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().optional(),
  pickupStreet: z.string().min(1, "Straße ist erforderlich"),
  pickupHouseNumber: z.string().min(1, "Hausnummer ist erforderlich"),
  pickupPostalCode: z.string().min(4, "PLZ ist erforderlich"),
  pickupCity: z.string().min(1, "Stadt ist erforderlich"),
  pickupCountry: z.string().min(1, "Land ist erforderlich"),
  pickupAddressExtra: z.string().optional(),
  pickupPhone: z.string().optional(),
  pickupEmail: z.string().email("Gültige E-Mail erforderlich").optional().or(z.literal("")),
  deliveryStreet: z.string().min(1, "Straße ist erforderlich"),
  deliveryHouseNumber: z.string().min(1, "Hausnummer ist erforderlich"),
  deliveryPostalCode: z.string().min(4, "PLZ ist erforderlich"),
  deliveryCity: z.string().min(1, "Stadt ist erforderlich"),
  deliveryCountry: z.string().min(1, "Land ist erforderlich"),
  deliveryAddressExtra: z.string().optional(),
  deliveryPhone: z.string().optional(),
  deliveryEmail: z.string().email("Gültige E-Mail erforderlich").optional().or(z.literal("")),
  itemName: z.string().min(1, "Artikelname ist erforderlich"),
  category: z.string().min(1, "Kategorie ist erforderlich"),
  width: z.number({ required_error: "Breite ist erforderlich" }).positive("Wert muss größer als 0 sein"),
  height: z.number({ required_error: "Höhe ist erforderlich" }).positive("Wert muss größer als 0 sein"),
  depth: z.number({ required_error: "Tiefe ist erforderlich" }).positive("Wert muss größer als 0 sein"),
  weight: z.number({ required_error: "Gewicht ist erforderlich" }).positive("Wert muss größer als 0 sein"),
  value: z.number().optional(),
  insurance: z.boolean().default(false),
  fragile: z.boolean().default(false),
  loadAssistance: z.boolean().default(false),
  toolsRequired: z.string().optional(),
  securityMeasures: z.string().optional(),
  price: z.number().optional(),
  negotiable: z.boolean().default(false),
  preferredVehicleType: z.string().optional(),
  pickupTimeStart: z.date().optional(),
  pickupTimeEnd: z.date().optional(),
  deliveryTimeStart: z.date().optional(),
  deliveryTimeEnd: z.date().optional(),
  deadline: z.date().optional(),
  // Neue Felder für detaillierte Artikelbeschreibungen
  items: z.array(itemDetailsSchema).optional()
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
export type ItemDetailsFormValues = z.infer<typeof itemDetailsSchema>;
