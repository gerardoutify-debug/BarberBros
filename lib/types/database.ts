export type ServiceCategory = 'corte' | 'barba' | 'tratamiento' | 'combo';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ServiceCategory;
  duration_minutes: number;
  price: number;
  thumbnail_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  specialties: string[];
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  document_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  appointment_code: string;
  user_id: string | null;
  service_id: string;
  barber_id: string | null;
  guest_full_name: string;
  guest_email: string;
  guest_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  service?: Service;
  barber?: Barber;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

export interface ShopConfig {
  key: string;
  value: Record<string, unknown>;
}
