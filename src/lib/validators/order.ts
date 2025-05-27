
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

export type OrderSchemaType = z.infer<typeof OrderSchema>;
