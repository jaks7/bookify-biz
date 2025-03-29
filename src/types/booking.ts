
export type BookingStatus = "confirmed" | "cancelled" | "pending";
export type BookingType = "reservation" | "block";

export interface Client {
  client_id?: number;
  fullname: string;
  email?: string;
  phone?: string;
}

export interface Booking {
  booking_id: string;
  client?: Client;
  client_name?: string;
  service?: {
    id?: string | number;
    name: string;
    duration?: number;
  };
  service_name?: string;
  professional?: {
    professional_id?: number;
    name: string;
  };
  professional_name?: string;
  professional_id?: number;
  status?: BookingStatus;
  title?: string;
  start_datetime: string;
  datetime_start?: string;
  end_datetime: string;
  datetime_end?: string;
  notes?: string;
  color?: string;
}

export interface BookingFormData {
  booking_id?: string;
  booking_type: BookingType;
  client_id?: number;
  client_name?: string;
  service_id?: number;
  professional_id?: number;
  start_datetime: string;
  end_datetime: string;
  title?: string;
  notes?: string;
  status?: BookingStatus;
}
