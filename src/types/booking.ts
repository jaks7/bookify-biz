
export interface Client {
  client_id: number;
  name: string;
  surnames: string;
  fullname: string;
  phone: string;
}

export interface BookingProfessional {
  professional_id: number;
  name: string;
  surnames: string;
  fullname: string;
}

export interface BookingService {
  service_id: number;
  name: string;
}

export interface Booking {
  booking_id: string;
  business: string;
  start_datetime: string;
  end_datetime: string;
  client?: Client;
  professional?: BookingProfessional;
  service?: BookingService;
  cancelled: boolean;
  duration: number;
  title?: string; // Present for calendar blocks, absent for client bookings
}

export type BookingType = "reservation" | "block";

export interface BookingFormData {
  title?: string;
  professional_id?: number;
  start_datetime: string;
  end_datetime: string;
  client_id?: number;
  service_id?: number;
  booking_type: BookingType;
}
