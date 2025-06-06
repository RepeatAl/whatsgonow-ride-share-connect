
import { z } from 'zod';

export const OrderSchema = z.object({
  pickup_address: z.string().min(1, 'Abholadresse ist erforderlich'),
  pickup_city: z.string().min(1, 'Stadt ist erforderlich'),
  pickup_zip: z.string().min(1, 'PLZ ist erforderlich'),
  delivery_address: z.string().min(1, 'Lieferadresse ist erforderlich'),
  delivery_city: z.string().min(1, 'Stadt ist erforderlich'),
  delivery_zip: z.string().min(1, 'PLZ ist erforderlich'),
  items: z.array(z.object({
    name: z.string().min(1, 'Artikelname ist erforderlich'),
    quantity: z.number().min(1, 'Menge muss mindestens 1 sein'),
    weight: z.number().optional(),
    dimensions: z.string().optional(),
  })).min(1, 'Mindestens ein Artikel ist erforderlich'),
  notes: z.string().optional(),
});

export type OrderValues = z.infer<typeof OrderSchema>;
