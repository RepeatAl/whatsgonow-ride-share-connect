
import { z } from 'zod';

export const OrderSchema = z.object({
  pickupAddress: z.string().min(1, 'Abholadresse ist erforderlich'),
  deliveryAddress: z.string().min(1, 'Lieferadresse ist erforderlich'),
  pickupDate: z.date({
    required_error: 'Abholdatum ist erforderlich',
  }),
  itemDetails: z.array(z.object({
    name: z.string().min(1, 'Artikelname ist erforderlich'),
    quantity: z.number().min(1, 'Menge muss mindestens 1 sein'),
    weight: z.number().min(0.1, 'Gewicht muss mindestens 0.1 kg sein'),
    dimensions: z.object({
      length: z.number().min(1, 'Länge muss mindestens 1 cm sein'),
      width: z.number().min(1, 'Breite muss mindestens 1 cm sein'),
      height: z.number().min(1, 'Höhe muss mindestens 1 cm sein'),
    }),
  })).min(1, 'Mindestens ein Artikel ist erforderlich'),
  transportRequirements: z.array(z.string()),
  additionalNotes: z.string().optional(),
});

export const createOrderSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  pickupStreet: z.string().min(1, 'Straße ist erforderlich'),
  pickupHouseNumber: z.string().min(1, 'Hausnummer ist erforderlich'),
  pickupPostalCode: z.string().min(1, 'PLZ ist erforderlich'),
  pickupCity: z.string().min(1, 'Stadt ist erforderlich'),
  pickupCountry: z.string().min(1, 'Land ist erforderlich'),
  pickupAddressExtra: z.string().optional(),
  pickupPhone: z.string().optional(),
  pickupEmail: z.string().optional(),
  deliveryStreet: z.string().min(1, 'Straße ist erforderlich'),
  deliveryHouseNumber: z.string().min(1, 'Hausnummer ist erforderlich'),
  deliveryPostalCode: z.string().min(1, 'PLZ ist erforderlich'),
  deliveryCity: z.string().min(1, 'Stadt ist erforderlich'),
  deliveryCountry: z.string().min(1, 'Land ist erforderlich'),
  deliveryAddressExtra: z.string().optional(),
  deliveryPhone: z.string().optional(),
  deliveryEmail: z.string().optional(),
  itemName: z.string().min(1, 'Artikelname ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  width: z.number().optional(),
  height: z.number().optional(),
  depth: z.number().optional(),
  weight: z.number().optional(),
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
});

export type OrderSchemaType = z.infer<typeof OrderSchema>;
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
