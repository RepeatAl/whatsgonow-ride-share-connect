
import { z } from "zod";

export const createOrderSchema = z.object({
  // Allgemeine Informationen
  title: z.string().min(3, { message: "Titel muss mindestens 3 Zeichen lang sein" }),
  description: z.string().min(10, { message: "Beschreibung muss mindestens 10 Zeichen lang sein" }),
  
  // Abholadresse
  pickupStreet: z.string().min(2, { message: "Straße ist erforderlich" }),
  pickupHouseNumber: z.string().min(1, { message: "Hausnummer ist erforderlich" }),
  pickupPostalCode: z.string().min(4, { message: "Gültige Postleitzahl ist erforderlich" }),
  pickupCity: z.string().min(2, { message: "Stadt ist erforderlich" }),
  pickupCountry: z.string().min(2, { message: "Land ist erforderlich" }),
  pickupAddressExtra: z.string().optional(),
  pickupPhone: z.string().optional(),
  pickupEmail: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.string().length(0)),
  
  // Zieladresse
  deliveryStreet: z.string().min(2, { message: "Straße ist erforderlich" }),
  deliveryHouseNumber: z.string().min(1, { message: "Hausnummer ist erforderlich" }),
  deliveryPostalCode: z.string().min(4, { message: "Gültige Postleitzahl ist erforderlich" }),
  deliveryCity: z.string().min(2, { message: "Stadt ist erforderlich" }),
  deliveryCountry: z.string().min(2, { message: "Land ist erforderlich" }),
  deliveryAddressExtra: z.string().optional(),
  deliveryPhone: z.string().optional(),
  deliveryEmail: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.string().length(0)),

  // Artikelinformationen
  itemName: z.string().min(3, { message: "Artikelname muss mindestens 3 Zeichen lang sein" }),
  category: z.string().min(1, { message: "Kategorie ist erforderlich" }),
  
  // Maße
  width: z.coerce.number().positive({ message: "Breite muss positiv sein" }),
  height: z.coerce.number().positive({ message: "Höhe muss positiv sein" }),
  depth: z.coerce.number().positive({ message: "Tiefe muss positiv sein" }),
  
  // Gewicht und Wert
  weight: z.coerce.number().positive({ message: "Gewicht muss positiv sein" }),
  value: z.coerce.number().nonnegative().optional(),

  // Zusätzliche Optionen
  fragile: z.boolean().default(false),
  loadAssistance: z.boolean().default(false),
  toolsRequired: z.string().optional(),
  securityMeasures: z.string().optional(),
  preferredVehicleType: z.string().optional(),
  
  // Preis
  price: z.coerce.number().positive({ message: "Preis muss eine positive Zahl sein" }),
  negotiable: z.boolean().default(false),

  // Versicherung
  insurance: z.boolean().default(false),

  // Zeitfenster
  pickupTimeStart: z.date().optional(),
  pickupTimeEnd: z.date().optional(),
  deliveryTimeStart: z.date().optional(),
  deliveryTimeEnd: z.date().optional(),
  deadline: z.coerce.date({
    required_error: "Bitte wählen Sie ein Abholdatum",
  }),
}).refine((data) => {
  // Wenn Versicherung gewählt ist, muss ein Warenwert angegeben sein
  if (data.insurance && (data.value === undefined || data.value <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Bei aktivierter Versicherung muss ein Warenwert angegeben werden",
  path: ["value"],
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
