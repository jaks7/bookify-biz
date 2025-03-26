export interface Business {
  uid: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  cif: string;
  type_of_business: string;
  main_contact_user?: string;
  configuration_is_completed?: boolean;
}

export interface BusinessConfig {
  uid: string;
  business: string;
  days_advance_booking: number;
  time_advance_cancel_reschedule: number;
  new_clients_can_book: boolean;
  new_clients_ask_sms_confirmation: boolean;
  business_hours: {
    [key: string]: {
      start: string;
      end: string;
    }[];
  };
  public_list_business: boolean;
  public_list_services: boolean;
  allow_choose_professional: boolean;
  professional_schedule_enabled: boolean;
}
