
import { z } from "zod";

export const createRideSchema = z.object({
  start_address: z.string().min(5, "Startadresse muss mindestens 5 Zeichen haben"),
  end_address: z.string().min(5, "Zieladresse muss mindestens 5 Zeichen haben"),
  departure_time: z.string().min(1, "Abfahrtszeit ist erforderlich"),
  arrival_time: z.string().optional(),
  available_capacity_kg: z.number().min(1, "Kapazität muss mindestens 1 kg sein"),
  available_capacity_m3: z.number().min(0.1, "Volumen muss mindestens 0,1 m³ sein"),
  price_per_kg: z.number().min(0, "Preis muss mindestens 0 € sein"),
  description: z.string().optional(),
  vehicle_type: z.string().min(1, "Fahrzeugtyp ist erforderlich"),
  start_postal_code: z.string().min(5, "Startpostleitzahl ist erforderlich"),
  end_postal_code: z.string().min(5, "Zielpostleitzahl ist erforderlich"),
  flexible_time: z.boolean().default(false),
  flexible_time_hours: z.number().min(0).max(24).default(0)
});

export type CreateRideForm = z.infer<typeof createRideSchema>;

export interface Ride {
  id: string;
  driver_id: string;
  start_address: string;
  end_address: string;
  departure_time: string;
  arrival_time?: string;
  available_capacity_kg?: number;
  available_capacity_m3?: number;
  price_per_kg?: number;
  description?: string;
  status: 'published' | 'booked' | 'completed' | 'cancelled';
  vehicle_type?: string;
  start_postal_code?: string;
  end_postal_code?: string;
  flexible_time?: boolean;
  flexible_time_hours?: number;
  created_at: string;
  updated_at: string;
}
