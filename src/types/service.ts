
export interface Service {
  id: number;
  service_id?: number; // Añadido para compatibilidad
  name: string;
  description?: string;
  duration: number;
  price: number;
  business_id?: string;
  is_active?: boolean;
  professionals?: number[]; // Añadido para compatibilidad
}

export interface BusinessHours {
  start: string;
  end: string;
}

export interface AvailableSlot {
  start: string;
  end: string;
}

export interface DailyAvailability {
  date: string;
  business_hours: BusinessHours[];
  available_slots: AvailableSlot[];
}

// Extend Professional definition for client reservation
export interface Professional {
  id: number;
  professional_id?: number;
  name: string;
  surnames?: string | null;
  fullname: string;
  isWorking: boolean;
  workingHours: BusinessHours[];
  appointments: Appointment[];
}

export interface Appointment {
  id: string;
  time: string;
  duration: number;
  clientName: string;
  service: string;
}
