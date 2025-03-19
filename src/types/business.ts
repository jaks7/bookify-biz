
export interface Business {
  business_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  cif: string;
  type_of_business: string;
  main_contact_user: string;
  configuration_is_completed: boolean;
  days_advance_booking?: number;
  time_advance_cancel_reschedule?: number;
  new_clients_can_book?: boolean;
  new_clients_ask_sms_confirmation?: boolean;
  working_days?: number[];
  working_hours?: string[][];
  public_list_business?: boolean;
  public_list_services?: boolean;
} 
