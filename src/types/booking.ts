export interface BusinessDetail {
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  business_hours: {
    [key: string]: Array<{ start: string; end: string; }>;
  };
  services: Array<{
    service_id?: number;
    id?: number;
    name: string;
    duration: number;
    price: number;
  }>;
  showConfirmationAsStep?: boolean;
}

export interface BookingRequest {
  start_datetime: string;
  end_datetime: string;
  service_id: number;
  professional_id: number;
  phone: string;
  name: string;
  email: string;
}
